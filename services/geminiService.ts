import { normalizeDeepLessonContent } from '../data/foundationalLessons';
import type { DeepLessonContent, TutorMessage } from '../types';

export interface PracticeProblem {
  title: string;
  difficulty: string;
  problemStatement: string;
  steps: string[];
  finalAnswer: string;
}

export async function checkAiHealth(): Promise<{ ok: boolean; aiConfigured: boolean; model: string }> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error('Unable to reach TECH HUB backend server.');
  }
  return res.json();
}

export async function generateDeepLesson(params: {
  moduleId: string;
  grade: number;
  subjectName: string;
  unitTitle: string;
  topic: string;
  depthLevel?: 'standard' | 'olympiad';
}): Promise<DeepLessonContent> {
  const res = await fetch('/api/lesson/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Curriculum synthesis failed (HTTP ${res.status}).`);
  }
  return normalizeDeepLessonContent(data, {
    moduleId: params.moduleId,
    grade: params.grade,
    subjectName: params.subjectName,
    topic: params.topic,
    depthLevel: params.depthLevel || 'standard',
    source: 'ai-monograph',
  });
}

export async function generatePracticeDrill(params: {
  grade: number;
  subjectName: string;
  topic: string;
  difficulty?: string;
}): Promise<PracticeProblem[]> {
  const res = await fetch('/api/practice/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Practice drill generation failed (HTTP ${res.status}).`);
  }
  const problems = Array.isArray(data.problems) ? data.problems : [];
  return problems.map((p: any, idx: number) => ({
    title: typeof p?.title === 'string' && p.title ? p.title : `Problem ${idx + 1}`,
    difficulty: typeof p?.difficulty === 'string' ? p.difficulty : params.difficulty || 'Intermediate',
    problemStatement: typeof p?.problemStatement === 'string' ? p.problemStatement : '',
    steps: Array.isArray(p?.steps) ? p.steps.filter((s: unknown): s is string => typeof s === 'string') : [],
    finalAnswer: typeof p?.finalAnswer === 'string' ? p.finalAnswer : '',
  }));
}

export async function sendTutorMessage(params: {
  grade: number;
  subjectName: string;
  topic: string;
  mode: 'socratic' | 'worked_problem' | 'feynman_test' | 'deep_extension';
  message: string;
  history: TutorMessage[];
}): Promise<string> {
  const res = await fetch('/api/tutor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Tutor request failed (HTTP ${res.status}).`);
  }
  return data.reply as string;
}