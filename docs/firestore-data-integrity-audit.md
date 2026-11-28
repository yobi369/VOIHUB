# VOI HUB Firestore Data-Integrity Audit

**Branch:** `bmtech/production-readiness`  
**Scope:** Firestore rules, browser-side persistence, classroom snapshots, parent snapshots, and certificate issuance.  
**Status:** Audit completed; integrity remediation is required before production claims.

## Executive finding

The current Firestore rules provide useful identity and ownership boundaries, but they do **not** make learning progress, scores, rewards, or certificates authoritative. An authenticated student controls the browser code and can submit arbitrary values through the same client SDK used by the legitimate application. Range checks and client-side clamping prevent malformed data, not cheating or tampering.

Do not describe cloud LP, levels, streaks, badges, completed modules, exam scores, capstones, CTF flags, or certificates as verified/authoritative until a trusted server path is implemented and tested.

## Confirmed findings

### P1 — Student-owned profile fields include reward and achievement state

In `firestore.rules`, the owner update allowlist for `/users/{userId}` includes `lp`, `level`, `streak`, `badges`, `completedModuleIds`, `completedCapstones`, and `solvedCtfFlags`. A signed-in owner can therefore change those values directly, subject only to type/range/shape validation.

The client sync function in `services/firebase.ts` writes these fields from the browser profile. That is convenient synchronization, not proof of completed learning.

### P1 — Exam scores are client supplied in every reporting surface

The client exposes `recordModuleExamScore(moduleId, percentage)` and stores scores in the local profile. `syncUserProfileToCloud`, `syncStudentMemberSnapshot`, `joinClassroomByCode`, and `syncParentLinkSnapshot` then copy browser-provided values into user, classroom-member, and parent-link documents.

The rules validate that `examScores` is a map, but do not validate that an assessment was actually taken, that its answers were correct, or that the percentage was calculated by trusted code.

### P1 — Classroom and parent snapshots are student-writable

A student can update their own classroom member document and parent-link snapshot, including LP, level, streak, module completion, exam scores, capstones, CTF flags, and badges. Teachers and parents therefore see a convenient progress snapshot, not a tamper-resistant record.

### P1 — Capstone completion and certificates are client-minted

`components/CapstonesAndCertificates.tsx` checks client-side component selections and checklist toggles, then calls `recordCapstoneComplete`. Certificate identifiers and SVG certificates are generated in the browser. This is suitable as a learning activity/participation certificate, but it is not independently verified evidence of mastery.

### P2 — Role selection is a profile preference, not authorization

The UI lets a user switch Student, Teacher, and Parent modes. Firestore classroom ownership checks are based on the immutable classroom `teacherUid`, which is stronger than trusting the profile role. Continue to treat `accountType` as a display preference only; never use it as an authorization claim.

### P2 — Local browser state is not a trusted source

The profile is persisted in localStorage and merged with cloud values. Local progress can be edited by the device owner. Local-first/offline learning is a valid product feature, but locally recorded achievements must remain provisional until reconciled by trusted logic.

## Required remediation architecture

1. **Separate profile preferences from achievements.** Keep editable profile fields (display name, preferred grade, audio, avatar presentation) separate from reward/progress records.
2. **Introduce trusted assessment submission.** The browser submits an attempt identifier and answers; the server loads the canonical assessment, validates eligibility/retake rules, calculates the score, and writes an immutable attempt/result record.
3. **Make rewards server-derived.** Award LP, levels, streaks, badges, capstones, and CTF completion only from validated server-side events. Never accept a client-supplied reward amount or score as authoritative.
4. **Publish trusted snapshots.** Classroom and parent views should read server-maintained summaries. Students must not be able to write authoritative score/reward fields into those documents.
5. **Preserve offline mode honestly.** Keep local learning progress available offline, but label unsynchronized/local achievements as provisional. Reconcile them through trusted validation when online.
6. **Issue verifiable certificates.** Generate a certificate record and unique verification token server-side only after a trusted capstone assessment; expose a public verification endpoint that reveals minimal information.
7. **Add rules tests before tightening writes.** Use the Firebase Emulator Suite and rules-unit-testing to cover owner reads, profile preference updates, student self-escalation attempts, cross-student reads/writes, teacher access, parent-link claims, and server-only achievement writes.

## Safe rollout sequence

- **Phase A:** Add emulator-backed rules tests and define the canonical achievement schema.
- **Phase B:** Implement server endpoints/transactions and migrate classroom/parent summaries to server-maintained records.
- **Phase C:** Update the client to submit attempts and display provisional versus verified status.
- **Phase D:** Tighten Firestore rules to deny direct client mutation of authoritative achievement fields; verify all existing classroom and parent flows against emulator tests.
- **Phase E:** Migrate or explicitly mark historical client-originated values as unverified; do not silently grandfather them as verified.

## Release gate

Production launch remains blocked for any feature marketed as verified assessment, verified score, tamper-resistant progress, or independently verifiable certificate until the trusted write path, Firestore emulator tests, migration behavior, and end-to-end flows all pass. Existing local-first lessons and practice experiences can continue to be tested separately.

## Audit limitation

This is a source-code and rules review, not a live Firebase project audit. It does not prove deployed rules match this branch, inspect production data, or test the deployed Firebase configuration. Confirm deployed rules and run emulator/integration tests before release.
