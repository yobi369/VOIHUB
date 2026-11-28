# VOI HUB (TECH HUB)

Interactive Classes 1–9 academy for AI, networking and defensive cybersecurity: deep AI-generated lessons, practice drills, a Socratic tutor, simulations/labs, classrooms for teachers and progress sharing for parents.

**Stack:** React 19 + Vite + Tailwind 4 (frontend) · Express 5 + `@google/genai` (API, `server.ts`) · Firebase Auth (Google sign-in) + Firestore.

## Run locally

```bash
bun install            # or: npm install
cp .env.example .env   # set GEMINI_API_KEY
npm run dev            # http://localhost:3000 (Express + Vite middleware)
```

## Deploy

```bash
npm run build          # builds the frontend into dist/
npm start              # serves dist/ + the API in production mode
```

- Set `GEMINI_API_KEY` as a secret on the host. `PORT` is respected.
- `npm start` runs in production mode (`--prod`), so it serves the built `dist/`, not the Vite dev server.
- The server assumes **one proxy hop** (`trust proxy = 1`) for correct client IPs.
- Rate limiting and the daily AI cap are in memory, so they are per-instance. Run a single instance or move them to a shared store when scaling out.

### Firestore rules

```bash
firebase deploy --only firestore:rules --project gen-lang-client-0950335695
```

`firebase.json` targets the named database in `firebase-applet-config.json`. Rule intent is documented in `security_spec.md`.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | – | Required for all AI endpoints |
| `GEMINI_MODEL` | `gemini-4-hydrogen` | Model id override |
| `AI_RATE_MAX` / `AI_RATE_WINDOW_MS` | `30` / `600000` | Per-IP limit on AI requests |
| `AI_DAILY_CAP` | `5000` | Total AI requests per UTC day |
| `PORT` | `3000` | HTTP port |

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness and whether AI is configured |
| `POST /api/lesson/generate` | Generate a lesson monograph |
| `POST /api/practice/generate` | Generate practice problems |
| `POST /api/tutor/chat` | Tutor conversation turn |

AI routes validate input (grade 1–9, length caps, allow-listed modes), are rate limited, and return generic error messages on server failures.

## Notes

- `firebase-applet-config.json` contains the Firebase **web** config. It is public by design; restrict the API key by HTTP referrer in Google Cloud Console.
- `npm run lint` runs the TypeScript check (`tsc --noEmit`).
