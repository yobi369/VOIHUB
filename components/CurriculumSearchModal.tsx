import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { ALL_MODULES, searchCurriculum } from '../data/curriculum';
import type { CurriculumModule } from '../types';

interface CurriculumSearchModalProps {
  onClose: () => void;
  onSelectModule: (mod: CurriculumModule) => void;
}

const CurriculumSearchModal: React.FC<CurriculumSearchModalProps> = ({ onClose, onSelectModule }) => {
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const raw = searchCurriculum(query, 60);
    if (gradeFilter === 'all') return raw.slice(0, 24);
    return raw.filter((m) => m.grade === gradeFilter).slice(0, 24);
  }, [query, gradeFilter]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs z-50 flex items-start justify-center pt-16 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${ALL_MODULES.length.toLocaleString()} Classes 1–9 modules (e.g., "Perceptron", "TCP Handshake", "SHA-256", "Firewall")...`}
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button onClick={onClose} aria-label="Close Search" className="p-1.5 text-slate-400 hover:text-slate-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setGradeFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${gradeFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/70'}`}
          >
            All Classes
          </button>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${gradeFilter === g ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/70'}`}
            >
              C{g}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No modules matched "{query}". Try terms like "Neural", "Packet", "DNS", "Cipher", or "Phishing".
            </div>
          ) : (
            results.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  onSelectModule(mod);
                  onClose();
                }}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{mod.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    Class {mod.grade} · {mod.subjectName} · {mod.unitTitle} · {mod.difficulty}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumSearchModal;
