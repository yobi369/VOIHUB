export type DifficultyTier = 'Foundational' | 'Intermediate' | 'Honors' | 'Olympiad';

export type SimulationKind =
  | 'ai-perceptron'
  | 'ai-vision'
  | 'net-packets'
  | 'net-binary'
  | 'cyber-crypto'
  | 'cyber-firewall';

export type SandboxTabKind =
  | SimulationKind
  | 'sandbox-ai-lab'
  | 'sandbox-net-cli'
  | 'sandbox-cyber-ctf';

export type AccountType = 'student' | 'teacher' | 'parent';

export interface CurriculumModule {
  id: string;
  grade: number;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  unitTitle: string;
  moduleNumber: number;
  title: string;
  difficulty: DifficultyTier;
  estimatedMinutes: number;
  simType: SimulationKind;
  summary: string;
  keywords: string[];
}

export interface CurriculumUnit {
  unitNumber: number;
  title: string;
  modules: CurriculumModule[];
}

export interface SubjectMeta {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  accentHex: string;
  defaultSim: SimulationKind;
}

export interface CoreConceptSection {
  heading: string;
  definition: string;
  exposition: string;
  formula?: string;
  historicalContext: string;
  realWorldApplication: string;
}

export interface WorkedExample {
  title: string;
  problemStatement: string;
  givenData: string[];
  steps: string[];
  finalAnswer: string;
  keyInsight: string;
}

export interface MisconceptionPair {
  myth: string;
  reality: string;
  diagnosticTip: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  formula?: string;
  hint: string;
}

export interface AssessmentQuestion {
  id: string;
  tier: 'Conceptual' | 'Computational' | 'Applied' | 'Error Analysis' | 'Synthesis';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DeepLessonContent {
  moduleId: string;
  topic: string;
  subtitle: string;
  grade: number;
  subjectName: string;
  estimatedStudyMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
  coreConcepts: CoreConceptSection[];
  workedExamples: WorkedExample[];
  commonMisconceptions: MisconceptionPair[];
  flashcards: FlashcardItem[];
  assessment: AssessmentQuestion[];
  furtherInquiry: string[];
  source: 'reference-compendium' | 'ai-monograph';
  generatedAt: string;
  depthLevel: 'standard' | 'olympiad';
}

export interface FlashcardReviewState {
  cardId: string;
  moduleId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewIso: string;
  lastGrade: 'again' | 'good' | 'mastered';
}

export interface VaultStorageSummary {
  cachedLessonsCount: number;
  totalVaultBytes: number;
  flashcardsReviewedCount: number;
  notesCount: number;
  assessmentsCount: number;
  browserUsageBytes: number | null;
  browserQuotaBytes: number | null;
}

export interface AssessmentAttempt {
  id: string;
  moduleId: string;
  topic: string;
  grade: number;
  subjectName: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export enum AppView {
  AtlasHome = 'atlas-home',
  GradeCurriculum = 'grade-curriculum',
  LessonWorkspace = 'lesson-workspace',
  SimulationsSuite = 'simulations-suite',
  CapstonesSuite = 'capstones-suite',
  ClassroomSuite = 'classroom-suite',
}

export interface ProgressData {
  [grade: number]: {
    [subjectName: string]: {
      completedTopics: string[];
    };
  };
}

export interface Quest {
  id: string;
  description: string;
  type: 'completeTopics' | 'correctQuizzes';
  subject?: string;
  target: number;
  reward: number;
}

export interface QuestProgress {
  questId: string;
  currentValue: number;
  completed: boolean;
}

export interface AvatarItem {
  id: string;
  name: string;
  type: 'hat' | 'glasses';
  cost: number;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade: number;
}

export interface UserProfile {
  name: string;
  lp: number;
  level: number;
  lastLogin: string;
  streak: number;
  questsLastGenerated: string;
  activeQuests: QuestProgress[];
  unlockedAvatarItems: string[];
  equippedAvatarItems: {
    hat?: string;
    glasses?: string;
  };
  badges: string[];
  progress: ProgressData;
  audioEnabled: boolean;
  accountType?: AccountType;
  preferredGrade?: number;
  completedCapstones?: string[];
  solvedCtfFlags?: string[];
  joinedClassIds?: string[];
  parentInviteCode?: string;
  examScores?: Record<string, number>;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  mode?: string;
  timestamp: string;
}

export interface ClassroomRecord {
  id: string;
  teacherUid: string;
  teacherName: string;
  name: string;
  grade: number;
  joinCode: string;
  assignedModuleIds: string[];
  lockedExamModuleIds: string[];
  allowRetakes: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ClassroomMemberRecord {
  studentUid: string;
  classId: string;
  teacherUid: string;
  joinCode: string;
  studentName: string;
  grade: number;
  lp: number;
  level: number;
  streak: number;
  completedModulesCount: number;
  completedModuleIds: string[];
  examScores: Record<string, number>;
  completedCapstones: string[];
  solvedCtfFlags: string[];
  badgesCount: number;
}

export interface ParentLinkRecord {
  linkCode: string;
  studentUid: string;
  parentUid: string;
  studentName: string;
  grade: number;
  lp: number;
  level: number;
  streak: number;
  completedModulesCount: number;
  completedModuleIds: string[];
  examScores: Record<string, number>;
  completedCapstones: string[];
  solvedCtfFlags: string[];
  badges: string[];
}