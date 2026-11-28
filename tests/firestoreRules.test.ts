import { after, before, beforeEach, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

const projectId = "demo-voihub-rules";
let env: RulesTestEnvironment;

before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

after(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "users", "student-1"), { uid: "student-1", name: "Student One" });
    await setDoc(doc(db, "users", "student-2"), { uid: "student-2", name: "Student Two" });
    await setDoc(doc(db, "classrooms", "class-1"), {
      id: "class-1",
      teacherUid: "teacher-1",
      joinCode: "JOIN-01",
    });
    await setDoc(doc(db, "classrooms", "class-1", "members", "student-1"), {
      studentUid: "student-1",
      classId: "class-1",
      teacherUid: "teacher-1",
    });
    await setDoc(doc(db, "classrooms", "class-1", "members", "student-2"), {
      studentUid: "student-2",
      classId: "class-1",
      teacherUid: "teacher-1",
    });
  });
});

test("unauthenticated users cannot read private user profiles", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, "users", "student-1")));
});

test("a verified student can read their own profile", async () => {
  const db = env.authenticatedContext("student-1", {
    email: "student@example.test",
    email_verified: true,
  }).firestore();

  await assertSucceeds(getDoc(doc(db, "users", "student-1")));
});

test("a student cannot read another student's private profile", async () => {
  const db = env.authenticatedContext("student-1", {
    email: "student@example.test",
    email_verified: true,
  }).firestore();

  await assertFails(getDoc(doc(db, "users", "student-2")));
});

test("students cannot list the private users collection", async () => {
  const db = env.authenticatedContext("student-1", {
    email: "student@example.test",
    email_verified: true,
  }).firestore();

  await assertFails(getDocs(collection(db, "users")));
});

test("a student can read their own classroom member record", async () => {
  const db = env.authenticatedContext("student-1", {
    email: "student@example.test",
    email_verified: true,
  }).firestore();

  await assertSucceeds(getDoc(doc(db, "classrooms", "class-1", "members", "student-1")));
});

test("a student cannot read another student's classroom member record", async () => {
  const db = env.authenticatedContext("student-1", {
    email: "student@example.test",
    email_verified: true,
  }).firestore();

  await assertFails(getDoc(doc(db, "classrooms", "class-1", "members", "student-2")));
});

test("the owning teacher can read a classroom member record", async () => {
  const db = env.authenticatedContext("teacher-1", {
    email: "teacher@example.test",
    email_verified: true,
  }).firestore();

  await assertSucceeds(getDoc(doc(db, "classrooms", "class-1", "members", "student-1")));
});

test("unrelated users cannot read a classroom member record", async () => {
  const db = env.authenticatedContext("outsider-1", {
    email: "outsider@example.test",
    email_verified: true,
  }).firestore();

  await assertFails(getDoc(doc(db, "classrooms", "class-1", "members", "student-1")));
});
