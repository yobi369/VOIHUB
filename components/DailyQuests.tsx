import React from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import { DAILY_QUESTS } from '../constants';
import { useUserProfile } from '../hooks/useUserProfile';

const DailyQuests: React.FC = () => {
  const { profile } = useUserProfile();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900">Daily Academic Objectives</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono-math">{profile.streak}-day study streak</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profile.activeQuests.map((questProgress) => {
          const questDef = DAILY_QUESTS.find((q) => q.id === questProgress.questId);
          if (!questDef) return null;
          const pct = Math.min((questProgress.currentValue / questDef.target) * 100, 100);

          return (
            <div key={questDef.id} className="border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-slate-800 leading-snug">{questDef.description}</p>
                {questProgress.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="text-xs font-mono-math font-semibold text-blue-700 shrink-0">+{questDef.reward} LP</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] font-mono-math text-slate-500">
                  {questProgress.currentValue}/{questDef.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyQuests;
