import express from 'express';
import { verifyFirebaseIdToken } from './serverAuth.ts';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  DEPTH_LEVELS,
  DIFFICULTIES,
  MAX_TEXT,
  MODES,
  cleanText,
  createDailyCap,
  createRateLimiter,
  parseGrade,
  pickOne,
  positiveIntFromEnv,
} from './serverGuards.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
// Override with GEMINI_MODEL without a code change if the default is unavailable.
const MODEL_TEXT = process.env.GEMINI_MODEL || 'gemini-4-hydrogen';
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

// Abuse protection for the public AI endpoints (tunable via env).
const aiRateLimiter = createRateLimiter({
  windowMs: positiveIntFromEnv(process.env.AI_RATE_WINDOW_MS, 10 * 60 * 1000),
  max: positiveIntFromEnv(process.env.AI_RATE_MAX, 30),
});
const aiDailyCap = createDailyCap(positiveIntFromEnv(process.env.AI_DAILY_CAP, 5000));

const AI_UNAVAILABLE = 'The AI tutor is temporarily unavailable. Please try again in a moment.';

function sendApiError(res: express.Response, route: string, error: any, fallbackMessage: string) {
  console.error(`Error in ${route}:`, error);
  const upstream = Number(error?.statusCode || error?.status);
  if (upstream === 429) {
    return res.status(429).json({ error: 'The AI tutor is busy right now. Please try again shortly.' });
  }
  if (upstream === 503) {
    return res.status(503).json({ error: AI_UNAVAILABLE });
  }
  // Never expose raw upstream/internal error text to clients.
  return res.status(500).json({ error: fallbackMessage });
}

const firebaseAuthGuard: express.RequestHandler = async (req, res, next) => {
  const webApiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!webApiKey) {
    return res.status(503).json({ error: 'AI authentication is not configured.' });
  }

  const authorization = req.get('authorization') || '';
  const match = /^Bearer\\s+([^\\s]+)$/i.exec(authorization);
  if (!match) {
    return res.status(401).json({ error: 'Sign in to use AI-powered learning features.' });
  }

  try {
    const identity = await verifyFirebaseIdToken(match[1], webApiKey);
    if (!identity) {
      return res.status(401).json({ error: 'Your session is invalid or has expired. Please sign in again.' });
    }
    if (!identity.emailVerified) {
      return res.status(403).json({ error: 'Verify your email address before using AI-powered learning features.' });
    }
    res.locals.firebaseUser = identity;
    next();
  } catch {
    // Do not expose provider responses, tokens, or API-key details to clients.
    console.error('Firebase ID token verification is temporarily unavailable.');
    return res.status(503).json({ error: 'Authentication service temporarily unavailable.' });
  }
};

const aiGuard: express.RequestHandler = (req, res, next) => {
  const limit = aiRateLimiter.check(req.ip || 'unknown');
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many requests. Please wait a bit before trying again.' });
  }
  if (!aiDailyCap.tryConsume()) {
    return res.status(503).json({ error: 'The daily AI limit has been reached. Please come back tomorrow.' });
  }
  next();
};

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('GEMINI_API_KEY is not configured.'), { statusCode: 503 });
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const deepLessonSchema = {
  type: Type.OBJECT,
  properties: {
    subtitle: { type: Type.STRING, description: 'Concise academic subtitle summarizing the scope of the treatise.' },
    estimatedStudyMinutes: { type: Type.INTEGER, description: 'Realistic study time in minutes (20 to 60).' },
    prerequisites: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 4 foundational concepts a student should know beforehand.',
    },
    learningObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 measurable academic mastery objectives.',
    },
    coreConcepts: {
      type: Type.ARRAY,
      description: '4 to 5 deep, rigorously structured conceptual sections building from intuition to formal theory.',
      items: {
        type: Type.OBJECT,
        properties: {
          heading: { type: Type.STRING },
          definition: { type: Type.STRING, description: 'Formal textbook definition in 1-2 crisp sentences.' },
          exposition: { type: Type.STRING, description: 'Multi-paragraph deep academic explanation with clear logical progression.' },
          formula: { type: Type.STRING, description: 'Key mathematical formula, chemical equation, or formal rule if applicable.' },
          historicalContext: { type: Type.STRING, description: 'Who discovered or formalized this idea and why it mattered.' },
          realWorldApplication: { type: Type.STRING, description: 'Concrete modern engineering, scientific, or civic application.' },
        },
        required: ['heading', 'definition', 'exposition', 'historicalContext', 'realWorldApplication'],
      },
    },
    workedExamples: {
      type: Type.ARRAY,
      description: '3 multi-step worked problems or case studies demonstrating exact method.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          problemStatement: { type: Type.STRING },
          givenData: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          finalAnswer: { type: Type.STRING },
          keyInsight: { type: Type.STRING },
        },
        required: ['title', 'problemStatement', 'givenData', 'steps', 'finalAnswer', 'keyInsight'],
      },
    },
    commonMisconceptions: {
      type: Type.ARRAY,
      description: '3 frequent student errors and exact conceptual corrections.',
      items: {
        type: Type.OBJECT,
        properties: {
          myth: { type: Type.STRING },
          reality: { type: Type.STRING },
          diagnosticTip: { type: Type.STRING },
        },
        required: ['myth', 'reality', 'diagnosticTip'],
      },
    },
    flashcards: {
      type: Type.ARRAY,
      description: '6 active-recall flashcards covering definitions, theorems, and edge cases.',
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING },
          back: { type: Type.STRING },
          formula: { type: Type.STRING },
          hint: { type: Type.STRING },
        },
        required: ['front', 'back', 'hint'],
      },
    },
    assessment: {
      type: Type.ARRAY,
      description: '5 graded multiple-choice assessment items covering Conceptual, Computational, Applied, Error Analysis, and Synthesis tiers.',
      items: {
        type: Type.OBJECT,
        properties: {
          tier: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['tier', 'question', 'options', 'correctAnswer', 'explanation'],
      },
    },
    furtherInquiry: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 advanced extension research questions.',
    },
  },
  required: [
    'subtitle',
    'estimatedStudyMinutes',
    'prerequisites',
    'learningObjectives',
    'coreConcepts',
    'workedExamples',
    'commonMisconceptions',
    'flashcards',
    'assessment',
    'furtherInquiry',
  ],
};

const practiceSchema = {
  type: Type.OBJECT,
  properties: {
    problems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          problemStatement: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          finalAnswer: { type: Type.STRING },
        },
        required: ['title', 'difficulty', 'problemStatement', 'steps', 'finalAnswer'],
      },
    },
  },
  required: ['problems'],
};

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  // Hosts such as Cloud Run / Render / Fly sit behind one proxy; needed for a correct client IP.
  app.set('trust proxy', 1);
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      model: MODEL_TEXT,
    });
  });

  // AI endpoints require a valid, email-verified Firebase user before rate limiting or provider access.
  app.use('/api/lesson', firebaseAuthGuard, aiGuard);
  app.use('/api/practice', firebaseAuthGuard, aiGuard);
  app.use('/api/tutor', firebaseAuthGuard, aiGuard);

  app.post('/api/lesson/generate', async (req, res) => {
    try {
      const body = req.body ?? {};
      const grade = parseGrade(body.grade);
      const subjectName = cleanText(body.subjectName, MAX_TEXT.subjectName);
      const unitTitle = cleanText(body.unitTitle, MAX_TEXT.unitTitle);
      const topic = cleanText(body.topic, MAX_TEXT.topic);
      const moduleId = cleanText(body.moduleId, MAX_TEXT.moduleId);
      const depthLevel = pickOne(body.depthLevel, DEPTH_LEVELS, 'standard');
      if (!topic || !subjectName || grade === null) {
        return res.status(400).json({ error: 'Missing or invalid fields: grade (1-9), subjectName, topic.' });
      }

      const ai = getAiClient();
      const depthInstruction =
        depthLevel === 'olympiad'
          ? `Push into honors/architect rigor appropriate for an advanced Class ${grade} student: include formal protocols, mathematical derivations, edge cases, defensive architecture trade-offs, and challenging analytical problems.`
          : `Write an engaging, deeply educational textbook-grade lesson tailored carefully to a Class ${grade} child (roughly ages ${grade + 5}–${grade + 6}) learning technology: blend crystal-clear everyday analogies (like post offices, Lego blocks, walkie-talkies, or locked diaries) with real, accurate Artificial Intelligence, Networking, or Cybersecurity terminology—never dumbed down or vague.`;

      const safetyNote =
        'All Cybersecurity material must teach strictly defensive, ethical, white-hat safety, cryptography, and protection principles—never provide actionable malware payloads or illegal intrusion instructions.';

      const systemInstruction = `You are a distinguished children's computer science, AI, networking, and cybersecurity educator authoring monographs for VOI HUB (Classes 1–9). ${depthInstruction} ${safetyNote} Ensure every assessment item has exactly 4 distinct options and that correctAnswer matches one of the options verbatim. Do not use markdown headers inside prose paragraphs; write clean, structured prose.`;

      const prompt = `Create a comprehensive, deeply researched VOI HUB study monograph for children:
- Class: ${grade} (Ages ${grade + 5}–${grade + 6})
- Tech Track: ${subjectName}
- Unit: ${unitTitle || 'Core Curriculum'}
- Topic: ${topic}
- Depth Mode: ${depthLevel}

Provide 4 to 5 thorough core conceptual sections (each with formal definition, multi-paragraph kid-friendly yet technically exact exposition, formula/protocol specification where applicable, historical origin, and real-world engineering application), 3 multi-step worked examples, 3 common misconceptions, 6 high-yield flashcards, 5 multi-tier mastery assessment questions (Conceptual, Computational, Applied, Error Analysis, Synthesis), and 3 further inquiry prompts.`;

      const response = await ai.models.generateContent({
        model: MODEL_TEXT,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: deepLessonSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({ error: 'Model returned an empty monograph response.' });
      }

      let parsed: any;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        return res.status(502).json({ error: 'Model returned malformed JSON for monograph response.' });
      }

      const toStrList = (val: unknown): string[] =>
        Array.isArray(val) ? val.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : [];

      const validTiers = ['Conceptual', 'Computational', 'Applied', 'Error Analysis', 'Synthesis'];

      const result = {
        moduleId: moduleId || `${grade}-${subjectName}-${topic}`,
        topic,
        subtitle: typeof parsed?.subtitle === 'string' ? parsed.subtitle : `${subjectName} — Grade ${grade}`,
        grade: Number(grade),
        subjectName,
        estimatedStudyMinutes: Number(parsed?.estimatedStudyMinutes) || 30,
        prerequisites: toStrList(parsed?.prerequisites),
        learningObjectives: toStrList(parsed?.learningObjectives),
        coreConcepts: Array.isArray(parsed?.coreConcepts)
          ? parsed.coreConcepts.map((s: any, idx: number) => ({
              heading: typeof s?.heading === 'string' ? s.heading : `Section ${idx + 1}`,
              definition: typeof s?.definition === 'string' ? s.definition : '',
              exposition: typeof s?.exposition === 'string' ? s.exposition : '',
              formula: typeof s?.formula === 'string' && s.formula ? s.formula : undefined,
              historicalContext: typeof s?.historicalContext === 'string' ? s.historicalContext : '',
              realWorldApplication: typeof s?.realWorldApplication === 'string' ? s.realWorldApplication : '',
            }))
          : [],
        workedExamples: Array.isArray(parsed?.workedExamples)
          ? parsed.workedExamples.map((e: any, idx: number) => ({
              title: typeof e?.title === 'string' ? e.title : `Example ${idx + 1}`,
              problemStatement: typeof e?.problemStatement === 'string' ? e.problemStatement : '',
              givenData: toStrList(e?.givenData),
              steps: toStrList(e?.steps),
              finalAnswer: typeof e?.finalAnswer === 'string' ? e.finalAnswer : '',
              keyInsight: typeof e?.keyInsight === 'string' ? e.keyInsight : '',
            }))
          : [],
        commonMisconceptions: Array.isArray(parsed?.commonMisconceptions)
          ? parsed.commonMisconceptions.map((m: any) => ({
              myth: typeof m?.myth === 'string' ? m.myth : '',
              reality: typeof m?.reality === 'string' ? m.reality : '',
              diagnosticTip: typeof m?.diagnosticTip === 'string' ? m.diagnosticTip : '',
            }))
          : [],
        flashcards: Array.isArray(parsed?.flashcards)
          ? parsed.flashcards.map((c: any, idx: number) => ({
              id: `${moduleId || topic}-fc-${idx + 1}`,
              front: typeof c?.front === 'string' ? c.front : '',
              back: typeof c?.back === 'string' ? c.back : '',
              formula: typeof c?.formula === 'string' && c.formula ? c.formula : undefined,
              hint: typeof c?.hint === 'string' ? c.hint : '',
            }))
          : [],
        assessment: Array.isArray(parsed?.assessment)
          ? parsed.assessment.map((q: any, idx: number) => {
              const normalizedTier = validTiers.includes(q?.tier) ? q.tier : validTiers[idx % validTiers.length];
              const options = toStrList(q?.options);
              const safeOptions = options.length > 0 ? options : ['Option A', 'Option B', 'Option C', 'Option D'];
              return {
                id: `${moduleId || topic}-q-${idx + 1}`,
                tier: normalizedTier,
                question: typeof q?.question === 'string' ? q.question : '',
                options: safeOptions,
                correctAnswer: typeof q?.correctAnswer === 'string' && q.correctAnswer ? q.correctAnswer : safeOptions[0],
                explanation: typeof q?.explanation === 'string' ? q.explanation : '',
              };
            })
          : [],
        furtherInquiry: toStrList(parsed?.furtherInquiry),
        source: 'ai-monograph' as const,
        generatedAt: new Date().toISOString(),
        depthLevel: depthLevel === 'olympiad' ? ('olympiad' as const) : ('standard' as const),
      };

      res.json(result);
    } catch (error: any) {
      sendApiError(res, '/api/lesson/generate', error, 'Failed to synthesize deep curriculum monograph.');
    }
  });

  app.post('/api/practice/generate', async (req, res) => {
    try {
      const body = req.body ?? {};
      const grade = parseGrade(body.grade);
      const subjectName = cleanText(body.subjectName, MAX_TEXT.subjectName);
      const topic = cleanText(body.topic, MAX_TEXT.topic);
      const difficulty = pickOne(body.difficulty, DIFFICULTIES, 'Intermediate');
      if (grade === null || !subjectName || !topic) {
        return res.status(400).json({ error: 'Missing or invalid fields: grade (1-9), subjectName, topic.' });
      }
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_TEXT,
        contents: `Generate 3 original, engaging ${difficulty}-level practice problems for Class ${grade} ${subjectName} on "${topic}". Each problem must be clear for a Class ${grade} student while preserving real AI, networking, or defensive cybersecurity accuracy, with step-by-step derivations and a verified final answer.`,
        config: {
          systemInstruction:
            'You are a master educator writing hands-on AI, Networking, and ethical defensive Cybersecurity challenges for young learners in Classes 1–9.',
          responseMimeType: 'application/json',
          responseSchema: practiceSchema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      const rawPractice = (response.text ?? '{}').trim();
      let parsed: any;
      try {
        parsed = JSON.parse(rawPractice);
      } catch {
        return res.status(502).json({ error: 'Model returned malformed JSON for practice drills.' });
      }
      const problems = Array.isArray(parsed?.problems)
        ? parsed.problems.map((p: any, idx: number) => ({
            title: typeof p?.title === 'string' ? p.title : `Problem ${idx + 1}`,
            difficulty: typeof p?.difficulty === 'string' ? p.difficulty : String(difficulty),
            problemStatement: typeof p?.problemStatement === 'string' ? p.problemStatement : '',
            steps: Array.isArray(p?.steps) ? p.steps.filter((s: unknown): s is string => typeof s === 'string') : [],
            finalAnswer: typeof p?.finalAnswer === 'string' ? p.finalAnswer : '',
          }))
        : [];
      res.json({ problems });
    } catch (error: any) {
      sendApiError(res, '/api/practice/generate', error, 'Failed to generate practice drill.');
    }
  });

  app.post('/api/tutor/chat', async (req, res) => {
    try {
      const body = req.body ?? {};
      const grade = parseGrade(body.grade);
      const subjectName = cleanText(body.subjectName, MAX_TEXT.subjectName);
      const topic = cleanText(body.topic, MAX_TEXT.topic);
      const mode = pickOne(body.mode, MODES, 'socratic');
      const message = cleanText(body.message, MAX_TEXT.message);
      const history = body.history;
      if (!message || !topic || !subjectName || grade === null) {
        return res.status(400).json({ error: 'Missing or invalid fields: grade (1-9), subjectName, topic, message.' });
      }

      const ai = getAiClient();
      const modeGuides: Record<string, string> = {
        socratic:
          'Use the Socratic method: guide the student toward discovering the principle themselves with targeted probing questions, clear intuition checks, and concise step hints.',
        worked_problem:
          'Walk through a concrete step-by-step derivation or case study related to the student question, explaining why each transformation is valid.',
        feynman_test:
          'Act as an attentive peer asking the student to explain the concept in plain language, gently spotting any logical gaps or hidden assumptions.',
        deep_extension:
          'Connect this Grade ' + grade + ' topic to advanced university-level research, formal proofs, or real-world engineering systems.',
      };

      const systemInstruction = `You are VOI HUB Mentor, an encouraging, crystal-clear specialist in Artificial Intelligence, Computer Networking, and defensive Cybersecurity teaching a Class ${grade} child (ages ${grade + 5}–${grade + 6}) studying "${topic}" in ${subjectName}. ${modeGuides[mode] || modeGuides.socratic} Always keep cybersecurity guidance strictly ethical and defensive. Keep formatting clean, legible, and well-structured without raw markdown noise.`;

      const chatHistory = Array.isArray(history)
        ? history
            .filter((h: any) => h && (h.role === 'user' || h.role === 'model') && typeof h.content === 'string')
            .slice(-10)
            .map((h: any) => ({
              role: h.role,
              parts: [{ text: cleanText(h.content, MAX_TEXT.historyItem) }],
            }))
            .filter((h) => h.parts[0].text.length > 0)
        : [];

      const chat = ai.chats.create({
        model: MODEL_TEXT,
        history: chatHistory,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = await chat.sendMessage({ message });
      res.json({ reply: reply.text ?? '' });
    } catch (error: any) {
      sendApiError(res, '/api/tutor/chat', error, 'Tutor communication failed.');
    }
  });

  // Unknown /api routes must return JSON, not the SPA shell.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'spa',
    });

    // HMR is disabled in this environment; serve style/hot-context helpers without opening a WebSocket
    app.get('/@vite/client', (_req, res) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
  } else {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function injectQuery(url) { return url; }
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export class ErrorOverlay extends HTMLElement {}
`);
    });

    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  // Malformed JSON / oversized bodies: respond with JSON instead of an HTML stack trace.
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(err);
    const status = err?.status === 413 ? 413 : err?.type === 'entity.parse.failed' ? 400 : 500;
    if (status === 500) console.error('Unhandled server error:', err);
    res.status(status).json({
      error: status === 413 ? 'Request too large.' : status === 400 ? 'Invalid JSON body.' : 'Internal server error.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VOI HUB server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start VOI HUB server:', err);
  process.exit(1);
});
