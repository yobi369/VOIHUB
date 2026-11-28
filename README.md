# VOI HUB

VOI HUB is an interactive Classes 1–9 technology learning platform covering AI, computer networking, and defensive cybersecurity. The application includes AI-generated lessons and practice, a Socratic tutor, interactive learning labs, teacher-managed classrooms, and parent-facing progress sharing.

**Product ownership:** BM Tech  
**Technology:** React 19, TypeScript, Vite, Tailwind CSS 4, Express 5, Google Gemini API, Firebase Authentication, and Cloud Firestore.

## Project status

VOI HUB is under active preparation for a controlled pilot and commercial release. A successful local build or CI run does not, by itself, mean that production security, privacy, curriculum quality, or deployment has been approved.

Development work is currently coordinated through the `bmtech/production-readiness` branch. Changes should be reviewed and merged through pull requests.

## Requirements

- Bun (recommended; the repository includes `bun.lock`)
- A supported Node.js runtime for local tooling
- Firebase project configuration
- A Gemini API key for AI-powered features

## Local development

Install the exact dependency versions recorded in the lockfile:

```bash
bun install --frozen-lockfile
```

Create a local environment file from the example and set the required server secret:

```bash
cp .env.example .env
# Set GEMINI_API_KEY in .env
bun run dev
```

The Express/Vite development server listens on port `3000` by default. Set `PORT` to override it.

## Quality checks

Run the same core checks used by GitHub Actions:

```bash
bun run lint
bun run typecheck
bun run test
bun run test:rules
bun run build
```

Or run all three in sequence:

```bash
bun run check
```

The lint step checks Firestore security rules with the Firebase rules ESLint plugin. Server tests cover input guards, usage limits, and Firebase token-verification outcomes. The separate `test:rules` command starts the Firestore emulator and runs access-control tests; it requires Java, Firebase CLI, and `@firebase/rules-unit-testing` (the CI workflow installs the emulator tooling temporarily). Full authentication journeys, AI provider integration, and browser end-to-end tests are still required.

## Production build and start

```bash
bun run build
bun run start
```

The production server serves the compiled `dist/` directory and the API. Configure `GEMINI_API_KEY` as a secret in the hosting provider; never commit real credentials.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | — | Required for AI endpoints |
| `FIREBASE_WEB_API_KEY` | — | Server-side Firebase ID-token verification key (Identity Toolkit API) |
| `GEMINI_MODEL` | `gemini-4-hydrogen` | Gemini model override |
| `AI_RATE_MAX` | `30` | Maximum AI requests per client window |
| `AI_RATE_WINDOW_MS` | `600000` | AI request window in milliseconds |
| `AI_DAILY_CAP` | `5000` | Process-local AI request cap per UTC day |
| `PORT` | `3000` | HTTP server port |

The current rate limiter and daily cap are in-memory and therefore per-process. They are not a shared quota system for multi-instance deployments. A persistent, distributed usage-control mechanism is required before scaling public commercial traffic.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness and AI configuration status |
| `POST /api/lesson/generate` | Generate a lesson |
| `POST /api/practice/generate` | Generate practice problems |
| `POST /api/tutor/chat` | Tutor conversation turn |

AI endpoints require a valid Firebase ID token from an email-verified account. The server verifies tokens through Firebase Authentication using `FIREBASE_WEB_API_KEY`, then applies request validation, length limits, independent per-account and per-IP rate limits, and a process-local daily cap. Per-account subscription entitlements and persistent shared quotas remain part of the production-readiness work.

## Firebase and Firestore

The Firebase web configuration is client-side configuration, not a private credential. Restrict its API key to the required application origins and APIs in Google Cloud.

Review the Firestore rules and target Firebase project before deploying any rules. Do not deploy rules to a production project without first confirming the project ID, database, and intended access policy.

The repository's `security_spec.md` documents the intended rules. The emulator suite currently verifies private-profile isolation and classroom-member read boundaries. It does not yet validate trusted achievement writes, parent-link privacy/claim flows, complete classroom lifecycle behavior, or deployed production rules.

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting guidance. Do not publish credentials, student information, or exploitable vulnerability details in public issues.

## Contributing

- Preserve existing product functionality unless a change is explicitly approved.
- Work on a feature or hardening branch and open a pull request to `main`.
- Include tests for security-sensitive and business-critical changes.
- Do not claim a feature, test, or deployment is complete without evidence.
- Never commit secrets, production student data, or private credentials.
