import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SUBJECT_METAS } from '../constants';
import { getModulesForGradeSubject, getUnitsForGradeSubject } from '../data/curriculum';
import { useUserProfile } from '../hooks/useUserProfile';
import type { CurriculumModule, SubjectMeta } from '../types';
import DailyQuests from './DailyQuests';

interface SubjectDashboardProps {
  grade: number;
  onSelectSubject: (subject: SubjectMeta, initialModule?: CurriculumModule) => void;
  onBack: () => void;
}

const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ grade, onSelectSubject, onBack }) => {
  const { profile } = useUserProfile();
  const gradeProgress = profile.progress[grade] || {};

  const totalGradeModules = SUBJECT_METAS.reduce(
    (sum, s) => sum + getModulesForGradeSubject(grade, s.name).length,
    0
  );
  const completedGradeModules = SUBJECT_METAS.reduce(
    (sum, s) => sum + (gradeProgress[s.name]?.completedTopics?.length || 0),
    0
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Classes (1–9)
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Class {grade} Tech Hub</h1>
          <p className="text-sm text-slate-600">
            3 core tracks · 24 structured units · {totalGradeModules} AI, Networking &amp; Cybersecurity modules
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-6">
          <div>
            <div className="text-xs text-slate-500">Class {grade} Mastery</div>
            <div className="text-xl font-bold font-mono-math text-slate-900">
              {completedGradeModules} / {totalGradeModules}
            </div>
          </div>
          <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 transition-all duration-300"
              style={{ width: `${totalGradeModules > 0 ? (completedGradeModules / totalGradeModules) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <DailyQuests />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SUBJECT_METAS.map((subject) => {
          const units = getUnitsForGradeSubject(grade, subject.name);
          const modules = units.flatMap((u) => u.modules);
          const completedCount = gradeProgress[subject.name]?.completedTopics?.length || 0;
          const pct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

          return (
            <div
              key={subject.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5 hover:border-blue-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono-math">{units.length} Units · {modules.length} Modules</span>
                  {pct === 100 && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{subject.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{subject.tagline}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {units.map((u) => (
                    <button
                      key={u.unitNumber}
                      onClick={() => onSelectSubject(subject, u.modules[0])}
                      className="w-full text-left text-xs text-slate-700 hover:text-blue-700 truncate block py-1"
                    >
                      0{u.unitNumber}. {u.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Track Progress</span>
                  <span className="font-mono-math font-semibold text-slate-900">{completedCount}/{modules.length} ({pct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
                <button
                  onClick={() => onSelectSubject(subject)}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>Open {subject.shortName} Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectDashboard;