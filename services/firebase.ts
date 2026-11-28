import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import type {
  AccountType,
  ClassroomMemberRecord,
  ClassroomRecord,
  ParentLinkRecord,
  UserProfile,
} from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

const cleanId = (raw: string) =>
  raw
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 128);

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars, no 0/O/1/I; 256 % 32 === 0 so no modulo bias

export const secureCode = (length: number): string => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
};

const clampStr = (val: string | undefined, max: number, fallback = ''): string =>
  (val || fallback).slice(0, max);

const clampArr = (arr: string[] | undefined, max: number): string[] =>
  Array.isArray(arr) ? arr.filter((x) => typeof x === 'string').slice(0, max) : [];

export interface CloudUserDoc {
  uid: string;
  email: string;
  name: string;
  accountType: AccountType;
  preferredGrade: number;
  lp: number;
  level: number;
  streak: number;
  lastLogin: string;
  questsLastGenerated: string;
  audioEnabled: boolean;
  unlockedAvatarItems: string[];
  equippedAvatarItems: { hat?: string; glasses?: string };
  badges: string[];
  completedModuleIds: string[];
  completedCapstones: string[];
  solvedCtfFlags: string[];
  joinedClassIds: string[];
  parentInviteCode: string;
}

export async function loadUserProfileFromCloud(uid: string): Promise<CloudUserDoc | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as CloudUserDoc;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function syncUserProfileToCloud(
  user: User,
  profile: UserProfile,
  completedModuleIds: string[]
): Promise<void> {
  if (!user.uid || !user.emailVerified) return;
  const path = `users/${user.uid}`;
  const docRef = doc(db, 'users', user.uid);

  const safeEquipped: Record<string, string> = {};
  if (profile.equippedAvatarItems?.hat) safeEquipped.hat = clampStr(profile.equippedAvatarItems.hat, 60);
  if (profile.equippedAvatarItems?.glasses) safeEquipped.glasses = clampStr(profile.equippedAvatarItems.glasses, 60);

  const payload = {
    uid: user.uid,
    email: clampStr(user.email || 'user@techhub.edu', 200),
    name: clampStr(profile.name || user.displayName || 'Scholar', 40, 'Scholar'),
    accountType: (profile.accountType || 'student') as AccountType,
    preferredGrade: Math.min(9, Math.max(1, Math.round(profile.preferredGrade || 3))),
    lp: Math.min(10000000, Math.max(0, Math.round(profile.lp || 0))),
    level: Math.min(200, Math.max(1, Math.round(profile.level || 1))),
    streak: Math.min(10000, Math.max(0, Math.round(profile.streak || 1))),
    lastLogin: clampStr(profile.lastLogin, 32, new Date().toISOString().split('T')[0]),
    questsLastGenerated: clampStr(profile.questsLastGenerated, 32, '1970-01-01'),
    audioEnabled: Boolean(profile.audioEnabled),
    unlockedAvatarItems: clampArr(profile.unlockedAvatarItems, 20),
    equippedAvatarItems: safeEquipped,
    badges: clampArr(profile.badges, 40),
    completedModuleIds: clampArr(completedModuleIds, 900),
    completedCapstones: clampArr(profile.completedCapstones, 40),
    solvedCtfFlags: clampArr(profile.solvedCtfFlags, 40),
    joinedClassIds: clampArr(profile.joinedClassIds, 30),
    parentInviteCode: clampStr(profile.parentInviteCode, 32),
    updatedAt: serverTimestamp(),
  };

  try {
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createClassroom(
  teacherUid: string,
  teacherName: string,
  name: string,
  grade: number
): Promise<ClassroomRecord> {
  const safeTeacherUid = cleanId(teacherUid);
  const classId = cleanId(`cls-${Date.now().toString(36)}-${secureCode(4)}`);
  const safeGrade = Math.min(9, Math.max(1, Math.round(grade)));
  // 6 unambiguous characters from a CSPRNG (~1 billion codes per grade); the join code is the only gate to a class.
  const joinCode = `TH-G${safeGrade}-${secureCode(6)}`;
  const safeName = clampStr(name.trim() || `Class ${safeGrade} Tech Cohort`, 80, `Class ${safeGrade} Tech Cohort`);
  const safeTeacherName = clampStr(teacherName.trim() || 'Lead Instructor', 60, 'Lead Instructor');

  const path = `classrooms/${classId}`;
  try {
    const batch = writeBatch(db);
    const classRef = doc(db, 'classrooms', classId);
    const inviteRef = doc(db, 'classroomInvites', joinCode);

    const classroomData = {
      id: classId,
      teacherUid: safeTeacherUid,
      teacherName: safeTeacherName,
      name: safeName,
      grade: safeGrade,
      joinCode,
      assignedModuleIds: [] as string[],
      lockedExamModuleIds: [] as string[],
      allowRetakes: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(classRef, classroomData);
    batch.set(inviteRef, {
      joinCode,
      classId,
      teacherUid: safeTeacherUid,
      classroomName: safeName,
      grade: safeGrade,
      createdAt: serverTimestamp(),
    });

    await batch.commit();

    return {
      id: classId,
      teacherUid: safeTeacherUid,
      teacherName: safeTeacherName,
      name: safeName,
      grade: safeGrade,
      joinCode,
      assignedModuleIds: [],
      lockedExamModuleIds: [],
      allowRetakes: true,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchTeacherClassrooms(teacherUid: string): Promise<ClassroomRecord[]> {
  const path = 'classrooms';
  try {
    const q = query(collection(db, 'classrooms'), where('teacherUid', '==', teacherUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ClassroomRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateClassroomControls(
  classId: string,
  updates: Partial<Pick<ClassroomRecord, 'name' | 'grade' | 'assignedModuleIds' | 'lockedExamModuleIds' | 'allowRetakes' | 'teacherName'>>
): Promise<void> {
  const path = `classrooms/${classId}`;
  try {
    const cleanUpdates: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };
    if (updates.name !== undefined) cleanUpdates.name = clampStr(updates.name, 80, 'Tech Class');
    if (updates.teacherName !== undefined) cleanUpdates.teacherName = clampStr(updates.teacherName, 60, 'Instructor');
    if (updates.grade !== undefined) cleanUpdates.grade = Math.min(9, Math.max(1, Math.round(updates.grade)));
    if (updates.assignedModuleIds !== undefined) cleanUpdates.assignedModuleIds = clampArr(updates.assignedModuleIds, 30);
    if (updates.lockedExamModuleIds !== undefined) cleanUpdates.lockedExamModuleIds = clampArr(updates.lockedExamModuleIds, 30);
    if (updates.allowRetakes !== undefined) cleanUpdates.allowRetakes = Boolean(updates.allowRetakes);

    await updateDoc(doc(db, 'classrooms', classId), cleanUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function fetchClassroomMembers(classId: string): Promise<ClassroomMemberRecord[]> {
  const path = `classrooms/${classId}/members`;
  try {
    const snap = await getDocs(collection(db, 'classrooms', classId, 'members'));
    return snap.docs.map((d) => d.data() as ClassroomMemberRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function joinClassroomByCode(
  rawCode: string,
  studentUid: string,
  profile: UserProfile,
  completedModuleIds: string[]
): Promise<ClassroomRecord> {
  const joinCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
  if (joinCode.length < 4) {
    throw new Error('Please enter a valid classroom Join Code (e.g. TH-G3-AB12).');
  }

  const invitePath = `classroomInvites/${joinCode}`;
  let inviteSnap;
  try {
    inviteSnap = await getDoc(doc(db, 'classroomInvites', joinCode));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, invitePath);
  }

  if (!inviteSnap.exists()) {
    throw new Error(`Classroom code "${joinCode}" was not found. Ask your teacher to double-check the code.`);
  }

  const invite = inviteSnap.data() as {
    classId: string;
    teacherUid: string;
    classroomName: string;
    grade: number;
    joinCode: string;
  };

  const memberPath = `classrooms/${invite.classId}/members/${studentUid}`;
  const memberRef = doc(db, 'classrooms', invite.classId, 'members', studentUid);

  const safeExamScores: Record<string, number> = {};
  if (profile.examScores) {
    Object.entries(profile.examScores)
      .slice(0, 200)
      .forEach(([k, v]) => {
        if (typeof v === 'number') safeExamScores[k] = Math.min(100, Math.max(0, Math.round(v)));
      });
  }

  try {
    const existingMember = await getDoc(memberRef);
    const basePayload = {
      studentUid,
      classId: invite.classId,
      teacherUid: invite.teacherUid,
      joinCode: invite.joinCode,
      studentName: clampStr(profile.name, 40, 'Scholar'),
      grade: Math.min(9, Math.max(1, Math.round(profile.preferredGrade || invite.grade || 3))),
      lp: Math.min(10000000, Math.max(0, Math.round(profile.lp || 0))),
      level: Math.min(200, Math.max(1, Math.round(profile.level || 1))),
      streak: Math.min(10000, Math.max(0, Math.round(profile.streak || 1))),
      completedModulesCount: Math.min(900, completedModuleIds.length),
      completedModuleIds: clampArr(completedModuleIds, 900),
      examScores: safeExamScores,
      completedCapstones: clampArr(profile.completedCapstones, 40),
      solvedCtfFlags: clampArr(profile.solvedCtfFlags, 40),
      badgesCount: Math.min(40, (profile.badges || []).length),
      updatedAt: serverTimestamp(),
    };

    if (!existingMember.exists()) {
      await setDoc(memberRef, {
        ...basePayload,
        joinedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(memberRef, basePayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, memberPath);
  }

  const classPath = `classrooms/${invite.classId}`;
  try {
    const classSnap = await getDoc(doc(db, 'classrooms', invite.classId));
    if (!classSnap.exists()) {
      throw new Error('Classroom record unavailable.');
    }
    return classSnap.data() as ClassroomRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, classPath);
  }
}

export async function fetchJoinedClassrooms(classIds: string[]): Promise<ClassroomRecord[]> {
  const results: ClassroomRecord[] = [];
  for (const cid of classIds.slice(0, 15)) {
    const path = `classrooms/${cid}`;
    try {
      const snap = await getDoc(doc(db, 'classrooms', cid));
      if (snap.exists()) {
        results.push(snap.data() as ClassroomRecord);
      }
    } catch {
      // Student may have been removed from classroom; skip gracefully
    }
  }
  return results;
}

export async function syncStudentMemberSnapshot(
  classIds: string[],
  studentUid: string,
  profile: UserProfile,
  completedModuleIds: string[]
): Promise<void> {
  if (!studentUid || classIds.length === 0) return;
  const safeExamScores: Record<string, number> = {};
  if (profile.examScores) {
    Object.entries(profile.examScores)
      .slice(0, 200)
      .forEach(([k, v]) => {
        if (typeof v === 'number') safeExamScores[k] = Math.min(100, Math.max(0, Math.round(v)));
      });
  }

  for (const cid of classIds.slice(0, 10)) {
    const path = `classrooms/${cid}/members/${studentUid}`;
    try {
      const ref = doc(db, 'classrooms', cid, 'members', studentUid);
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;
      await updateDoc(ref, {
        studentName: clampStr(profile.name, 40, 'Scholar'),
        grade: Math.min(9, Math.max(1, Math.round(profile.preferredGrade || 3))),
        lp: Math.min(10000000, Math.max(0, Math.round(profile.lp || 0))),
        level: Math.min(200, Math.max(1, Math.round(profile.level || 1))),
        streak: Math.min(10000, Math.max(0, Math.round(profile.streak || 1))),
        completedModulesCount: Math.min(900, completedModuleIds.length),
        completedModuleIds: clampArr(completedModuleIds, 900),
        examScores: safeExamScores,
        completedCapstones: clampArr(profile.completedCapstones, 40),
        solvedCtfFlags: clampArr(profile.solvedCtfFlags, 40),
        badgesCount: Math.min(40, (profile.badges || []).length),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn(`Could not sync member snapshot at ${path}`, error);
    }
  }
}

export async function removeStudentFromClassroom(classId: string, studentUid: string): Promise<void> {
  const path = `classrooms/${classId}/members/${studentUid}`;
  try {
    await deleteDoc(doc(db, 'classrooms', classId, 'members', studentUid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncParentLinkSnapshot(
  linkCode: string,
  studentUid: string,
  profile: UserProfile,
  completedModuleIds: string[]
): Promise<void> {
  if (!linkCode || linkCode.length < 6 || !studentUid) return;
  const safeCode = linkCode.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 32);
  const path = `parentLinks/${safeCode}`;
  const ref = doc(db, 'parentLinks', safeCode);

  const safeExamScores: Record<string, number> = {};
  if (profile.examScores) {
    Object.entries(profile.examScores)
      .slice(0, 200)
      .forEach(([k, v]) => {
        if (typeof v === 'number') safeExamScores[k] = Math.min(100, Math.max(0, Math.round(v)));
      });
  }

  const basePayload = {
    studentName: clampStr(profile.name, 40, 'Scholar'),
    grade: Math.min(9, Math.max(1, Math.round(profile.preferredGrade || 3))),
    lp: Math.min(10000000, Math.max(0, Math.round(profile.lp || 0))),
    level: Math.min(200, Math.max(1, Math.round(profile.level || 1))),
    streak: Math.min(10000, Math.max(0, Math.round(profile.streak || 1))),
    completedModulesCount: Math.min(900, completedModuleIds.length),
    completedModuleIds: clampArr(completedModuleIds, 900),
    examScores: safeExamScores,
    completedCapstones: clampArr(profile.completedCapstones, 40),
    solvedCtfFlags: clampArr(profile.solvedCtfFlags, 40),
    badges: clampArr(profile.badges, 40),
    updatedAt: serverTimestamp(),
  };

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        linkCode: safeCode,
        studentUid,
        parentUid: '',
        ...basePayload,
        createdAt: serverTimestamp(),
      });
    } else if ((snap.data() as ParentLinkRecord).studentUid === studentUid) {
      await updateDoc(ref, basePayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function claimParentLink(rawCode: string, parentUid: string): Promise<ParentLinkRecord> {
  const safeCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 32);
  if (safeCode.length < 6) {
    throw new Error('Please enter a valid Parent Link Code (e.g. KID-A1B2C3).');
  }
  const path = `parentLinks/${safeCode}`;
  const ref = doc(db, 'parentLinks', safeCode);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error(`Parent Link Code "${safeCode}" not found. Ask your child to generate/activate it in their Scholar Portal.`);
    }
    const data = snap.data() as ParentLinkRecord;
    if (data.parentUid && data.parentUid !== parentUid) {
      throw new Error('This link code is already paired with another parent account.');
    }
    if (!data.parentUid) {
      await updateDoc(ref, {
        parentUid,
        updatedAt: serverTimestamp(),
      });
      return { ...data, parentUid };
    }
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchLinkedChildrenForParent(parentUid: string): Promise<ParentLinkRecord[]> {
  const path = 'parentLinks';
  try {
    const q = query(collection(db, 'parentLinks'), where('parentUid', '==', parentUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ParentLinkRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
