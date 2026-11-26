import React from 'react';
import type { UserProfile } from '../types';

interface AvatarProps {
  profile: UserProfile;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ profile, className = 'w-16 h-16' }) => {
  const hat = profile.equippedAvatarItems.hat;
  const glasses = profile.equippedAvatarItems.glasses;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Scholar Emblem Frame */}
        <circle cx="60" cy="60" r="54" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        {/* Head */}
        <circle cx="60" cy="54" r="22" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
        {/* Shoulders */}
        <path d="M26 102 C28 82, 92 82, 94 102" fill="#1E293B" />
        {/* Eyes */}
        <circle cx="52" cy="52" r="3" fill="#0F172A" />
        <circle cx="68" cy="52" r="3" fill="#0F172A" />

        {/* Equipped Glasses */}
        {glasses === 'astrolabe_visor' && (
          <g stroke="#B45309" strokeWidth="2.5" fill="none">
            <circle cx="68" cy="52" r="8" />
            <line x1="76" y1="52" x2="84" y2="56" />
          </g>
        )}
        {glasses === 'spectro_lenses' && (
          <g stroke="#1D4ED8" strokeWidth="2.5" fill="rgba(29, 78, 216, 0.12)">
            <rect x="43" y="45" width="16" height="12" rx="3" />
            <rect x="62" y="45" width="16" height="12" rx="3" />
            <line x1="59" y1="51" x2="62" y2="51" />
          </g>
        )}

        {/* Equipped Hats */}
        {hat === 'scholar_cap' && (
          <g>
            <polygon points="60,18 92,28 60,38 28,28" fill="#0F172A" />
            <rect x="46" y="34" width="28" height="8" fill="#1E293B" />
            <line x1="88" y1="29" x2="88" y2="46" stroke="#D97706" strokeWidth="2" />
          </g>
        )}
        {hat === 'laurel_crown' && (
          <g stroke="#059669" strokeWidth="3" fill="none">
            <path d="M36 42 C34 26, 48 20, 60 22" />
            <path d="M84 42 C86 26, 72 20, 60 22" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default Avatar;