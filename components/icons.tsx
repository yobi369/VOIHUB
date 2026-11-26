import React from 'react';

export const MathIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0 0H5m4 0h6m-3 8v4m0 0v-4m0 0h-2m2 0h2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15h14" />
  </svg>
);

export const ScienceIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.25c0 .414-.336.75-.75.75s-.75-.336-.75-.75S13.164 9.5 13.5 9.5s.75.336.75.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-4.08 2.72-7.52 6.43-8.64a.5.5 0 01.57.43c.09.4-.2.77-.6.82A7.99 7.99 0 004 12a8 8 0 0013.66 4.97c.4-.1.78.2.82.6a.5.5 0 01-.43.57A8.96 8.96 0 0112 21z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 12.5a1 1 0 100-2 1 1 0 000 2zM19 17a1 1 0 100-2 1 1 0 000 2zM19.5 7.5a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

export const LanguageIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 13l4-12M5 15h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

export const HistoryIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945" />
    </svg>
);

export const GeographyIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 21a9 9 0 110-18 9 9 0 010 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 00-4.007-7.618M12 21a9 9 0 014.007-7.618" />
  </svg>
);

export const BackArrowIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const CheckmarkIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const SparklesIcon = ({ className = "w-5 h-5"}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 2a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM9 9a1 1 0 011-1h1v1a1 1 0 11-2 0V9z" clipRule="evenodd" />
        <path d="M2 11a1 1 0 011-1h1v1a1 1 0 11-2 0V11zM11 11a1 1 0 011-1h1v1a1 1 0 11-2 0V11zM5 15a1 1 0 011-1h1v1a1 1 0 11-2 0V15zM11 15a1 1 0 011-1h1v1a1 1 0 11-2 0V15z" />
    </svg>
);

export const LP_Icon = ({ className = "w-5 h-5"}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
    </svg>
);

export const BadgeIcon = ({ className = "w-6 h-6"}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a.75.75 0 01.688.45l1.825 3.7.1.2.224.033 4.08.593a.75.75 0 01.416 1.28l-2.952 2.878-.16.156.038.222.697 4.063a.75.75 0 01-1.088.791l-3.646-1.916-.2-.105-.2.105-3.646 1.916a.75.75 0 01-1.088-.79l.697-4.064.038-.222-.16-.155L2.24 8.056a.75.75 0 01.416-1.28l4.08-.593.224-.033.1-.2L8.812 2.45A.75.75 0 0110 2zM8.47 8.24a.75.75 0 00-1.06 1.06L9.378 11.5l-1.97 1.969a.75.75 0 101.06 1.06L10.44 12.56l1.969 1.97a.75.75 0 101.06-1.06L11.5 11.5l1.97-1.97a.75.75 0 10-1.06-1.06L10.44 10.44l-1.97-1.97z" clipRule="evenodd" />
    </svg>
);

export const ShopIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const QuestIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
