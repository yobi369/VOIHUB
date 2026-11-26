import React, { useState } from 'react';
import { LogIn, LogOut, Users, Volume2, VolumeX, X } from 'lucide-react';
import { calculateLpForNextLevel, useUserProfile } from '../hooks/useUserProfile';
import type { AccountType } from '../types';
import Avatar from './Avatar';

interface ExplorerProfileProps {
  onClose: () => void;
  onOpenShop: () => void;
  onOpenBadges: () => void;
  onOpenClassroom?: () => void;
}

const ExplorerProfile: React.FC<ExplorerProfileProps> = ({
  onClose,
  onOpenShop,
  onOpenBadges,
  onOpenClassroom,
}) => {
  const {
    profile,
    updateName,
    lpForNextLevel,
    toggleAudio,
    setAccountType,
    authUser,
    isCloudSyncing,
    signInWithGoogle,
    signOutUser,
  } = useUserProfile();
  const [draftName, setDraftName] = useState(profile.name);

  const prevLevelThreshold = profile.level > 1 ? calculateLpForNextLevel(profile.level - 1) : 0;
  const span = Math.max(1, lpForNextLevel - prevLevelThreshold);
  const pct = Math.min(100, Math.max(0, ((profile.lp - prevLevelThreshold) / span) * 100));

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateName(draftName);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Scholar Profile &amp; Cloud Account</h2>
          <button onClick={onClose} aria-label="Close Profile" className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <div className="flex items-center gap-4">
            <Avatar profile={profile} className="w-20 h-20 shrink-0" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="text-xs font-mono-math text-blue-700 font-semibold">
                Level {profile.level} · {profile.lp} LP · {profile.streak}-day streak
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-700 transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[11px] font-mono-math text-slate-500">
                Next level at {lpForNextLevel} LP
              </div>
            </div>
          </div>

          {/* Cloud Auth Card */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Google Cloud Sync</span>
              {authUser && (
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {isCloudSyncing ? 'Syncing...' : 'Connected'}
                </span>
              )}
            </div>
            {authUser ? (
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-slate-600">{authUser.email}</span>
                <button
                  onClick={signOutUser}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded bg-white hover:bg-slate-100 text-slate-700 shrink-0"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle().catch(() => {})}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In with Google
              </button>
            )}

            <div className="flex items-center gap-1 pt-1">
              {(['student', 'teacher', 'parent'] as AccountType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setAccountType(r)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded capitalize border ${
                    (profile.accountType || 'student') === r
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveName} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Scholar Display Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between py-3 border-y border-slate-200">
            <div>
              <div className="text-xs font-semibold text-slate-900">Harmonic Audio Feedback</div>
              <div className="text-[11px] text-slate-500">Synthesized tones on quiz mastery and level up</div>
            </div>
            <button
              onClick={toggleAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              {profile.audioEnabled ? <Volume2 className="w-4 h-4 text-blue-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{profile.audioEnabled ? 'Enabled' : 'Muted'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="py-2.5 px-4 text-xs font-semibold rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50"
            >
              Regalia Shop
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenBadges();
              }}
              className="py-2.5 px-4 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
            >
              Fellowships ({profile.badges.length})
            </button>
          </div>

          {onOpenClassroom && (
            <button
              onClick={() => {
                onClose();
                onOpenClassroom();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" /> Open Classroom &amp; Family Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorerProfile;