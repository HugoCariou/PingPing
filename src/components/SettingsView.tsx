import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export const SettingsView: React.FC = () => {
  const {
    couple,
    profiles,
    updateCoupleName,
    updateProfileName,
    currentUserId,
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const [editingCoupleName, setEditingCoupleName] = useState(false);
  const [coupleNameInput, setCoupleNameInput] = useState(couple.name);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(couple.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PingPing',
        text: `Code : ${couple.invite_code}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyInviteCode();
    }
  };

  const handleSaveCoupleName = () => {
    if (coupleNameInput.trim()) {
      updateCoupleName(coupleNameInput.trim());
    }
    setEditingCoupleName(false);
  };

  return (
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-3 text-xs">
      {/* En-tête sobre */}
      <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
        Réglages
      </h1>

      {/* Espace & Code */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-medium">Espace</span>
            {editingCoupleName ? (
              <div className="flex items-center gap-1.5">
                <Input
                  type="text"
                  value={coupleNameInput}
                  onChange={(e) => setCoupleNameInput(e.target.value)}
                  className="h-6 text-xs w-32"
                />
                <Button size="sm" onClick={handleSaveCoupleName} className="h-6 text-[10px] px-2">
                  OK
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditingCoupleName(true)}
                className="text-zinc-200 hover:text-white font-medium cursor-pointer"
              >
                {couple.name}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
            <div>
              <span className="text-[10px] text-zinc-500 block">Code de synchronisation</span>
              <span className="font-mono text-zinc-200 tracking-wider font-semibold">
                {couple.invite_code}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={copyInviteCode} className="h-6 text-[10px] px-2 gap-1">
                {copied ? <Check className="size-2.5 text-emerald-400" /> : <Copy className="size-2.5" />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </Button>
              <Button size="sm" onClick={shareInvite} className="h-6 text-[10px] px-2 gap-1">
                <Share2 className="size-2.5" />
                <span>Partager</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profils */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3 space-y-1.5">
          <span className="text-[11px] text-zinc-500 font-medium block mb-1">Profils</span>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-zinc-900/40"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: profile.avatar_color }}
                />
                <span className="text-zinc-200 font-medium">{profile.display_name}</span>
                {profile.id === currentUserId && (
                  <span className="text-[10px] text-zinc-500">(actif)</span>
                )}
              </div>

              <button
                onClick={() => {
                  const newName = prompt('Nom :', profile.display_name);
                  if (newName && newName.trim()) {
                    updateProfileName(profile.id, newName.trim());
                  }
                }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                Renommer
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Statut Sync */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3 flex items-center justify-between">
          <span className="text-zinc-400">Stockage</span>
          <Badge variant={isSupabaseConfigured ? 'success' : 'secondary'}>
            {isSupabaseConfigured ? 'Cloud' : 'Local'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
