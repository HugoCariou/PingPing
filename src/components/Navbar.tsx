import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const Navbar: React.FC = () => {
  const { couple, getCurrentProfile } = useAppStore();
  const currentProfile = getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60 px-4 pt-safe pb-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Titre & Espace */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-100">
            PingPing
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 truncate max-w-[130px]">
            {couple.name.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim()}
          </span>
        </div>

        {/* Profil actif sur cet appareil (sans switch public) */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: currentProfile.avatar_color }}
          />
          <span className="text-xs font-medium text-zinc-200">
            {currentProfile.display_name}
          </span>
        </div>
      </div>
    </header>
  );
};
