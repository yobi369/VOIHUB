import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  Cpu,
  FileText,
  FlaskConical,
  Layers,
  Lock,
  RefreshCw,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { getUnitsForGradeSubject } from '../data/curriculum';
import {
  buildSyllabusBriefLesson,
  getBuiltInMonograph,
  normalizeDeepLessonContent,
} from '../data/foundationalLessons';
import { useUserProfile } from '../hooks/useUserProfile';
import { playCorrectAnswerSound, playTopicCompleteSound } from '../services/audioService';
import { generateDeepLesson, generatePracticeDrill, type PracticeProblem } from '../services/geminiService';
import {
  getLessonFromVault,
  getNoteFromVault,
  recordFlashcardReview,
  saveAssessmentAttempt,
  saveLessonToVault,
  saveNoteToVault,
} from '../services/knowledgeVault';
import type { CurriculumModule, DeepLessonContent, SubjectMeta } from '../types';
import ConceptDiagram from './ConceptDiagram';
import LoadingSpinner from './LoadingSpinner';
import SimulationsLab from './SimulationsLab';
import VoiAssistant from './VoiAssistant';

interface LearningModuleProps {
  grade: number;
  subject: SubjectMeta;
  initialModule?: CurriculumModule | null;
  onBack: () => void;
}

type WorkspaceTab = 'treatise' | 'derivations' | 'simulation' | 'flashcards' | 'exam' | 'notes';

const LearningModule: React.FC<LearningModuleProps> = ({ grade, subject, initialModule, onBack }) => {
  const units = useMemo(() => getUnitsForGradeSubject(grade, subject.name), [grade, subject.name]);
  const allModules = useMemo(() => units.flatMap((u) => u.modules), [units]);

  const [activeMod, setActiveMod] = useState<CurriculumModule | null>(
    () => initialModule || allModules[0] || null
  );
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('treatise');
  const [depthLevel, setDepthLevel] = useState<'standard' | 'olympiad'>('standard');
  const [lesson, setLesson] = useState<DeepLessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // Worked Examples progressive reveal
  const [revealedSteps, setRevealedSteps] = useState<Record<number, number>>({});
  const [extraDrills, setExtraDrills] = useState<PracticeProblem[]>([]);
  const [isDrillsLoading, setIsDrillsLoading] = useState(false);
  const [drillsError, setDrillsError] = useState<string | null>(null);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatusMsg, setCardStatusMsg] = useState<string | null>(null);

  // Exam state
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Field Notes state
  const [noteText, setNoteText] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState<string | null>(null);

  // Proposal 4: Read-Aloud & Inline Concept Check state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(grade <= 3 ? 0.88 : 1.0);
  const [conceptCheckPicks, setConceptCheckPicks] = useState<Record<number, string>>({});

  const {
    profile,
    completeTopic,
    recordCorrectQuizAnswer,
    recordFlashcardMastered,
    recordModuleExamScore,
    lockedExamModuleIds,
    examRetakesAllowed,
  } = useUserProfile();

  const completedTopics = useMemo(
    () => profile.progress[grade]?.[subject.name]?.completedTopics || [],
    [profile.progress, grade, subject.name]
  );

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1.02;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [speechRate]
  );

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (initialModule) {
      setActiveMod(initialModule);
    } else if (!activeMod || activeMod.grade !== grade || activeMod.subjectName !== subject.name) {
      setActiveMod(allModules[0] || null);
    }
  }, [initialModule, grade, subject.name, allModules, activeMod]);

  const loadModuleContent = useCallback(
    async (mod: CurriculumModule, requestedDepth: 'standard' | 'olympiad', forceAiRefresh = false) => {
      setSynthesisError(null);
      setRevealedSteps({});
      setExtraDrills([]);
      setDrillsError(null);
      setCardIndex(0);
      setIsFlipped(false);
      setCardStatusMsg(null);
      setExamAnswers({});
      setExamSubmitted(false);
      setConceptCheckPicks({});
      stopSpeech();

      // Load personal field notes
      try {
        const savedNote = await getNoteFromVault(mod.id);
        setNoteText(savedNote?.content || '');
        setNoteSavedAt(savedNote?.updatedAt || null);
      } catch {
        setNoteText('');
        setNoteSavedAt(null);
      }

      if (!forceAiRefresh) {
        // 1. Check IndexedDB Knowledge Vault
        try {
          const cached = await getLessonFromVault(mod.id);
          if (cached && cached.content?.depthLevel === requestedDepth) {
            setLesson(
              normalizeDeepLessonContent(cached.content, {
                moduleId: mod.id,
                grade: mod.grade,
                subjectName: mod.subjectName,
                topic: mod.title,
                depthLevel: requestedDepth,
              })
            );
            return;
          }
        } catch {
          // Proceed if IndexedDB read fails
        }

        // 2. Check Built-In Reference Compendium
        if (requestedDepth === 'standard') {
          const builtIn = getBuiltInMonograph(mod.id);
          if (builtIn) {
            setLesson(normalizeDeepLessonContent(builtIn));
            return;
          }
        }
      }

      // 3. Synthesize via Server-Side Gemini 4 API
      setIsLoading(true);
      setLesson(buildSyllabusBriefLesson(mod));
      try {
        const synthesized = await generateDeepLesson({
          moduleId: mod.id,
          grade: mod.grade,
          subjectName: mod.subjectName,
          unitTitle: mod.unitTitle,
          topic: mod.title,
          depthLevel: requestedDepth,
        });
        const normalized = normalizeDeepLessonContent(synthesized, {
          moduleId: mod.id,
          grade: mod.grade,
          subjectName: mod.subjectName,
          topic: mod.title,
          depthLevel: requestedDepth,
          source: 'ai-monograph',
        });
        setLesson(normalized);
        await saveLessonToVault(normalized).catch(() => {});
      } catch (err: any) {
        setSynthesisError(err?.message || 'Unable to synthesize deep monograph from AI server.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (activeMod) {
      loadModuleContent(activeMod, depthLevel, false);
    }
  }, [activeMod, depthLevel, loadModuleContent]);

  const handleGenerateDrills = async () => {
    if (!activeMod) return;
    setIsDrillsLoading(true);
    setDrillsError(null);
    try {
      const problems = await generatePracticeDrill({
        grade: activeMod.grade,
        subjectName: activeMod.subjectName,
        topic: activeMod.title,
        difficulty: depthLevel === 'olympiad' ? 'Olympiad' : activeMod.difficulty,
      });
      setExtraDrills(problems);
    } catch (err: any) {
      setDrillsError(err?.message || 'Unable to generate practice drill.');
    } finally {
      setIsDrillsLoading(false);
    }
  };

  const handleGradeFlashcard = async (gradeChoice: 'again' | 'good' | 'mastered') => {
    const deck = lesson?.flashcards ?? [];
    if (!lesson || !activeMod || deck.length === 0) return;
    const safeIdx = Math.min(cardIndex, deck.length - 1);
    const card = deck[safeIdx];
    if (!card) return;
    try {
      const updated = await recordFlashcardReview(card.id, activeMod.id, gradeChoice);
      setCardStatusMsg(`Scheduled next review in ${updated.intervalDays} day(s).`);
    } catch {
      setCardStatusMsg('Review recorded for this session.');
    }
    if (gradeChoice === 'mastered') {
      recordFlashcardMastered();
      playCorrectAnswerSound();
    }
    setIsFlipped(false);
    if (safeIdx + 1 < deck.length) {
      setCardIndex(safeIdx + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleSubmitExam = async () => {
    const questions = lesson?.assessment ?? [];
    if (!lesson || !activeMod || questions.length === 0) return;
    let score = 0;
    for (const q of questions) {
      if (examAnswers[q.id] === q.correctAnswer) {
        score++;
        recordCorrectQuizAnswer();
      }
    }
    setExamSubmitted(true);
    const percentage = Math.round((score / questions.length) * 100);
    recordModuleExamScore(activeMod.id, percentage);
    await saveAssessmentAttempt({
      id: `${activeMod.id}-${Date.now()}`,
      moduleId: activeMod.id,
      topic: activeMod.title,
      grade: activeMod.grade,
      subjectName: activeMod.subjectName,
      score,
      total: questions.length,
      percentage,
      completedAt: new Date().toISOString(),
    }).catch(() => {});

    if (percentage >= 60) {
      completeTopic(activeMod.grade, activeMod.subjectName, activeMod.title);
      playTopicCompleteSound();
    }
  };

  const handleSaveNotes = async () => {
    if (!activeMod) return;
    await saveNoteToVault(activeMod.id, activeMod.title, noteText);
    setNoteSavedAt(new Date().toISOString());
  };

  if (!activeMod) {
    return (
      <div className="p-8 text-center text-slate-600">
        No curriculum modules found for Grade {grade} {subject.name}.
      </div>
    );
  }

  const isCompleted = completedTopics.includes(activeMod.title);
  const flashcards = lesson?.flashcards ?? [];
  const assessment = lesson?.assessment ?? [];
  const prerequisites = lesson?.prerequisites ?? [];
  const learningObjectives = lesson?.learningObjectives ?? [];
  const coreConcepts = lesson?.coreConcepts ?? [];
  const workedExamples = lesson?.workedExamples ?? [];
  const commonMisconceptions = lesson?.commonMisconceptions ?? [];
  const furtherInquiry = lesson?.furtherInquiry ?? [];
  const safeCardIndex = flashcards.length > 0 ? Math.min(cardIndex, flashcards.length - 1) : 0;
  const currentCard = flashcards[safeCardIndex];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Syllabus Rail */}
        <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden lg:sticky lg:top-20 max-h-[calc(100vh-110px)] flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Class {grade} Tracks
            </button>
            <h2 className="text-base font-bold text-slate-900">{subject.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Class {grade} · {completedTopics.length} / {allModules.length} modules mastered
            </p>
          </div>

          <div className="overflow-y-auto p-3 space-y-5">
            {units.map((unit) => (
              <div key={unit.unitNumber}>
                <div className="px-2 pb-1.5 text-xs font-bold text-slate-500">
                  Unit {unit.unitNumber}. {unit.title}
                </div>
                <ul className="space-y-1">
                  {unit.modules.map((mod) => {
                    const selected = activeMod.id === mod.id;
                    const done = completedTopics.includes(mod.title);
                    return (
                      <li key={mod.id}>
                        <button
                          onClick={() => {
                            setActiveMod(mod);
                            setActiveTab('treatise');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 ${
                            selected
                              ? 'bg-blue-700 text-white font-semibold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="leading-snug">{mod.title}</span>
                          {done && (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${selected ? 'text-white' : 'text-emerald-600'}`}
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Deep Workspace */}
        <section className="lg:col-span-9 space-y-6">
          {/* Monograph Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>Class {activeMod.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>Unit {activeMod.unitNumber}: {activeMod.unitTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeMod.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{lesson?.estimatedStudyMinutes || activeMod.estimatedMinutes} min study</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
                  {activeMod.title}
                </h1>
                <p className="text-sm text-slate-600 max-w-3xl">
                  {lesson?.subtitle || activeMod.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setDepthLevel('standard')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      depthLevel === 'standard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setDepthLevel('olympiad')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      depthLevel === 'olympiad' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Olympiad Rigor
                  </button>
                </div>

                <button
                  onClick={() => loadModuleContent(activeMod, depthLevel, true)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Synthesizing...' : 'Synthesize Deep Monograph'}
                </button>

                {!isCompleted ? (
                  <button
                    onClick={() => {
                      completeTopic(activeMod.grade, activeMod.subjectName, activeMod.title);
                      playTopicCompleteSound();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Mastered
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" /> Mastered
                  </span>
                )}
              </div>
            </div>

            {/* Workspace Mode Navigation */}
            <div className="flex items-center gap-1 mt-6 pt-4 border-t border-slate-200 overflow-x-auto">
              {[
                { id: 'treatise' as const, label: '01. Core Treatise', icon: BookOpen },
                { id: 'derivations' as const, label: '02. Worked Derivations', icon: Calculator },
                { id: 'simulation' as const, label: '03. Interactive Simulation', icon: FlaskConical },
                { id: 'flashcards' as const, label: `04. Flashcards (${flashcards.length})`, icon: Layers },
                { id: 'exam' as const, label: `05. Mastery Exam (${assessment.length})`, icon: Cpu },
                { id: 'notes' as const, label: '06. Field Notes', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {synthesisError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-amber-900 space-y-1">
                <p className="font-bold">AI Monograph Synthesis Unavailable</p>
                <p>{synthesisError}</p>
                <p className="text-amber-800">
                  You can still explore the Interactive Simulation Lab, Field Notes, and Syllabus Reference below, or retry once your Gemini API key is configured in Settings &gt; Secrets.
                </p>
              </div>
              <button
                onClick={() => loadModuleContent(activeMod, depthLevel, true)}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-800 text-white rounded-md hover:bg-amber-900 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading && (
            <div className="bg-white border border-slate-200 rounded-xl p-10">
              <LoadingSpinner
                size="lg"
                label={`Synthesizing Class ${activeMod.grade} ${depthLevel === 'olympiad' ? 'Architect-depth' : 'deep'} lesson and archiving to IndexedDB Vault...`}
              />
            </div>
          )}

          {/* TAB 01: TREATISE */}
          {!isLoading && lesson && activeTab === 'treatise' && (
            <div className="space-y-6">
              {/* Proposal 4: Kid-Friendly Read-Aloud Narration Bar */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-800">
                  <Volume2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="font-bold">Read-Aloud Voice Helper</span>
                    <span className="text-slate-600 ml-1.5">
                      Great for Classes 1–3 &amp; auditory learners — listen to the whole lesson or any section below.
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(Number(e.target.value))}
                    aria-label="Reading pace"
                    className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg"
                  >
                    <option value={0.88}>0.88x Kid Pace</option>
                    <option value={1.0}>1.0x Normal</option>
                    <option value={1.15}>1.15x Fast</option>
                  </select>
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeech}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <Square className="w-3.5 h-3.5" /> Stop Reading
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const fullNarration = [
                          `${activeMod.title}. ${lesson.subtitle || activeMod.summary}`,
                          ...coreConcepts.map((s) => `${s.heading}. ${s.definition}. ${s.exposition}`),
                        ].join(' ');
                        speakText(fullNarration);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Read Lesson Aloud
                    </button>
                  )}
                </div>
              </div>

              {/* Proposal 4: Interactive Visual Concept SVG Diagram */}
              <ConceptDiagram
                simType={activeMod.simType}
                topic={activeMod.title}
                grade={activeMod.grade}
                subjectName={activeMod.subjectName}
              />

              {/* Prerequisites & Learning Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-500 mb-3">Prerequisites</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {prerequisites.map((pre, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono-math text-xs text-slate-400 mt-0.5">0{i + 1}.</span>
                        <span>{pre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-500 mb-3">Mastery Objectives</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Core Concept Sections */}
              <div className="space-y-6">
                {coreConcepts.map((sec, idx) => {
                  const chosenCheck = conceptCheckPicks[idx];
                  const correctCheckOpt = sec.definition;
                  const distractorA =
                    commonMisconceptions[idx % Math.max(1, commonMisconceptions.length)]?.myth ||
                    'This step is skipped automatically by hardware without any rules or data.';
                  const distractorB =
                    'It relies only on random guessing without using measurements, signals, or verification.';
                  const checkOptions = [correctCheckOpt, distractorA, distractorB];

                  return (
                    <article key={idx} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
                      <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
                        <h2 className="text-xl font-bold text-slate-900">{sec.heading}</h2>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => speakText(`${sec.heading}. ${sec.definition}. ${sec.exposition}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-blue-700" /> Listen
                          </button>
                          <span className="text-xs font-mono-math text-slate-400">Section {idx + 1}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="text-[11px] font-bold text-slate-500 mb-1">Formal Definition</div>
                        <p className="text-sm font-medium text-slate-900 leading-relaxed">{sec.definition}</p>
                      </div>

                      <div className="font-serif-prose text-[16px] text-slate-800 leading-[1.75] space-y-3 max-w-[74ch]">
                        {(sec.exposition ?? '').split('\n\n').map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>

                      {sec.formula && (
                        <div className="bg-slate-900 text-slate-50 rounded-lg px-4 py-3 font-mono-math text-sm overflow-x-auto">
                          {sec.formula}
                        </div>
                      )}

                      {/* Proposal 4: Inline Concept Quick-Check */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
                        <div className="text-xs font-bold text-slate-900">
                          Quick Concept Check #{idx + 1}: Which statement accurately captures &ldquo;{sec.heading}&rdquo;?
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {checkOptions.map((opt, oIdx) => {
                            const picked = chosenCheck === opt;
                            const isRight = opt === correctCheckOpt;
                            let cls = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                            if (chosenCheck) {
                              if (isRight) cls = 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold';
                              else if (picked) cls = 'bg-rose-50 border-rose-500 text-rose-900';
                            }
                            return (
                              <button
                                key={oIdx}
                                disabled={Boolean(chosenCheck)}
                                onClick={() => {
                                  setConceptCheckPicks((prev) => ({ ...prev, [idx]: opt }));
                                  if (opt === correctCheckOpt) {
                                    recordFlashcardMastered();
                                    playCorrectAnswerSound();
                                  }
                                }}
                                className={`p-2.5 text-left text-xs rounded-lg border transition-colors ${cls}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {chosenCheck && (
                          <div className="text-[11px] font-medium text-slate-700">
                            {chosenCheck === correctCheckOpt
                              ? 'Correct! +5 LP awarded for verifying this core principle.'
                              : 'Review the Formal Definition highlighted in green above!'}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <div className="font-bold text-slate-700 mb-1">Historical Origin</div>
                          <p className="text-slate-600 leading-relaxed">{sec.historicalContext}</p>
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 mb-1">Engineering &amp; Real-World Application</div>
                          <p className="text-slate-600 leading-relaxed">{sec.realWorldApplication}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Common Misconceptions */}
              {commonMisconceptions.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Misconception Diagnostics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {commonMisconceptions.map((m, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <div className="text-xs font-bold text-rose-700">Common Error: {m.myth}</div>
                        <div className="text-xs text-slate-800 leading-relaxed">
                          <strong className="text-emerald-700">Correction:</strong> {m.reality}
                        </div>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          Diagnostic check: {m.diagnosticTip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Further Inquiry */}
              {furtherInquiry.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Extension &amp; Research Prompts</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {furtherInquiry.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 02: WORKED DERIVATIONS & DRILLS */}
          {!isLoading && lesson && activeTab === 'derivations' && (
            <div className="space-y-6">
              {workedExamples.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                  <p className="text-sm text-slate-600">
                    Synthesize the full AI Monograph for "{activeMod.title}" to populate step-by-step worked derivations, or generate fresh practice drills below.
                  </p>
                  <button
                    onClick={() => loadModuleContent(activeMod, depthLevel, true)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Synthesize Deep Monograph
                  </button>
                </div>
              ) : (
                workedExamples.map((ex, idx) => {
                  const steps = ex.steps ?? [];
                  const givenData = ex.givenData ?? [];
                  const visibleCount = revealedSteps[idx] ?? steps.length;
                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-slate-900">Example {idx + 1}: {ex.title}</h3>
                        <button
                          onClick={() =>
                            setRevealedSteps((prev) => ({
                              ...prev,
                              [idx]: visibleCount >= steps.length ? 1 : visibleCount + 1,
                            }))
                          }
                          className="px-3 py-1 text-xs font-semibold border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                        >
                          {visibleCount >= steps.length ? 'Step Through Again' : `Reveal Step ${visibleCount + 1}`}
                        </button>
                      </div>

                      <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-4">
                        {ex.problemStatement}
                      </p>

                      {givenData.length > 0 && (
                        <div className="flex flex-wrap gap-3 text-xs font-mono-math text-slate-600">
                          {givenData.map((g, gIdx) => (
                            <span key={gIdx}>• {g}</span>
                          ))}
                        </div>
                      )}

                      <ol className="space-y-2.5">
                        {steps.slice(0, visibleCount).map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-3 text-sm text-slate-800">
                            <span className="font-mono-math text-xs font-bold text-blue-700 mt-0.5">
                              [{sIdx + 1}]
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {visibleCount >= steps.length && (
                        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="font-mono-math font-bold text-emerald-700">
                            Final Result: {ex.finalAnswer}
                          </div>
                          <div className="text-slate-600">Key Insight: {ex.keyInsight}</div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Infinite Practice Drill Generator */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Infinite Practice Drill Generator</h3>
                    <p className="text-xs text-slate-500">Generate 3 fresh computational and analytical problems with complete derivations.</p>
                  </div>
                  <button
                    onClick={handleGenerateDrills}
                    disabled={isDrillsLoading}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    {isDrillsLoading ? 'Generating Drills...' : 'Generate 3 New Problems'}
                  </button>
                </div>

                {drillsError && (
                  <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
                    {drillsError}
                  </div>
                )}

                {extraDrills.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {extraDrills.map((prob, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-900">{prob.title}</span>
                          <span className="text-slate-500">{prob.difficulty}</span>
                        </div>
                        <p className="text-sm text-slate-800">{prob.problemStatement}</p>
                        <ol className="space-y-1 text-xs text-slate-700 pt-1">
                          {(prob.steps ?? []).map((st, sIdx) => (
                            <li key={sIdx}>{sIdx + 1}. {st}</li>
                          ))}
                        </ol>
                        <div className="text-xs font-mono-math font-bold text-blue-700 pt-1">
                          Answer: {prob.finalAnswer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 03: INTERACTIVE SIMULATION LAB */}
          {activeTab === 'simulation' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <SimulationsLab initialSim={activeMod.simType} contextTopic={activeMod.title} />
            </div>
          )}

          {/* TAB 04: SPACED-REPETITION FLASHCARDS */}
          {!isLoading && lesson && activeTab === 'flashcards' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              {flashcards.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-sm text-slate-600">No flashcards archived for this module yet. Synthesize the monograph to generate an SM-2 active-recall deck.</p>
                  <button
                    onClick={() => loadModuleContent(activeMod, depthLevel, true)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Synthesize Flashcard Deck
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>SM-2 Spaced Repetition Deck · Saved to IndexedDB Vault</span>
                    <span className="font-mono-math">Card {safeCardIndex + 1} / {flashcards.length}</span>
                  </div>

                  {currentCard && (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <button
                          onClick={() => speakText(isFlipped ? currentCard.back : currentCard.front)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-blue-700" /> Listen to Card
                        </button>
                      </div>
                      <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full min-h-[220px] border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                      >
                        <span className="text-[11px] font-bold text-slate-400">
                          {isFlipped ? 'Answer & Formal Rule' : 'Active Recall Prompt (Click to Flip)'}
                        </span>
                        <p className="text-lg font-semibold text-slate-900 max-w-xl leading-relaxed">
                          {isFlipped ? currentCard.back : currentCard.front}
                        </p>
                        {isFlipped && currentCard.formula && (
                          <div className="font-mono-math text-sm bg-slate-900 text-white px-3 py-1.5 rounded-md mt-1">
                            {currentCard.formula}
                          </div>
                        )}
                        {!isFlipped && (
                          <span className="text-xs text-slate-500 mt-2">Hint: {currentCard.hint}</span>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">{cardStatusMsg || 'Grade your recall honesty to calibrate spaced intervals.'}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGradeFlashcard('again')}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
                      >
                        Review Again (1d)
                      </button>
                      <button
                        onClick={() => handleGradeFlashcard('good')}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Good Recall
                      </button>
                      <button
                        onClick={() => handleGradeFlashcard('mastered')}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Mastered (+5 LP)
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 05: MULTI-TIER MASTERY EXAM */}
          {!isLoading && lesson && activeTab === 'exam' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              {lockedExamModuleIds.includes(activeMod.id) ? (
                <div className="text-center py-10 space-y-3">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">Exam Locked by Teacher</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your classroom teacher has temporarily locked this diagnostic exam. Review the Core Treatise, Visual Diagram, and Interactive Lab until they unlock it.
                  </p>
                </div>
              ) : assessment.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-sm text-slate-600">Synthesize the deep monograph to unlock the 5-tier Mastery Exam (Conceptual, Computational, Applied, Error Analysis, Synthesis).</p>
                  <button
                    onClick={() => loadModuleContent(activeMod, depthLevel, true)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Synthesize 5-Tier Mastery Exam
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">5-Tier Diagnostic Assessment</h3>
                      <p className="text-xs text-slate-500">Score 60% or higher to certify module mastery and earn +60 LP.</p>
                    </div>
                    {examSubmitted && (
                      <div className="text-right font-mono-math">
                        <div className="text-lg font-bold text-blue-700">
                          {assessment.filter((q) => examAnswers[q.id] === q.correctAnswer).length} / {assessment.length}
                        </div>
                        <div className="text-[11px] text-slate-500">Graded &amp; Archived</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {assessment.map((q, idx) => {
                      const chosen = examAnswers[q.id];
                      const isCorrect = chosen === q.correctAnswer;
                      return (
                        <div key={q.id} className="border border-slate-200 rounded-xl p-5 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Question {idx + 1} · {q.tier} Tier</span>
                            {examSubmitted && (
                              <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {isCorrect ? 'Correct (+15 LP)' : 'Review Needed'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {(q.options ?? []).map((opt, oIdx) => {
                              const isSelected = chosen === opt;
                              let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                              if (!examSubmitted && isSelected) {
                                btnStyle = 'bg-blue-50 border-blue-700 text-blue-900 font-semibold';
                              } else if (examSubmitted) {
                                if (opt === q.correctAnswer) {
                                  btnStyle = 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold';
                                } else if (isSelected) {
                                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                                } else {
                                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={examSubmitted}
                                  onClick={() => setExamAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                  className={`p-3 text-left text-xs rounded-lg border transition-colors ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {examSubmitted && (
                            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 leading-relaxed">
                              <strong>Solution Reasoning:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    {examSubmitted ? (
                      examRetakesAllowed ? (
                        <button
                          onClick={() => {
                            setExamAnswers({});
                            setExamSubmitted(false);
                          }}
                          className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Retake Diagnostic
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700">
                          Classroom policy: single attempt recorded ({profile.examScores?.[activeMod.id] ?? 0}%).
                        </span>
                      )
                    ) : (
                      <button
                        disabled={Object.keys(examAnswers).length < assessment.length}
                        onClick={handleSubmitExam}
                        className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-40"
                      >
                        Submit &amp; Grade Exam
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 06: FIELD NOTES */}
          {activeTab === 'notes' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Personal Scholar Field Notes</h3>
                  <p className="text-xs text-slate-500">
                    Stored locally in your IndexedDB Knowledge Vault and included in JSON backups.
                  </p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                >
                  Save to Vault
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={12}
                placeholder={`Record derivations, key formulas, and self-test summaries for "${activeMod.title}"...`}
                className="w-full p-4 text-sm text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700 font-serif-prose leading-relaxed"
              />
              {noteSavedAt && (
                <p className="text-xs text-slate-500">
                  Last archived: {new Date(noteSavedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      <VoiAssistant grade={activeMod.grade} subjectName={activeMod.subjectName} topic={activeMod.title} />
    </div>
  );
};

export default LearningModule;