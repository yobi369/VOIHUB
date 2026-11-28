import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigateAtlas: () => void;
  onNavigateSimulations: () => void;
  onNavigateCapstones: () => void;
  onNavigateClassroom: () => void;
  onOpenVault: () => void;
  onOpenBadges: () => void;
  onOpenSearch: () => void;
  onOpenProfileModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateAtlas,
  onNavigateSimulations,
  onNavigateCapstones,
  onNavigateClassroom,
  onOpenVault,
  onOpenBadges,
  onOpenSearch,
  onOpenProfileModal,
}) => {
  const { profile, authUser } = useUserProfile();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 print:hidden">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-line Wordmark */}
        <button
          onClick={onNavigateAtlas}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors"
        >
          VOI HUB
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={onNavigateAtlas}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
              currentView === AppView.AtlasHome || currentView === AppView.GradeCurriculum
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-700'
                : ''
            }`}
          >
            Classes 1–9
          </button>
          <button
            onClick={onNavigateSimulations}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
              currentView === AppView.SimulationsSuite
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-700'
                : ''
            }`}
          >
            Labs &amp; CLI/CTF
          </button>
          <button
            onClick={onNavigateCapstones}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
              currentView === AppView.CapstonesSuite
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-700'
                : ''
            }`}
          >
            Capstones &amp; Certs
          </button>
          <button
            onClick={onNavigateClassroom}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
              currentView === AppView.ClassroomSuite
                ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-700'
                : ''
            }`}
          >
            Classroom Mode
          </button>
          <button
            onClick={onOpenVault}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900"
          >
            Vault
          </button>
          <button
            onClick={onOpenBadges}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900"
          >
            Badges
          </button>
          <button
            onClick={onOpenSearch}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900"
          >
            Search
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            onClick={onOpenProfileModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 tabular-nums"
          >
            {profile.name} · Lv. {profile.level} ({profile.lp} LP){authUser ? ' · Cloud' : ''}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;