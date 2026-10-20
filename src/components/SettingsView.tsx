import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { requestNotificationPermission, sendNotification } from '../lib/notifications';
import { Copy, Check, Share2, Bell } from 'lucide-react';
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
  const [notifGranted, setNotifGranted] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifGranted(true);
    }
  }, []);

  const handleEnableNotifs = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted) {
      sendNotification('PingPing', 'Notifications activées pour le foyer');
    }
  };

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
    <div className="pb-safe-nav pt-5 px-4 max-w-md mx-auto space-y-4 text-xs">
      {/* En-tête sobre */}
      <h1 className="text-base font-semibold tracking-tight text-zinc-100">
        Réglages
      </h1>

      {/* Espace & Code */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Espace</span>
            {editingCoupleName ? (
              <div className="flex items-center gap-1.5">
                <Input
                  type="text"
                  value={coupleNameInput}
                  onChange={(e) => setCoupleNameInput(e.target.value)}
                  className="h-7 text-xs w-36"
                />
                <Button size="sm" onClick={handleSaveCoupleName} className="h-7 text-xs px-2.5">
                  OK
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditingCoupleName(true)}
                className="text-zinc-200 hover:text-white font-medium cursor-pointer"
              >
                {couple.name.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim()}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-zinc-850">
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase tracking-wider">Code foyer</span>
              <span className="font-mono text-zinc-200 tracking-wider font-semibold text-sm">
                {couple.invite_code}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={copyInviteCode} className="h-7 text-xs px-2.5 gap-1">
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </Button>
              <Button size="sm" onClick={shareInvite} className="h-7 text-xs px-2.5 gap-1">
                <Share2 className="size-3" />
                <span>Partager</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profils */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3.5 space-y-2">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Profils</span>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-900/50"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: profile.avatar_color }}
                />
                <span className="text-zinc-200 font-medium">{profile.display_name}</span>
                {profile.id === currentUserId && (
                  <span className="text-[11px] text-zinc-400">(actif)</span>
                )}
              </div>

              <button
                onClick={() => {
                  const newName = prompt('Nom :', profile.display_name);
                  if (newName && newName.trim()) {
                    updateProfileName(profile.id, newName.trim());
                  }
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Renommer
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-3.5 text-zinc-400" />
            <span className="text-zinc-200 font-medium">Notifications</span>
          </div>

          {notifGranted ? (
            <Badge variant="success">Actives</Badge>
          ) : (
            <Button size="sm" onClick={handleEnableNotifs} className="h-7 text-xs px-3">
              Activer
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Statut Stockage */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3.5 flex items-center justify-between">
          <span className="text-zinc-400">Stockage</span>
          <Badge variant={isSupabaseConfigured ? 'success' : 'secondary'}>
            {isSupabaseConfigured ? 'Cloud' : 'Local'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
