import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className={`${SIZE_CLASSES[size]} border-slate-200 border-t-blue-700 rounded-full animate-spin`} />
      {label && <p className="text-xs font-medium text-slate-600">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
