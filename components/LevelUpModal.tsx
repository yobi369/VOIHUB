import React from 'react';
import { Award } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-sm p-8 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-semibold text-blue-700">Academic Advancement</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Level {newLevel} Reached</h2>
          <p className="text-sm text-slate-600 mt-2">
            Your cumulative monograph synthesis, spaced recall, and mastery assessments unlocked a higher fellowship tier.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          Continue Studying
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;