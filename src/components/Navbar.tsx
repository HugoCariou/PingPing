import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Heart, Users } from 'lucide-react';
import { cn } from './ui/button';

export const Navbar: React.FC = () => {
  const { 
    couple, 
    profiles, 
    currentUserId, 
    setCurrentUser, 
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 px-4 pt-safe pb-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Titre & Logo épuré */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
            <Heart className="size-4 text-zinc-300" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                PingPing
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 font-medium border border-zinc-800">
                pwa
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-normal truncate max-w-[140px]">
              {couple.name}
            </p>
          </div>
        </div>

        {/* Sélecteur de profil façon segmented control shadcn */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-lg">
          <div className="flex items-center pl-2 pr-1 text-[11px] text-zinc-500 font-medium">
            <Users className="size-3 mr-1" />
            <span className="hidden sm:inline">Vue :</span>
          </div>

          {profiles.map((profile) => {
            const isActive = profile.id === currentUserId;
            return (
              <button
                key={profile.id}
                onClick={() => setCurrentUser(profile.id)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer',
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                )}
                title={`Basculer sur le profil de ${profile.display_name}`}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: profile.avatar_color }}
                />
                <span>{profile.display_name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
