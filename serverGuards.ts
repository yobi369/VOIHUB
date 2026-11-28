// Dependency-free request guards for the TECH HUB API: input validation,
// per-client rate limiting, and a global daily budget cap for AI calls.

export const MAX_TEXT = {
  subjectName: 80,
  unitTitle: 120,
  topic: 160,
  moduleId: 120,
  message: 1000,
  historyItem: 2000,
} as const;

export const MODES = ['socratic', 'worked_problem', 'feynman_test', 'deep_extension'] as const;
export type TutorMode = (typeof MODES)[number];

export const DEPTH_LEVELS = ['standard', 'olympiad'] as const;
export type DepthLevel = (typeof DEPTH_LEVELS)[number];

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

/** Returns an integer 1-9, or null if the value is not a valid Class level. */
export function parseGrade(value: unknown): number | null {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > 9) return null;
  return n;
}

/**
 * Normalizes user-supplied free text before it is placed in a prompt:
 * strips control characters, collapses whitespace, and caps length.
 * Returns '' for non-strings.
 */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function pickOne<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/** Fixed-window in-memory limiter keyed by client id (e.g. IP). Single-instance only. */
export function createRateLimiter(opts: { windowMs: number; max: number; now?: () => number }) {
  const now = opts.now ?? Date.now;
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key: string): RateLimitResult {
      const t = now();
      // Opportunistic cleanup keeps the map bounded.
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
      }
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= t) {
        hits.set(key, { count: 1, resetAt: t + opts.windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }
      if (entry.count >= opts.max) {
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - t) / 1000)) };
      }
      entry.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

/** Global cap on AI calls per UTC day, to bound worst-case API spend. */
export function createDailyCap(limit: number, now: () => number = Date.now) {
  let day = '';
  let used = 0;
  return {
    tryConsume(): boolean {
      const today = new Date(now()).toISOString().slice(0, 10);
      if (today !== day) {
        day = today;
        used = 0;
      }
      if (used >= limit) return false;
      used += 1;
      return true;
    },
  };
}

export function positiveIntFromEnv(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}
