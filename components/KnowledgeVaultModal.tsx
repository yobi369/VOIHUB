import React, { useEffect, useRef, useState } from 'react';
import { Database, Download, Play, Search, Square, Trash2, X } from 'lucide-react';
import { SUBJECT_METAS } from '../constants';
import { getModulesForGradeSubject } from '../data/curriculum';
import { generateDeepLesson } from '../services/geminiService';
import {
  clearVaultLessons,
  exportVaultArchive,
  formatBytes,
  getAllCachedLessons,
  getVaultSummary,
  saveLessonToVault,
  type StoredLessonRecord,
} from '../services/knowledgeVault';
import type { CurriculumModule, VaultStorageSummary } from '../types';

interface KnowledgeVaultModalProps {
  onClose: () => void;
  onOpenModule: (mod: CurriculumModule) => void;
}

const KnowledgeVaultModal: React.FC<KnowledgeVaultModalProps> = ({ onClose, onOpenModule }) => {
  const [summary, setSummary] = useState<VaultStorageSummary | null>(null);
  const [cachedRecords, setCachedRecords] = useState<StoredLessonRecord[]>([]);
  const [filterText, setFilterText] = useState('');
  const [batchGrade, setBatchGrade] = useState(3);
  const [batchSubject, setBatchSubject] = useState('Artificial Intelligence');
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0, currentTitle: '' });
  const [batchError, setBatchError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const refreshVault = async () => {
    try {
      const [s, records] = await Promise.all([getVaultSummary(), getAllCachedLessons()]);
      setSummary(s);
      setCachedRecords(records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    } catch (err) {
      console.error('Vault inspection error:', err);
    }
  };

  useEffect(() => {
    refreshVault();
  }, []);

  const handleBatchSynthesize = async () => {
    const modules = getModulesForGradeSubject(batchGrade, batchSubject);
    if (modules.length === 0) return;

    cancelRef.current = false;
    setIsBatchRunning(true);
    setBatchError(null);
    setBatchProgress({ done: 0, total: modules.length, currentTitle: '' });

    for (let i = 0; i < modules.length; i++) {
      if (cancelRef.current) break;
      const mod = modules[i];
      setBatchProgress({ done: i, total: modules.length, currentTitle: mod.title });

      const alreadyCached = cachedRecords.some((r) => r.moduleId === mod.id);
      if (alreadyCached) continue;

      try {
        const monograph = await generateDeepLesson({
          moduleId: mod.id,
          grade: mod.grade,
          subjectName: mod.subjectName,
          unitTitle: mod.unitTitle,
          topic: mod.title,
          depthLevel: 'standard',
        });
        await saveLessonToVault(monograph);
        await refreshVault();
      } catch (err: any) {
        setBatchError(err?.message || 'Batch synthesis interrupted by server error.');
        break;
      }
    }

    setBatchProgress((p) => ({ ...p, done: p.total, currentTitle: '' }));
    setIsBatchRunning(false);
    await refreshVault();
  };

  const handleStopBatch = () => {
    cancelRef.current = true;
    setIsBatchRunning(false);
  };

  const handleExport = async () => {
    const json = await exportVaultArchive();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voi-hub-knowledge-vault-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCache = async () => {
    await clearVaultLessons();
    await refreshVault();
  };

  const filteredRecords = cachedRecords.filter((rec) => {
    const q = filterText.trim().toLowerCase();
    if (!q) return true;
    return (
      rec.content.topic.toLowerCase().includes(q) ||
      rec.content.subjectName.toLowerCase().includes(q) ||
      `class ${rec.content.grade}`.includes(q) ||
      `grade ${rec.content.grade}`.includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-700" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">IndexedDB Knowledge Vault &amp; Offline Archive</h2>
              <p className="text-xs text-slate-500">Persistent multi-gigabyte browser storage for synthesized monographs, flashcards, and notes.</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Knowledge Vault" className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Storage Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
              <div className="text-xs text-slate-500">Archived Monographs</div>
              <div className="text-xl font-bold font-mono-math text-slate-900 mt-1">{summary?.cachedLessonsCount ?? 0}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
              <div className="text-xs text-slate-500">Vault Payload Size</div>
              <div className="text-xl font-bold font-mono-math text-blue-700 mt-1">{formatBytes(summary?.totalVaultBytes ?? 0)}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
              <div className="text-xs text-slate-500">SM-2 Cards &amp; Notes</div>
              <div className="text-xl font-bold font-mono-math text-slate-900 mt-1">
                {(summary?.flashcardsReviewedCount ?? 0) + (summary?.notesCount ?? 0)}
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
              <div className="text-xs text-slate-500">Browser Storage Quota</div>
              <div className="text-xl font-bold font-mono-math text-emerald-700 mt-1">
                {summary?.browserQuotaBytes ? formatBytes(summary.browserQuotaBytes) : 'Quota Active'}
              </div>
            </div>
          </div>

          {/* Batch Curriculum Pack Downloader */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Synthesize &amp; Archive Offline Class Pack</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Batch-generate all 32 deep modules for any Class and Tech Track and store them locally for instant offline study.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={batchGrade}
                  onChange={(e) => setBatchGrade(Number(e.target.value))}
                  disabled={isBatchRunning}
                  className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-800"
                >
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((g) => (
                    <option key={g} value={g}>Class {g}</option>
                  ))}
                </select>
                <select
                  value={batchSubject}
                  onChange={(e) => setBatchSubject(e.target.value)}
                  disabled={isBatchRunning}
                  className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-800"
                >
                  {SUBJECT_METAS.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
                {!isBatchRunning ? (
                  <button
                    onClick={handleBatchSynthesize}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-blue-700 text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" /> Archive 32 Modules
                  </button>
                ) : (
                  <button
                    onClick={handleStopBatch}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 whitespace-nowrap shrink-0"
                  >
                    <Square className="w-3.5 h-3.5" /> Stop Batch
                  </button>
                )}
              </div>
            </div>

            {isBatchRunning && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="truncate">Synthesizing: {batchProgress.currentTitle}</span>
                  <span className="font-mono-math shrink-0">{batchProgress.done} / {batchProgress.total}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 transition-all duration-300"
                    style={{ width: `${batchProgress.total > 0 ? (batchProgress.done / batchProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}

            {batchError && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
                {batchError}
              </div>
            )}
          </div>

          {/* Cached Monographs Browser */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900">Archived Monographs ({cachedRecords.length})</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Filter vault..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md w-48 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
                {cachedRecords.length > 0 && (
                  <button
                    onClick={handleClearCache}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-rose-200 rounded-md text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Cache
                  </button>
                )}
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
                No synthesized monographs archived yet. Open any lesson or run a Grade Pack download above to store lessons locally.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
                {filteredRecords.map((rec) => (
                  <button
                    key={rec.moduleId}
                    onClick={() => {
                      const fallbackMod: CurriculumModule = {
                        id: rec.moduleId,
                        grade: rec.content?.grade ?? 3,
                        subjectId: (rec.content?.subjectName || 'Artificial Intelligence').toLowerCase().includes('network')
                          ? 'networking'
                          : (rec.content?.subjectName || '').toLowerCase().includes('cyber')
                            ? 'cybersecurity'
                            : 'ai',
                        subjectName: rec.content?.subjectName || 'Artificial Intelligence',
                        unitNumber: 1,
                        unitTitle: rec.content?.subtitle || '',
                        moduleNumber: 1,
                        title: rec.content?.topic || rec.moduleId,
                        difficulty: rec.content?.depthLevel === 'olympiad' ? 'Olympiad' : 'Intermediate',
                        estimatedMinutes: rec.content?.estimatedStudyMinutes ?? 30,
                        simType: (rec.content?.subjectName || '').toLowerCase().includes('network')
                          ? 'net-packets'
                          : (rec.content?.subjectName || '').toLowerCase().includes('cyber')
                            ? 'cyber-crypto'
                            : 'ai-perceptron',
                        summary: rec.content?.subtitle || '',
                        keywords: [],
                      };
                      onOpenModule(fallbackMod);
                      onClose();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{rec.content?.topic || rec.moduleId}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Class {rec.content?.grade ?? '-'} · {rec.content?.subjectName || 'TECH HUB'} · {rec.content?.coreConcepts?.length ?? 0} sections · {rec.content?.assessment?.length ?? 0} exam items
                      </div>
                    </div>
                    <span className="text-xs font-mono-math text-slate-600 shrink-0">{formatBytes(rec.byteSize)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeVaultModal;
