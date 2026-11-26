import React, { useState } from 'react';
import { Award, X } from 'lucide-react';
import { BADGES } from '../constants';
import { useUserProfile } from '../hooks/useUserProfile';

interface BadgesDisplayProps {
  onClose: () => void;
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ onClose }) => {
  const { profile } = useUserProfile();
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');

  const visibleBadges = gradeFilter === 'all' ? BADGES : BADGES.filter((b) => b.grade === gradeFilter);

  return (
    <div
      className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[84vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-blue-700" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">TECH HUB Specialist Badges</h2>
              <p className="text-xs text-slate-500">
                Earned {profile.badges.length} of {BADGES.length} Class AI, Networking &amp; Cybersecurity distinctions
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Achievements" className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-slate-100 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setGradeFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${gradeFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/70'}`}
          >
            All Classes
          </button>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${gradeFilter === g ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/70'}`}
            >
              Class {g}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visibleBadges.map((badge) => {
            const isEarned = profile.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`border rounded-lg p-4 flex flex-col justify-between gap-2 ${
                  isEarned ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-white opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-math text-slate-500">Class {badge.grade}</span>
                  <span className={`font-semibold ${isEarned ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isEarned ? 'Awarded' : 'Locked'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{badge.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BadgesDisplay;
