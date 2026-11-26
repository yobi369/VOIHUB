import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  Check,
  Copy,
  GraduationCap,
  Lock,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  Unlock,
  Users,
} from 'lucide-react';
import { BADGES, SUBJECT_METAS } from '../constants';
import { ALL_MODULES, findModuleById } from '../data/curriculum';
import { extractCompletedModuleIds, useUserProfile } from '../hooks/useUserProfile';
import {
  claimParentLink,
  createClassroom,
  fetchClassroomMembers,
  fetchLinkedChildrenForParent,
  fetchTeacherClassrooms,
  joinClassroomByCode,
  removeStudentFromClassroom,
  syncParentLinkSnapshot,
  updateClassroomControls,
} from '../services/firebase';
import type {
  AccountType,
  ClassroomMemberRecord,
  ClassroomRecord,
  CurriculumModule,
  ParentLinkRecord,
} from '../types';

interface ClassroomPortalProps {
  onOpenModule: (mod: CurriculumModule) => void;
}

const ClassroomPortal: React.FC<ClassroomPortalProps> = ({ onOpenModule }) => {
  const {
    profile,
    authUser,
    isCloudSyncing,
    cloudError,
    signInWithGoogle,
    signOutUser,
    setAccountType,
    joinedClassrooms,
    addJoinedClassroom,
    removeJoinedClassroom,
    refreshJoinedClassrooms,
  } = useUserProfile();

  const role: AccountType = profile.accountType || 'student';
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Student Join Class state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Teacher state
  const [teacherClasses, setTeacherClasses] = useState<ClassroomRecord[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [members, setMembers] = useState<ClassroomMemberRecord[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<number>(3);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
  const [assignFilterGrade, setAssignFilterGrade] = useState<number>(3);
  const [assignModulePick, setAssignModulePick] = useState<string>('');

  // Parent state
  const [parentCodeInput, setParentCodeInput] = useState('');
  const [linkedChildren, setLinkedChildren] = useState<ParentLinkRecord[]>([]);
  const [isLoadingParent, setIsLoadingParent] = useState(false);

  const selectedClass = useMemo(
    () => teacherClasses.find((c) => c.id === selectedClassId) || teacherClasses[0] || null,
    [teacherClasses, selectedClassId]
  );

  const assignableModules = useMemo(
    () => ALL_MODULES.filter((m) => m.grade === assignFilterGrade),
    [assignFilterGrade]
  );

  useEffect(() => {
    if (assignableModules.length > 0 && !assignableModules.some((m) => m.id === assignModulePick)) {
      setAssignModulePick(assignableModules[0].id);
    }
  }, [assignableModules, assignModulePick]);

  const loadTeacherData = useCallback(async () => {
    if (!authUser) return;
    setIsLoadingTeacher(true);
    setErrMsg(null);
    try {
      const classes = await fetchTeacherClassrooms(authUser.uid);
      setTeacherClasses(classes);
      const targetId = classes.find((c) => c.id === selectedClassId)?.id || classes[0]?.id || '';
      setSelectedClassId(targetId);
      if (targetId) {
        const mList = await fetchClassroomMembers(targetId);
        setMembers(mList);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      setErrMsg(err?.message || 'Could not load teacher classrooms.');
    } finally {
      setIsLoadingTeacher(false);
    }
  }, [authUser, selectedClassId]);

  const loadParentData = useCallback(async () => {
    if (!authUser) return;
    setIsLoadingParent(true);
    setErrMsg(null);
    try {
      const list = await fetchLinkedChildrenForParent(authUser.uid);
      setLinkedChildren(list);
    } catch (err: any) {
      setErrMsg(err?.message || 'Could not load linked student progress.');
    } finally {
      setIsLoadingParent(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;
    if (role === 'teacher') {
      loadTeacherData();
    } else if (role === 'parent') {
      loadParentData();
    } else {
      refreshJoinedClassrooms();
    }
  }, [authUser, role, loadTeacherData, loadParentData, refreshJoinedClassrooms]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      window.setTimeout(() => setCopiedCode(null), 1800);
    } catch {
      setStatusMsg(`Code: ${text}`);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setErrMsg(null);
    setStatusMsg(null);
    try {
      const created = await createClassroom(
        authUser.uid,
        profile.name || authUser.displayName || 'Lead Instructor',
        newClassName || `Class ${newClassGrade} Cohort`,
        newClassGrade
      );
      setTeacherClasses((prev) => [created, ...prev]);
      setSelectedClassId(created.id);
      setMembers([]);
      setNewClassName('');
      setAssignFilterGrade(created.grade);
      setStatusMsg(`Classroom "${created.name}" created! Share Join Code ${created.joinCode} with students.`);
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to create classroom.');
    }
  };

  const handleAssignModule = async () => {
    if (!selectedClass || !assignModulePick) return;
    setErrMsg(null);
    const existing = selectedClass.assignedModuleIds || [];
    if (existing.includes(assignModulePick)) return;
    const next = [...existing, assignModulePick].slice(0, 30);
    try {
      await updateClassroomControls(selectedClass.id, { assignedModuleIds: next });
      setTeacherClasses((prev) =>
        prev.map((c) => (c.id === selectedClass.id ? { ...c, assignedModuleIds: next } : c))
      );
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to assign module.');
    }
  };

  const handleUnassignModule = async (modId: string) => {
    if (!selectedClass) return;
    const next = (selectedClass.assignedModuleIds || []).filter((id) => id !== modId);
    try {
      await updateClassroomControls(selectedClass.id, { assignedModuleIds: next });
      setTeacherClasses((prev) =>
        prev.map((c) => (c.id === selectedClass.id ? { ...c, assignedModuleIds: next } : c))
      );
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to unassign module.');
    }
  };

  const handleToggleLockExam = async (modId: string) => {
    if (!selectedClass) return;
    const currentLocked = selectedClass.lockedExamModuleIds || [];
    const nextLocked = currentLocked.includes(modId)
      ? currentLocked.filter((id) => id !== modId)
      : [...currentLocked, modId].slice(0, 30);
    try {
      await updateClassroomControls(selectedClass.id, { lockedExamModuleIds: nextLocked });
      setTeacherClasses((prev) =>
        prev.map((c) => (c.id === selectedClass.id ? { ...c, lockedExamModuleIds: nextLocked } : c))
      );
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to update exam lock.');
    }
  };

  const handleToggleRetakes = async () => {
    if (!selectedClass) return;
    const nextVal = !selectedClass.allowRetakes;
    try {
      await updateClassroomControls(selectedClass.id, { allowRetakes: nextVal });
      setTeacherClasses((prev) =>
        prev.map((c) => (c.id === selectedClass.id ? { ...c, allowRetakes: nextVal } : c))
      );
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to toggle retake rule.');
    }
  };

  const handleRemoveMember = async (studentUid: string) => {
    if (!selectedClass) return;
    try {
      await removeStudentFromClassroom(selectedClass.id, studentUid);
      setMembers((prev) => prev.filter((m) => m.studentUid !== studentUid));
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to remove student.');
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setIsJoining(true);
    setErrMsg(null);
    setStatusMsg(null);
    try {
      const completedIds = extractCompletedModuleIds(profile);
      const cls = await joinClassroomByCode(joinCodeInput, authUser.uid, profile, completedIds);
      addJoinedClassroom(cls.id);
      await refreshJoinedClassrooms();
      setJoinCodeInput('');
      setStatusMsg(`Joined "${cls.name}" (Class ${cls.grade})!`);
    } catch (err: any) {
      setErrMsg(err?.message || 'Could not join classroom.');
    } finally {
      setIsJoining(false);
    }
  };

  const handlePublishParentBridge = async () => {
    if (!authUser || !profile.parentInviteCode) return;
    setErrMsg(null);
    try {
      const completedIds = extractCompletedModuleIds(profile);
      await syncParentLinkSnapshot(profile.parentInviteCode, authUser.uid, profile, completedIds);
      setStatusMsg(`Parent Link Code ${profile.parentInviteCode} synced live to Firestore!`);
    } catch (err: any) {
      setErrMsg(err?.message || 'Unable to sync parent invite link.');
    }
  };

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setErrMsg(null);
    setStatusMsg(null);
    try {
      const linked = await claimParentLink(parentCodeInput, authUser.uid);
      setLinkedChildren((prev) => {
        const filtered = prev.filter((p) => p.linkCode !== linked.linkCode);
        return [linked, ...filtered];
      });
      setParentCodeInput('');
      setStatusMsg(`Connected to ${linked.studentName}'s TECH HUB learning telemetry!`);
    } catch (err: any) {
      setErrMsg(err?.message || 'Could not link child code.');
    }
  };

  const computeSubjectMastery = (completedIds: string[]) => {
    return SUBJECT_METAS.map((sub) => {
      const count = completedIds.filter((id) => id.startsWith(`${sub.id}-`)).length;
      return { name: sub.shortName, count };
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
      {/* Top Cloud Identity & Mode Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-700">
            Proposal 2 · Multi-Role Accounts &amp; Classroom Sync
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom &amp; Family Portal
          </h1>
          <p className="text-sm text-slate-600">
            Switch between Student, Teacher, and Parent portals with live Google Account &amp; Firestore synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            {(['student', 'teacher', 'parent'] as AccountType[]).map((r) => (
              <button
                key={r}
                onClick={() => setAccountType(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                  role === r ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r} Mode
              </button>
            ))}
          </div>

          {/* Auth Action */}
          {authUser ? (
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <div className="text-xs">
                <div className="font-bold text-slate-900 leading-tight">{authUser.displayName || profile.name}</div>
                <div className="text-[11px] text-slate-500">
                  {isCloudSyncing ? 'Syncing...' : authUser.email}
                </div>
              </div>
              <button
                onClick={signOutUser}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle().catch(() => {})}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Google (Cloud Sync)
            </button>
          )}
        </div>
      </div>

      {(errMsg || cloudError) && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-medium">
          {errMsg || cloudError}
        </div>
      )}

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-medium">
          {statusMsg}
        </div>
      )}

      {!authUser ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-2xl mx-auto space-y-4">
          <Users className="w-10 h-10 text-blue-700 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Sign In to Unlock Cloud Classrooms &amp; Family Sync</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lessons, Knowledge Vault packs, and simulators always work offline. Signing in with Google activates Firestore cloud sync across devices, Teacher Classroom Join Codes, Module Assignments, Exam Locks, and Parent Progress Dashboards.
          </p>
          <button
            onClick={() => signInWithGoogle().catch(() => {})}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
          >
            <LogIn className="w-4 h-4" /> Continue with Google
          </button>
        </div>
      ) : (
        <>
          {/* ===================== STUDENT VIEW ===================== */}
          {role === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Join a Teacher Classroom</h3>
                  <form onSubmit={handleJoinClass} className="flex gap-2">
                    <input
                      type="text"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter Join Code (e.g. TH-G3-AB12)"
                      className="flex-1 px-3 py-2 text-xs font-mono-math border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                    <button
                      type="submit"
                      disabled={isJoining}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                      {isJoining ? 'Joining...' : 'Join Class'}
                    </button>
                  </form>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-500">Enrolled Classrooms ({joinedClassrooms.length})</div>
                    {joinedClassrooms.length === 0 ? (
                      <p className="text-xs text-slate-500">Not enrolled in a classroom yet. Ask your teacher for a Join Code or switch to Teacher Mode to test creating one!</p>
                    ) : (
                      joinedClassrooms.map((cls) => (
                        <div key={cls.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{cls.name}</div>
                            <div className="text-[11px] text-slate-500">
                              Class {cls.grade} · Teacher: {cls.teacherName} · {cls.allowRetakes ? 'Retakes Allowed' : 'Single Exam Attempt'}
                            </div>
                          </div>
                          <button
                            onClick={() => removeJoinedClassroom(cls.id)}
                            className="text-[11px] text-rose-600 hover:underline"
                          >
                            Leave
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Parent Invite Code Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Share Progress With Parents</h3>
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Share this code with your parent so they can follow your TECH HUB badges, LP, capstones, and exam scores in Parent Mode.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-slate-900 text-emerald-400 font-mono-math text-sm font-bold rounded-lg">
                      {profile.parentInviteCode}
                    </div>
                    <button
                      onClick={() => handleCopy(profile.parentInviteCode || '')}
                      className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      {copiedCode === profile.parentInviteCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                  <button
                    onClick={handlePublishParentBridge}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Activate / Refresh Live Parent Link
                  </button>
                </div>
              </div>

              {/* Assigned Modules from Teacher */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Teacher-Assigned Modules</h3>
                    <p className="text-xs text-slate-500">Modules prioritized by your enrolled classrooms.</p>
                  </div>
                  <button
                    onClick={refreshJoinedClassrooms}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {joinedClassrooms.every((c) => (c.assignedModuleIds || []).length === 0) ? (
                  <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-lg border border-slate-200">
                    No specific modules assigned by a teacher right now. Feel free to explore any Class 1–9 track!
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {joinedClassrooms.flatMap((c) =>
                      (c.assignedModuleIds || []).map((modId) => {
                        const mod = findModuleById(modId);
                        if (!mod) return null;
                        const locked = (c.lockedExamModuleIds || []).includes(modId);
                        const done = profile.progress?.[mod.grade]?.[mod.subjectName]?.completedTopics?.includes(mod.title);
                        return (
                          <div key={`${c.id}-${modId}`} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="text-[11px] font-mono-math text-blue-700 font-semibold">
                                {c.name} · Class {mod.grade} · {mod.subjectName}
                              </div>
                              <div className="text-sm font-bold text-slate-900">{mod.title}</div>
                              {locked && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-0.5">
                                  <Lock className="w-3 h-3" /> Exam currently locked by teacher
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => onOpenModule(mod)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 shrink-0"
                            >
                              {done ? 'Review Module' : 'Open Assignment'} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TEACHER VIEW ===================== */}
          {role === 'teacher' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Create & Select Classrooms */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Your Classrooms</h3>
                    <button
                      onClick={loadTeacherData}
                      className="text-xs text-blue-700 hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTeacher ? 'animate-spin' : ''}`} /> Sync
                    </button>
                  </div>

                  <form onSubmit={handleCreateClass} className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-xs font-bold text-slate-700">Create New Class Cohort</div>
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="e.g. Grade 3 AI Robotics"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(Number(e.target.value))}
                        className="px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                          <option key={g} value={g}>Class {g}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Class
                      </button>
                    </div>
                  </form>

                  <div className="space-y-1.5">
                    {teacherClasses.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={async () => {
                          setSelectedClassId(cls.id);
                          setAssignFilterGrade(cls.grade);
                          const mList = await fetchClassroomMembers(cls.id).catch(() => []);
                          setMembers(mList);
                        }}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                          selectedClass?.id === cls.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold">{cls.name}</div>
                        <div className={`font-mono-math text-[11px] mt-0.5 ${selectedClass?.id === cls.id ? 'text-emerald-300' : 'text-blue-700'}`}>
                          Class {cls.grade} · Code: {cls.joinCode}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Classroom Controls & Roster Heatmap */}
                <div className="lg:col-span-8 space-y-6">
                  {!selectedClass ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
                      Create your first classroom on the left to generate a Join Code, assign modules, and view student mastery heatmaps.
                    </div>
                  ) : (
                    <>
                      {/* Join Code & Policy Controls */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-slate-500">Active Classroom · Class {selectedClass.grade}</div>
                          <h3 className="text-xl font-bold text-slate-900">{selectedClass.name}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-mono-math font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded">
                              Join Code: {selectedClass.joinCode}
                            </span>
                            <button
                              onClick={() => handleCopy(selectedClass.joinCode)}
                              className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                            >
                              {copiedCode === selectedClass.joinCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              Copy
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleToggleRetakes}
                          className={`px-3.5 py-2 text-xs font-semibold rounded-lg border ${
                            selectedClass.allowRetakes
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}
                        >
                          {selectedClass.allowRetakes ? 'Exam Retakes: Enabled' : 'Exam Retakes: Locked (1 Try)'}
                        </button>
                      </div>

                      {/* Assign Modules & Exam Locks */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900">Assign Modules &amp; Manage Exam Locks</h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={assignFilterGrade}
                            onChange={(e) => setAssignFilterGrade(Number(e.target.value))}
                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                              <option key={g} value={g}>Class {g}</option>
                            ))}
                          </select>
                          <select
                            value={assignModulePick}
                            onChange={(e) => setAssignModulePick(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                          >
                            {assignableModules.map((m) => (
                              <option key={m.id} value={m.id}>
                                [{m.subjectName}] U{m.unitNumber}: {m.title}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleAssignModule}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shrink-0"
                          >
                            Assign Module
                          </button>
                        </div>

                        {(selectedClass.assignedModuleIds || []).length > 0 && (
                          <div className="space-y-2 pt-2">
                            {selectedClass.assignedModuleIds.map((modId) => {
                              const mod = findModuleById(modId);
                              if (!mod) return null;
                              const isLocked = (selectedClass.lockedExamModuleIds || []).includes(modId);
                              return (
                                <div key={modId} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-xs">
                                  <div className="truncate">
                                    <span className="font-mono-math text-blue-700 mr-2">C{mod.grade}</span>
                                    <span className="font-semibold text-slate-900">{mod.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => handleToggleLockExam(modId)}
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border font-semibold ${
                                        isLocked
                                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                      {isLocked ? 'Exam Locked' : 'Exam Open'}
                                    </button>
                                    <button
                                      onClick={() => handleUnassignModule(modId)}
                                      className="p-1 text-slate-400 hover:text-rose-600"
                                      title="Unassign"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Class Mastery Roster Heatmap */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">Student Mastery Heatmap ({members.length} Enrolled)</h4>
                          <span className="text-xs text-slate-500">Live Firestore Progress</span>
                        </div>
                        {members.length === 0 ? (
                          <p className="text-xs text-slate-500 py-4 text-center">
                            No students joined yet. Share Join Code <strong>{selectedClass.joinCode}</strong>!
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {members.map((m) => {
                              const scores = Object.values(m.examScores || {}) as number[];
                              const avgScore =
                                scores.length > 0
                                  ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                                  : null;
                              const trackCounts = computeSubjectMastery(m.completedModuleIds || []);
                              return (
                                <div key={m.studentUid} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                  <div>
                                    <div className="font-bold text-slate-900 text-sm">
                                      {m.studentName} <span className="font-mono-math text-xs text-blue-700 ml-1">Lv.{m.level} ({m.lp} LP)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 mt-1">
                                      {trackCounts.map((tc) => (
                                        <span key={tc.name} className="font-mono-math">
                                          {tc.name}: <strong>{tc.count}</strong>
                                        </span>
                                      ))}
                                      <span className="font-mono-math">Capstones: <strong>{m.completedCapstones?.length || 0}</strong></span>
                                      <span className="font-mono-math">CTFs: <strong>{m.solvedCtfFlags?.length || 0}</strong></span>
                                      <span className="font-mono-math">
                                        Avg Exam: <strong>{avgScore !== null ? `${avgScore}%` : '—'}</strong>
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveMember(m.studentUid)}
                                    className="text-[11px] text-rose-600 hover:underline self-start md:self-center shrink-0"
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== PARENT VIEW ===================== */}
          {role === 'parent' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Link a Child Account</h3>
                  <button
                    onClick={loadParentData}
                    className="text-xs text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingParent ? 'animate-spin' : ''}`} /> Sync
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter the <code className="font-mono-math text-slate-900">KID-...</code> code shown inside your child’s Student Portal (after they click "Activate Live Parent Link").
                </p>
                <form onSubmit={handleLinkChild} className="flex gap-2">
                  <input
                    type="text"
                    value={parentCodeInput}
                    onChange={(e) => setParentCodeInput(e.target.value.toUpperCase())}
                    placeholder="KID-XXXXXX"
                    className="flex-1 px-3 py-2 text-xs font-mono-math border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Link Child
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {linkedChildren.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
                    <GraduationCap className="w-8 h-8 text-blue-700 mx-auto" />
                    <div className="text-sm font-bold text-slate-900">No Linked Children Yet</div>
                    <p className="text-xs text-slate-500">
                      Link a child’s invite code on the left to inspect their AI, Networking, and Cybersecurity mastery, badges, capstones, and exam scores.
                    </p>
                  </div>
                ) : (
                  linkedChildren.map((child) => {
                    const trackCounts = computeSubjectMastery(child.completedModuleIds || []);
                    const examEntries = Object.entries(child.examScores || {}) as [string, number][];
                    return (
                      <div key={child.linkCode} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <div className="text-xs font-mono-math text-blue-700 font-semibold">
                              Class {child.grade} Scholar · Code {child.linkCode}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{child.studentName}</h3>
                          </div>
                          <div className="flex gap-4 font-mono-math text-xs">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
                              <div className="text-slate-500 text-[10px]">LEVEL</div>
                              <div className="font-bold text-slate-900">{child.level}</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
                              <div className="text-slate-500 text-[10px]">TOTAL LP</div>
                              <div className="font-bold text-blue-700">{child.lp}</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
                              <div className="text-slate-500 text-[10px]">STREAK</div>
                              <div className="font-bold text-emerald-700">{child.streak}d</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                          {trackCounts.map((t) => (
                            <div key={t.name} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                              <div className="text-slate-500 text-[11px]">{t.name} Modules</div>
                              <div className="font-mono-math text-lg font-bold text-slate-900">{t.count}</div>
                            </div>
                          ))}
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="text-slate-500 text-[11px]">Capstones Built</div>
                            <div className="font-mono-math text-lg font-bold text-blue-700">{child.completedCapstones?.length || 0}</div>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="text-slate-500 text-[11px]">Cyber CTF Flags</div>
                            <div className="font-mono-math text-lg font-bold text-emerald-700">{child.solvedCtfFlags?.length || 0}</div>
                          </div>
                        </div>

                        {examEntries.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <BookMarked className="w-3.5 h-3.5 text-blue-700" /> Recent Exam Mastery Scores
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {examEntries.slice(0, 8).map(([modId, pct]) => {
                                const mod = findModuleById(modId);
                                return (
                                  <div key={modId} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                                    <span className="truncate text-slate-700">{mod?.title || modId}</span>
                                    <span className={`font-mono-math font-bold ml-2 ${pct >= 60 ? 'text-emerald-700' : 'text-amber-700'}`}>
                                      {pct}%
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {(child.badges || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                            {child.badges.map((bId) => {
                              const b = BADGES.find((x) => x.id === bId);
                              return (
                                <span key={bId} className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded text-[11px] font-semibold">
                                  {b?.name || bId}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassroomPortal;
