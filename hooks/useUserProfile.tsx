import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { AccountType, ClassroomRecord, QuestProgress, UserProfile } from '../types';
import {
  BADGES,
  DAILY_QUESTS,
  LEVEL_UP_BASE_LP,
  LEVEL_UP_MULTIPLIER,
  LP_PER_FLASHCARD_MASTERED,
  LP_PER_QUIZ_CORRECT,
  LP_PER_TOPIC_COMPLETE,
} from '../constants';
import { ALL_MODULES, findModuleById, getModulesForGradeSubject } from '../data/curriculum';
import { playLevelUpSound, setAudioMuted } from '../services/audioService';
import {
  auth,
  fetchJoinedClassrooms,
  loadUserProfileFromCloud,
  signInWithGoogle as firebaseSignInWithGoogle,
  secureCode,
  signOutUser as firebaseSignOutUser,
  syncParentLinkSnapshot,
  syncStudentMemberSnapshot,
  syncUserProfileToCloud,
} from '../services/firebase';

const PROFILE_KEY = 'voiHubUserProfile_v2';

const generateInviteCode = () => `KID-${secureCode(6)}`;

const getInitialProfile = (): UserProfile => {
  const today = new Date().toISOString().split('T')[0];
  return {
    name: 'Scholar',
    lp: 0,
    level: 1,
    lastLogin: today,
    streak: 1,
    questsLastGenerated: '1970-01-01',
    activeQuests: [],
    unlockedAvatarItems: [],
    equippedAvatarItems: {},
    badges: [],
    progress: {},
    audioEnabled: true,
    accountType: 'student',
    preferredGrade: 3,
    completedCapstones: [],
    solvedCtfFlags: [],
    joinedClassIds: [],
    parentInviteCode: generateInviteCode(),
    examScores: {},
  };
};

export const calculateLpForNextLevel = (level: number) => {
  return Math.floor(LEVEL_UP_BASE_LP * Math.pow(LEVEL_UP_MULTIPLIER, level - 1));
};

const calculateNewLpAndLevel = (profile: UserProfile, amount: number) => {
  const newLp = profile.lp + amount;
  let newLevel = profile.level;
  let lpForNextLevel = calculateLpForNextLevel(newLevel);
  let leveledUp = false;
  while (newLp >= lpForNextLevel) {
    newLevel++;
    lpForNextLevel = calculateLpForNextLevel(newLevel);
    leveledUp = true;
  }
  return { newLp, newLevel, leveledUp };
};

export function extractCompletedModuleIds(profile: UserProfile): string[] {
  const ids: string[] = [];
  for (const mod of ALL_MODULES) {
    const doneList = profile.progress?.[mod.grade]?.[mod.subjectName]?.completedTopics || [];
    if (doneList.includes(mod.title)) {
      ids.push(mod.id);
    }
  }
  return ids;
}

interface UserProfileContextValue {
  profile: UserProfile;
  lpForNextLevel: number;
  justLeveledUp: boolean;
  clearLevelUpFlag: () => void;
  completeTopic: (grade: number, subjectName: string, topicIdOrTitle: string) => void;
  recordCorrectQuizAnswer: () => void;
  recordFlashcardMastered: () => void;
  recordCapstoneComplete: (capstoneId: string, lpReward?: number) => void;
  recordCtfSolved: (flagId: string, lpReward?: number) => void;
  recordModuleExamScore: (moduleId: string, percentage: number) => void;
  purchaseItem: (itemId: string, cost: number) => void;
  equipItem: (itemId: string, type: 'hat' | 'glasses') => void;
  updateName: (newName: string) => void;
  toggleAudio: () => void;
  setAccountType: (role: AccountType) => void;
  setPreferredGrade: (grade: number) => void;
  addJoinedClassroom: (classId: string) => void;
  removeJoinedClassroom: (classId: string) => void;
  authUser: User | null;
  isAuthReady: boolean;
  isCloudSyncing: boolean;
  cloudError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  joinedClassrooms: ClassroomRecord[];
  refreshJoinedClassrooms: () => Promise<void>;
  assignedModuleIds: string[];
  lockedExamModuleIds: string[];
  examRetakesAllowed: boolean;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...getInitialProfile(),
          ...parsed,
          parentInviteCode: parsed.parentInviteCode || generateInviteCode(),
        };
      }
      return getInitialProfile();
    } catch {
      return getInitialProfile();
    }
  });

  const [justLeveledUp, setJustLeveledUp] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [joinedClassrooms, setJoinedClassrooms] = useState<ClassroomRecord[]>([]);
  const syncTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setAudioMuted(!profile.audioEnabled);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Could not persist user profile:', error);
    }
  }, [profile]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setProfile((current) => {
      let changed = false;
      let next = { ...current };

      const todayDate = new Date(today);
      const lastLoginDate = new Date(next.lastLogin);
      const diffDays = Math.round((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        next = { ...next, streak: next.streak + 1, lastLogin: today };
        changed = true;
      } else if (diffDays > 1) {
        next = { ...next, streak: 1, lastLogin: today };
        changed = true;
      }

      const hasInvalidQuests = next.activeQuests.some(
        (pq) => !DAILY_QUESTS.some((q) => q.id === pq.questId)
      );

      if (next.questsLastGenerated !== today || next.activeQuests.length === 0 || hasInvalidQuests) {
        const shuffled = [...DAILY_QUESTS].sort(() => 0.5 - Math.random());
        const newQuests: QuestProgress[] = shuffled.slice(0, 3).map((q) => ({
          questId: q.id,
          currentValue: 0,
          completed: false,
        }));
        next = { ...next, activeQuests: newQuests, questsLastGenerated: today };
        changed = true;
      }

      return changed ? next : current;
    });
  }, []);

  const refreshJoinedClassroomsList = useCallback(async (classIds: string[], user: User | null) => {
    if (!user || classIds.length === 0) {
      setJoinedClassrooms([]);
      return;
    }
    try {
      const classes = await fetchJoinedClassrooms(classIds);
      setJoinedClassrooms(classes);
    } catch (err) {
      console.warn('Could not refresh joined classrooms:', err);
    }
  }, []);

  // Listen for Firebase Auth state & merge cloud profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setIsAuthReady(true);
      if (!user) {
        setJoinedClassrooms([]);
        return;
      }

      setIsCloudSyncing(true);
      setCloudError(null);
      try {
        const cloud = await loadUserProfileFromCloud(user.uid);
        if (cloud) {
          setProfile((current) => {
            const mergedProgress = JSON.parse(JSON.stringify(current.progress || {}));
            for (const modId of cloud.completedModuleIds || []) {
              const mod = findModuleById(modId);
              if (!mod) continue;
              if (!mergedProgress[mod.grade]) mergedProgress[mod.grade] = {};
              if (!mergedProgress[mod.grade][mod.subjectName]) {
                mergedProgress[mod.grade][mod.subjectName] = { completedTopics: [] };
              }
              if (!mergedProgress[mod.grade][mod.subjectName].completedTopics.includes(mod.title)) {
                mergedProgress[mod.grade][mod.subjectName].completedTopics.push(mod.title);
              }
            }

            const mergedBadges = Array.from(new Set([...(current.badges || []), ...(cloud.badges || [])]));
            const mergedCapstones = Array.from(
              new Set([...(current.completedCapstones || []), ...(cloud.completedCapstones || [])])
            );
            const mergedCtf = Array.from(
              new Set([...(current.solvedCtfFlags || []), ...(cloud.solvedCtfFlags || [])])
            );
            const mergedClasses = Array.from(
              new Set([...(current.joinedClassIds || []), ...(cloud.joinedClassIds || [])])
            );
            const mergedItems = Array.from(
              new Set([...(current.unlockedAvatarItems || []), ...(cloud.unlockedAvatarItems || [])])
            );

            const useCloudLp = (cloud.lp || 0) >= current.lp;
            return {
              ...current,
              name: current.name === 'Scholar' && cloud.name ? cloud.name : current.name,
              accountType: cloud.accountType || current.accountType || 'student',
              preferredGrade: cloud.preferredGrade || current.preferredGrade || 3,
              lp: useCloudLp ? cloud.lp : current.lp,
              level: useCloudLp ? cloud.level : current.level,
              streak: Math.max(current.streak, cloud.streak || 1),
              badges: mergedBadges,
              unlockedAvatarItems: mergedItems,
              equippedAvatarItems:
                Object.keys(current.equippedAvatarItems || {}).length > 0
                  ? current.equippedAvatarItems
                  : cloud.equippedAvatarItems || {},
              completedCapstones: mergedCapstones,
              solvedCtfFlags: mergedCtf,
              joinedClassIds: mergedClasses,
              parentInviteCode: cloud.parentInviteCode || current.parentInviteCode || `KID-${user.uid.slice(0, 6).toUpperCase()}`,
              progress: mergedProgress,
            };
          });

          if ((cloud.joinedClassIds || []).length > 0) {
            await refreshJoinedClassroomsList(cloud.joinedClassIds, user);
          }
        }
      } catch (err: any) {
        setCloudError(err?.message || 'Unable to sync profile from cloud.');
      } finally {
        setIsCloudSyncing(false);
      }
    });

    return () => unsubscribe();
  }, [refreshJoinedClassroomsList]);

  // Debounced cloud sync whenever profile changes while authenticated
  useEffect(() => {
    if (!authUser || !authUser.emailVerified) return;
    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = window.setTimeout(async () => {
      try {
        const completedIds = extractCompletedModuleIds(profile);
        await syncUserProfileToCloud(authUser, profile, completedIds);
        if ((profile.joinedClassIds || []).length > 0) {
          await syncStudentMemberSnapshot(profile.joinedClassIds || [], authUser.uid, profile, completedIds);
        }
        if (profile.parentInviteCode && (profile.accountType || 'student') === 'student') {
          await syncParentLinkSnapshot(profile.parentInviteCode, authUser.uid, profile, completedIds);
        }
      } catch (err: any) {
        console.warn('Cloud background sync skipped:', err?.message || err);
      }
    }, 1200);

    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
    };
  }, [authUser, profile]);

  const clearLevelUpFlag = useCallback(() => setJustLeveledUp(false), []);

  const completeTopic = useCallback((grade: number, subjectName: string, topicKey: string) => {
    let leveledUpHappened = false;
    setProfile((current) => {
      const existingCompleted = current.progress[grade]?.[subjectName]?.completedTopics || [];
      if (existingCompleted.includes(topicKey)) {
        return current;
      }

      const next: UserProfile = JSON.parse(JSON.stringify(current));
      let totalLpGained = LP_PER_TOPIC_COMPLETE;

      next.activeQuests = next.activeQuests.map((pq) => {
        if (pq.completed) return pq;
        const questDef = DAILY_QUESTS.find((q) => q.id === pq.questId);
        if (!questDef || questDef.type !== 'completeTopics' || (questDef.subject && questDef.subject !== subjectName)) {
          return pq;
        }
        const updated = { ...pq, currentValue: pq.currentValue + 1 };
        if (updated.currentValue >= questDef.target) {
          updated.completed = true;
          totalLpGained += questDef.reward;
        }
        return updated;
      });

      if (!next.progress[grade]) next.progress[grade] = {};
      if (!next.progress[grade][subjectName]) next.progress[grade][subjectName] = { completedTopics: [] };
      next.progress[grade][subjectName].completedTopics.push(topicKey);

      const totalModules = getModulesForGradeSubject(grade, subjectName).length;
      const completedCount = next.progress[grade][subjectName].completedTopics.length;
      if (totalModules > 0 && completedCount >= totalModules) {
        const badgeDef = BADGES.find((b) => b.grade === grade && b.subject === subjectName);
        if (badgeDef && !next.badges.includes(badgeDef.id)) {
          next.badges.push(badgeDef.id);
        }
      }

      const { newLp, newLevel, leveledUp } = calculateNewLpAndLevel(next, totalLpGained);
      leveledUpHappened = leveledUp;
      next.lp = newLp;
      next.level = newLevel;
      return next;
    });

    if (leveledUpHappened) {
      setJustLeveledUp(true);
      playLevelUpSound();
    }
  }, []);

  const recordCorrectQuizAnswer = useCallback(() => {
    let leveledUpHappened = false;
    setProfile((current) => {
      const next: UserProfile = JSON.parse(JSON.stringify(current));
      let totalLpGained = LP_PER_QUIZ_CORRECT;

      next.activeQuests = next.activeQuests.map((pq) => {
        if (pq.completed) return pq;
        const questDef = DAILY_QUESTS.find((q) => q.id === pq.questId);
        if (!questDef || questDef.type !== 'correctQuizzes') return pq;
        const updated = { ...pq, currentValue: pq.currentValue + 1 };
        if (updated.currentValue >= questDef.target) {
          updated.completed = true;
          totalLpGained += questDef.reward;
        }
        return updated;
      });

      const { newLp, newLevel, leveledUp } = calculateNewLpAndLevel(next, totalLpGained);
      leveledUpHappened = leveledUp;
      next.lp = newLp;
      next.level = newLevel;
      return next;
    });

    if (leveledUpHappened) {
      setJustLeveledUp(true);
      playLevelUpSound();
    }
  }, []);

  const recordFlashcardMastered = useCallback(() => {
    let leveledUpHappened = false;
    setProfile((current) => {
      const { newLp, newLevel, leveledUp } = calculateNewLpAndLevel(current, LP_PER_FLASHCARD_MASTERED);
      leveledUpHappened = leveledUp;
      return { ...current, lp: newLp, level: newLevel };
    });
    if (leveledUpHappened) {
      setJustLeveledUp(true);
      playLevelUpSound();
    }
  }, []);

  const recordCapstoneComplete = useCallback((capstoneId: string, lpReward = 120) => {
    let leveledUpHappened = false;
    setProfile((current) => {
      const existing = current.completedCapstones || [];
      if (existing.includes(capstoneId)) return current;
      const { newLp, newLevel, leveledUp } = calculateNewLpAndLevel(current, lpReward);
      leveledUpHappened = leveledUp;
      return {
        ...current,
        lp: newLp,
        level: newLevel,
        completedCapstones: [...existing, capstoneId],
      };
    });
    if (leveledUpHappened) {
      setJustLeveledUp(true);
      playLevelUpSound();
    }
  }, []);

  const recordCtfSolved = useCallback((flagId: string, lpReward = 45) => {
    let leveledUpHappened = false;
    setProfile((current) => {
      const existing = current.solvedCtfFlags || [];
      if (existing.includes(flagId)) return current;
      const { newLp, newLevel, leveledUp } = calculateNewLpAndLevel(current, lpReward);
      leveledUpHappened = leveledUp;
      return {
        ...current,
        lp: newLp,
        level: newLevel,
        solvedCtfFlags: [...existing, flagId],
      };
    });
    if (leveledUpHappened) {
      setJustLeveledUp(true);
      playLevelUpSound();
    }
  }, []);

  const recordModuleExamScore = useCallback((moduleId: string, percentage: number) => {
    setProfile((current) => {
      const prevScores = current.examScores || {};
      const best = Math.max(prevScores[moduleId] || 0, Math.round(percentage));
      return {
        ...current,
        examScores: {
          ...prevScores,
          [moduleId]: best,
        },
      };
    });
  }, []);

  const purchaseItem = useCallback((itemId: string, cost: number) => {
    setProfile((current) => {
      if (current.lp < cost || current.unlockedAvatarItems.includes(itemId)) return current;
      return {
        ...current,
        lp: current.lp - cost,
        unlockedAvatarItems: [...current.unlockedAvatarItems, itemId],
      };
    });
  }, []);

  const equipItem = useCallback((itemId: string, type: 'hat' | 'glasses') => {
    setProfile((current) => {
      if (!current.unlockedAvatarItems.includes(itemId)) return current;
      return {
        ...current,
        equippedAvatarItems: {
          ...current.equippedAvatarItems,
          [type]: current.equippedAvatarItems[type] === itemId ? undefined : itemId,
        },
      };
    });
  }, []);

  const updateName = useCallback((newName: string) => {
    const trimmed = newName.trim();
    if (trimmed.length > 0) {
      setProfile((p) => ({ ...p, name: trimmed.slice(0, 28) }));
    }
  }, []);

  const toggleAudio = useCallback(() => {
    setProfile((p) => ({ ...p, audioEnabled: !p.audioEnabled }));
  }, []);

  const setAccountType = useCallback((role: AccountType) => {
    setProfile((p) => ({ ...p, accountType: role }));
  }, []);

  const setPreferredGrade = useCallback((grade: number) => {
    setProfile((p) => ({ ...p, preferredGrade: Math.min(9, Math.max(1, grade)) }));
  }, []);

  const addJoinedClassroom = useCallback((classId: string) => {
    setProfile((p) => {
      const current = p.joinedClassIds || [];
      if (current.includes(classId)) return p;
      return { ...p, joinedClassIds: [...current, classId] };
    });
  }, []);

  const removeJoinedClassroom = useCallback((classId: string) => {
    setProfile((p) => ({
      ...p,
      joinedClassIds: (p.joinedClassIds || []).filter((id) => id !== classId),
    }));
    setJoinedClassrooms((prev) => prev.filter((c) => c.id !== classId));
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setCloudError(null);
    try {
      await firebaseSignInWithGoogle();
    } catch (err: any) {
      setCloudError(err?.message || 'Google sign-in cancelled or failed.');
      throw err;
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await firebaseSignOutUser();
    setJoinedClassrooms([]);
  }, []);

  const refreshJoinedClassrooms = useCallback(async () => {
    await refreshJoinedClassroomsList(profile.joinedClassIds || [], authUser);
  }, [profile.joinedClassIds, authUser, refreshJoinedClassroomsList]);

  const assignedModuleIds = useMemo(
    () => Array.from(new Set(joinedClassrooms.flatMap((c) => c.assignedModuleIds || []))),
    [joinedClassrooms]
  );

  const lockedExamModuleIds = useMemo(
    () => Array.from(new Set(joinedClassrooms.flatMap((c) => c.lockedExamModuleIds || []))),
    [joinedClassrooms]
  );

  const examRetakesAllowed = useMemo(() => {
    if (joinedClassrooms.length === 0) return true;
    return joinedClassrooms.every((c) => c.allowRetakes !== false);
  }, [joinedClassrooms]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        lpForNextLevel: calculateLpForNextLevel(profile.level),
        justLeveledUp,
        clearLevelUpFlag,
        completeTopic,
        recordCorrectQuizAnswer,
        recordFlashcardMastered,
        recordCapstoneComplete,
        recordCtfSolved,
        recordModuleExamScore,
        purchaseItem,
        equipItem,
        updateName,
        toggleAudio,
        setAccountType,
        setPreferredGrade,
        addJoinedClassroom,
        removeJoinedClassroom,
        authUser,
        isAuthReady,
        isCloudSyncing,
        cloudError,
        signInWithGoogle,
        signOutUser,
        joinedClassrooms,
        refreshJoinedClassrooms,
        assignedModuleIds,
        lockedExamModuleIds,
        examRetakesAllowed,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used inside UserProfileProvider');
  }
  return ctx;
};
