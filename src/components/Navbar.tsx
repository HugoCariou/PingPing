import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { cn } from './ui/button';

export const Navbar: React.FC = () => {
  const { 
    couple, 
    profiles, 
    currentUserId, 
    setCurrentUser, 
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60 px-4 pt-safe pb-2">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-100">
            PingPing
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 truncate max-w-[120px]">
            {couple.name.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim()}
          </span>
        </div>

        {/* Sélecteur de profil compact */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-md">
          {profiles.map((profile) => {
            const isActive = profile.id === currentUserId;
            return (
              <button
                key={profile.id}
                onClick={() => setCurrentUser(profile.id)}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {profile.display_name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
