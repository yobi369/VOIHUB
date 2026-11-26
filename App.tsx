import React, { useEffect, useState } from 'react';
import { getSubjectByName } from './data/curriculum';
import { useUserProfile } from './hooks/useUserProfile';
import { AppView, type CurriculumModule, type SandboxTabKind, type SubjectMeta } from './types';
import BadgesDisplay from './components/BadgesDisplay';
import CapstonesAndCertificates from './components/CapstonesAndCertificates';
import ClassroomPortal from './components/ClassroomPortal';
import CurriculumSearchModal from './components/CurriculumSearchModal';
import ExplorerProfile from './components/ExplorerProfile';
import ExplorerShop from './components/ExplorerShop';
import GradeSelector from './components/GradeSelector';
import Header from './components/Header';
import KnowledgeVaultModal from './components/KnowledgeVaultModal';
import LearningModule from './components/LearningModule';
import LevelUpModal from './components/LevelUpModal';
import SimulationsLab from './components/SimulationsLab';
import SubjectDashboard from './components/SubjectDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AtlasHome);
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [selectedSubject, setSelectedSubject] = useState<SubjectMeta | null>(null);
  const [selectedModule, setSelectedModule] = useState<CurriculumModule | null>(null);
  const [initialLabTab, setInitialLabTab] = useState<SandboxTabKind>('ai-perceptron');

  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);

  const { profile, justLeveledUp, clearLevelUpFlag, setPreferredGrade } = useUserProfile();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setPreferredGrade(grade);
    setSelectedSubject(null);
    setSelectedModule(null);
    setCurrentView(AppView.GradeCurriculum);
  };

  const handleSelectSubject = (subject: SubjectMeta, initialModule?: CurriculumModule) => {
    setSelectedSubject(subject);
    setSelectedModule(initialModule || null);
    setCurrentView(AppView.LessonWorkspace);
  };

  const handleOpenModuleDirect = (mod: CurriculumModule) => {
    const sub = getSubjectByName(mod.subjectName) || getSubjectByName(mod.subjectId);
    if (!sub) return;
    setSelectedGrade(mod.grade);
    setPreferredGrade(mod.grade);
    setSelectedSubject(sub);
    setSelectedModule(mod);
    setCurrentView(AppView.LessonWorkspace);
  };

  const handleOpenSimTab = (tab: SandboxTabKind = 'ai-perceptron') => {
    setInitialLabTab(tab);
    setCurrentView(AppView.SimulationsSuite);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        currentView={currentView}
        onNavigateAtlas={() => setCurrentView(AppView.AtlasHome)}
        onNavigateSimulations={() => handleOpenSimTab('ai-perceptron')}
        onNavigateCapstones={() => setCurrentView(AppView.CapstonesSuite)}
        onNavigateClassroom={() => setCurrentView(AppView.ClassroomSuite)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
      />

      <main className="flex-1 w-full">
        {currentView === AppView.AtlasHome && (
          <GradeSelector
            onSelectGrade={handleSelectGrade}
            onSelectModule={handleOpenModuleDirect}
            onOpenSimulations={() => handleOpenSimTab('ai-perceptron')}
            onOpenSimTab={handleOpenSimTab}
            onOpenCapstones={() => setCurrentView(AppView.CapstonesSuite)}
            onOpenClassroom={() => setCurrentView(AppView.ClassroomSuite)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentView === AppView.GradeCurriculum && (
          <SubjectDashboard
            grade={selectedGrade}
            onSelectSubject={handleSelectSubject}
            onBack={() => setCurrentView(AppView.AtlasHome)}
          />
        )}

        {currentView === AppView.LessonWorkspace && selectedSubject && (
          <LearningModule
            grade={selectedGrade}
            subject={selectedSubject}
            initialModule={selectedModule}
            onBack={() => setCurrentView(AppView.GradeCurriculum)}
          />
        )}

        {currentView === AppView.SimulationsSuite && (
          <div className="max-w-[1440px] mx-auto px-6 py-8">
            <SimulationsLab initialSim={initialLabTab} />
          </div>
        )}

        {currentView === AppView.CapstonesSuite && <CapstonesAndCertificates />}

        {currentView === AppView.ClassroomSuite && (
          <ClassroomPortal onOpenModule={handleOpenModuleDirect} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12 print:hidden">
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} TECH HUB. Classes 1–9 AI, Networking &amp; Cybersecurity Academy for Kids.</p>
          <div className="flex flex-wrap items-center gap-5">
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-slate-900">
              Search 864 Modules
            </button>
            <button onClick={() => handleOpenSimTab('sandbox-net-cli')} className="hover:text-slate-900">
              CLI &amp; CTF Sandbox
            </button>
            <button onClick={() => setCurrentView(AppView.CapstonesSuite)} className="hover:text-slate-900">
              Capstones &amp; Certificates
            </button>
            <button onClick={() => setCurrentView(AppView.ClassroomSuite)} className="hover:text-slate-900">
              Classroom Mode
            </button>
            <button onClick={() => setIsVaultOpen(true)} className="hover:text-slate-900">
              Offline Knowledge Vault
            </button>
          </div>
        </div>
      </footer>

      {isVaultOpen && (
        <KnowledgeVaultModal
          onClose={() => setIsVaultOpen(false)}
          onOpenModule={handleOpenModuleDirect}
        />
      )}
      {isSearchOpen && (
        <CurriculumSearchModal
          onClose={() => setIsSearchOpen(false)}
          onSelectModule={handleOpenModuleDirect}
        />
      )}
      {isProfileOpen && (
        <ExplorerProfile
          onClose={() => setIsProfileOpen(false)}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenBadges={() => setIsBadgesOpen(true)}
          onOpenClassroom={() => setCurrentView(AppView.ClassroomSuite)}
        />
      )}
      {isShopOpen && <ExplorerShop onClose={() => setIsShopOpen(false)} />}
      {isBadgesOpen && <BadgesDisplay onClose={() => setIsBadgesOpen(false)} />}
      {justLeveledUp && <LevelUpModal newLevel={profile.level} onClose={clearLevelUpFlag} />}
    </div>
  );
};

export default App;