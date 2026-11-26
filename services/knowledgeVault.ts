import { normalizeDeepLessonContent } from '../data/foundationalLessons';
import type {
  AssessmentAttempt,
  DeepLessonContent,
  FlashcardReviewState,
  VaultStorageSummary,
} from '../types';

const DB_NAME = 'voi_hub_vault_v1';
const DB_VERSION = 1;

const STORE_LESSONS = 'lessons';
const STORE_FLASHCARDS = 'flashcards';
const STORE_NOTES = 'notes';
const STORE_ASSESSMENTS = 'assessments';

export interface StoredLessonRecord {
  moduleId: string;
  content: DeepLessonContent;
  byteSize: number;
  updatedAt: string;
}

export interface StoredNoteRecord {
  moduleId: string;
  topic: string;
  content: string;
  updatedAt: string;
}

function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable in this environment.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_LESSONS)) {
        db.createObjectStore(STORE_LESSONS, { keyPath: 'moduleId' });
      }
      if (!db.objectStoreNames.contains(STORE_FLASHCARDS)) {
        db.createObjectStore(STORE_FLASHCARDS, { keyPath: 'cardId' });
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: 'moduleId' });
      }
      if (!db.objectStoreNames.contains(STORE_ASSESSMENTS)) {
        db.createObjectStore(STORE_ASSESSMENTS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open Knowledge Vault DB.'));
  });
}

function estimateByteSize(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return 0;
  }
}

export async function getLessonFromVault(moduleId: string): Promise<StoredLessonRecord | null> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readonly');
    const store = tx.objectStore(STORE_LESSONS);
    const req = store.get(moduleId);
    req.onsuccess = () => {
      const rec = req.result as StoredLessonRecord | undefined;
      if (!rec) {
        resolve(null);
        return;
      }
      resolve({
        ...rec,
        content: normalizeDeepLessonContent(rec.content, { moduleId: rec.moduleId }),
      });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveLessonToVault(content: DeepLessonContent): Promise<StoredLessonRecord> {
  const db = await openVaultDB();
  const normalized = normalizeDeepLessonContent(content);
  const record: StoredLessonRecord = {
    moduleId: normalized.moduleId,
    content: normalized,
    byteSize: estimateByteSize(normalized),
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readwrite');
    const store = tx.objectStore(STORE_LESSONS);
    const req = store.put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllCachedLessons(): Promise<StoredLessonRecord[]> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readonly');
    const req = tx.objectStore(STORE_LESSONS).getAll();
    req.onsuccess = () => {
      const list = (req.result as StoredLessonRecord[]) || [];
      resolve(
        list.map((rec) => ({
          ...rec,
          content: normalizeDeepLessonContent(rec.content, { moduleId: rec.moduleId }),
        }))
      );
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getNoteFromVault(moduleId: string): Promise<StoredNoteRecord | null> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readonly');
    const req = tx.objectStore(STORE_NOTES).get(moduleId);
    req.onsuccess = () => resolve((req.result as StoredNoteRecord) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveNoteToVault(moduleId: string, topic: string, content: string): Promise<void> {
  const db = await openVaultDB();
  const record: StoredNoteRecord = {
    moduleId,
    topic,
    content,
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const req = tx.objectStore(STORE_NOTES).put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getFlashcardReview(cardId: string): Promise<FlashcardReviewState | null> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FLASHCARDS, 'readonly');
    const req = tx.objectStore(STORE_FLASHCARDS).get(cardId);
    req.onsuccess = () => resolve((req.result as FlashcardReviewState) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function recordFlashcardReview(
  cardId: string,
  moduleId: string,
  grade: 'again' | 'good' | 'mastered'
): Promise<FlashcardReviewState> {
  const existing = await getFlashcardReview(cardId);
  const prevReps = existing?.repetitions ?? 0;
  const prevInterval = existing?.intervalDays ?? 1;
  const prevEase = existing?.easeFactor ?? 2.5;

  let repetitions = prevReps;
  let intervalDays = prevInterval;
  let easeFactor = prevEase;

  if (grade === 'again') {
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, prevEase - 0.2);
  } else if (grade === 'good') {
    repetitions = prevReps + 1;
    intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 4 : Math.round(prevInterval * prevEase);
    easeFactor = prevEase;
  } else {
    repetitions = prevReps + 1;
    intervalDays = repetitions === 1 ? 3 : Math.round(prevInterval * (prevEase + 0.3));
    easeFactor = Math.min(3.0, prevEase + 0.15);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  const nextState: FlashcardReviewState = {
    cardId,
    moduleId,
    repetitions,
    intervalDays,
    easeFactor,
    nextReviewIso: nextDate.toISOString(),
    lastGrade: grade,
  };

  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FLASHCARDS, 'readwrite');
    const req = tx.objectStore(STORE_FLASHCARDS).put(nextState);
    req.onsuccess = () => resolve(nextState);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAssessmentAttempt(attempt: AssessmentAttempt): Promise<void> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ASSESSMENTS, 'readwrite');
    const req = tx.objectStore(STORE_ASSESSMENTS).put(attempt);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllAssessments(): Promise<AssessmentAttempt[]> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ASSESSMENTS, 'readonly');
    const req = tx.objectStore(STORE_ASSESSMENTS).getAll();
    req.onsuccess = () => resolve((req.result as AssessmentAttempt[]) || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getVaultSummary(): Promise<VaultStorageSummary> {
  const db = await openVaultDB();
  const [lessons, flashcards, notes, assessments] = await Promise.all([
    new Promise<StoredLessonRecord[]>((res) => {
      const r = db.transaction(STORE_LESSONS, 'readonly').objectStore(STORE_LESSONS).getAll();
      r.onsuccess = () => res((r.result as StoredLessonRecord[]) || []);
      r.onerror = () => res([]);
    }),
    new Promise<FlashcardReviewState[]>((res) => {
      const r = db.transaction(STORE_FLASHCARDS, 'readonly').objectStore(STORE_FLASHCARDS).getAll();
      r.onsuccess = () => res((r.result as FlashcardReviewState[]) || []);
      r.onerror = () => res([]);
    }),
    new Promise<StoredNoteRecord[]>((res) => {
      const r = db.transaction(STORE_NOTES, 'readonly').objectStore(STORE_NOTES).getAll();
      r.onsuccess = () => res((r.result as StoredNoteRecord[]) || []);
      r.onerror = () => res([]);
    }),
    new Promise<AssessmentAttempt[]>((res) => {
      const r = db.transaction(STORE_ASSESSMENTS, 'readonly').objectStore(STORE_ASSESSMENTS).getAll();
      r.onsuccess = () => res((r.result as AssessmentAttempt[]) || []);
      r.onerror = () => res([]);
    }),
  ]);

  const totalVaultBytes =
    lessons.reduce((sum, l) => sum + (l.byteSize || 0), 0) +
    estimateByteSize(notes) +
    estimateByteSize(flashcards) +
    estimateByteSize(assessments);

  let browserUsageBytes: number | null = null;
  let browserQuotaBytes: number | null = null;
  if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      browserUsageBytes = estimate.usage ?? null;
      browserQuotaBytes = estimate.quota ?? null;
    } catch {
      // Ignore storage estimate failure
    }
  }

  return {
    cachedLessonsCount: lessons.length,
    totalVaultBytes,
    flashcardsReviewedCount: flashcards.length,
    notesCount: notes.length,
    assessmentsCount: assessments.length,
    browserUsageBytes,
    browserQuotaBytes,
  };
}

export async function clearVaultLessons(): Promise<void> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readwrite');
    const req = tx.objectStore(STORE_LESSONS).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function exportVaultArchive(): Promise<string> {
  const db = await openVaultDB();
  const [lessons, flashcards, notes, assessments] = await Promise.all([
    getAllCachedLessons(),
    new Promise((res) => {
      const r = db.transaction(STORE_FLASHCARDS, 'readonly').objectStore(STORE_FLASHCARDS).getAll();
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => res([]);
    }),
    new Promise((res) => {
      const r = db.transaction(STORE_NOTES, 'readonly').objectStore(STORE_NOTES).getAll();
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => res([]);
    }),
    getAllAssessments(),
  ]);

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: DB_VERSION,
      lessons,
      flashcards,
      notes,
      assessments,
    },
    null,
    2
  );
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, idx);
  return `${value >= 100 ? value.toFixed(0) : value.toFixed(1)} ${units[idx]}`;
}
