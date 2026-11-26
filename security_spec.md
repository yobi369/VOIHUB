# TECH HUB Security Specification

## 1. Data Invariants
1. User profile documents at `/users/{userId}` contain PII (`email`) and are strictly readable and writable only by the authenticated owner (`request.auth.uid == userId`) or admin. Listing `/users` is disabled.
2. Classroom documents at `/classrooms/{classId}` belong to a single immutable `teacherUid` matching the creator's `request.auth.uid`.
3. A student cannot join `/classrooms/{classId}/members/{studentUid}` without a matching `joinCode` and `teacherUid` verified synchronously via `get()` against `/classrooms/{classId}`.
4. Students can only update their own `/classrooms/{classId}/members/{studentUid}` progress metrics and cannot alter `studentUid`, `classId`, `teacherUid`, `joinCode`, or `joinedAt`.
5. Parent links at `/parentLinks/{linkCode}` store zero PII (no email/phone) and allow one parent account (`parentUid`) to claim a student's invite code and inspect that student's progress.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. Unauthenticated read/write to `/users/{uid}` -> DENIED (`request.auth == null`).
2. Authenticated student A reading `/users/{uidB}` -> DENIED (PII isolation).
3. Authenticated user listing `/users` -> DENIED (`allow list: if false`).
4. User writing `/users/{uid}` with `uid: "other-uid"` -> DENIED (Identity spoofing).
5. User updating `/users/{uid}` with ghost field `isAdmin: true` -> DENIED (`hasOnly` / `affectedKeys`).
6. User writing `/users/{uid}` with oversized `name` (> 40 chars) or non-string -> DENIED (Size/Type validation).
7. User creating `/classrooms/bad$id` with invalid document ID characters -> DENIED (`isValidId`).
8. Teacher A updating Teacher B's `/classrooms/{classId}` `assignedModuleIds` -> DENIED (`existing().teacherUid == request.auth.uid`).
9. Student creating `/classrooms/{classId}/members/{uid}` with wrong `joinCode` -> DENIED (Master Gate `get()` check).
10. Student updating `/classrooms/{classId}/members/{uid}` to tamper with `teacherUid` -> DENIED (Immortal field invariant).
11. Unlinked user listing `/parentLinks` -> DENIED (`allow list` requires `studentUid` or `parentUid` match).
12. Third-party user overwriting an already-claimed `parentLinks/{code}.parentUid` -> DENIED (Terminal parent claim lock).
