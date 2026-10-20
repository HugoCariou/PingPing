import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { requestNotificationPermission, sendNotification } from '../lib/notifications';
import { Copy, Check, Share2, Bell, Lock, KeyRound } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export const SettingsView: React.FC = () => {
  const {
    couple,
    profiles,
    currentUserId,
    updateCoupleName,
    setProfilePin,
    switchUserWithPin,
  } = useAppStore();

  const currentProfile = profiles.find((p) => p.id === currentUserId) || profiles[0];

  const [copied, setCopied] = useState(false);
  const [editingCoupleName, setEditingCoupleName] = useState(false);
  const [coupleNameInput, setCoupleNameInput] = useState(couple.name);
  const [notifGranted, setNotifGranted] = useState(false);

  // Gestion du PIN
  const [editingPin, setEditingPin] = useState(false);
  const [pinInput, setPinInput] = useState(currentProfile.pin || '');
  const [pinSaved, setPinSaved] = useState(false);

  // Changement de compte sécurisé
  const [switchingToId, setSwitchingToId] = useState<string | null>(null);
  const [switchPinInput, setSwitchPinInput] = useState('');
  const [switchError, setSwitchError] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifGranted(true);
    }
  }, []);

  const handleEnableNotifs = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted) {
      sendNotification('PingPing', 'Notifications activées');
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

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePin(currentProfile.id, pinInput.trim());
    setEditingPin(false);
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2000);
  };

  const handleSwitchUser = (targetId: string) => {
    const target = profiles.find((p) => p.id === targetId);
    if (!target?.pin) {
      // Si la cible n'a pas de PIN, bascule directe
      switchUserWithPin(targetId);
      setSwitchingToId(null);
    } else {
      // Demande de PIN obligatoire
      setSwitchingToId(targetId);
      setSwitchPinInput('');
      setSwitchError(false);
    }
  };

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchingToId) return;

    const success = switchUserWithPin(switchingToId, switchPinInput);
    if (success) {
      setSwitchingToId(null);
      setSwitchPinInput('');
      setSwitchError(false);
    } else {
      setSwitchError(true);
    }
  };

  return (
    <div className="pb-safe-nav pt-5 px-4 max-w-md mx-auto space-y-4 text-xs">
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

      {/* Mon Profil & Code PIN personnel */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Mon compte</span>
            <span className="text-zinc-200 font-medium">{currentProfile.display_name}</span>
          </div>

          <div className="pt-2 border-t border-zinc-850">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lock className="size-3 text-zinc-400" />
                <span className="text-zinc-300">Code PIN secret</span>
              </div>

              {editingPin ? (
                <form onSubmit={handleSavePin} className="flex items-center gap-1.5">
                  <Input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="PIN..."
                    className="h-6 w-20 text-xs text-center"
                    autoFocus
                  />
                  <Button type="submit" size="sm" className="h-6 text-[10px] px-2">
                    OK
                  </Button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setPinInput(currentProfile.pin || '');
                    setEditingPin(true);
                  }}
                  className="text-zinc-400 hover:text-zinc-200 text-[11px] cursor-pointer"
                >
                  {pinSaved ? 'Enregistré' : currentProfile.pin ? 'Modifier le PIN' : 'Définir un PIN'}
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profils du foyer & Bascule sécurisée */}
      <Card className="border-zinc-800 bg-zinc-900/30">
        <CardContent className="p-3.5 space-y-2">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Appareils du foyer</span>
          {profiles.map((profile) => {
            const isMe = profile.id === currentUserId;
            return (
              <div
                key={profile.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: profile.avatar_color }}
                  />
                  <span className="text-zinc-200 font-medium">{profile.display_name}</span>
                  {isMe && <span className="text-[11px] text-zinc-400">(cet appareil)</span>}
                </div>

                {!isMe && (
                  <button
                    onClick={() => handleSwitchUser(profile.id)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    Changer pour ce compte
                  </button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Modale de confirmation PIN pour changer de compte */}
      {switchingToId && (
        <Card className="border-zinc-800 bg-zinc-900/90 shadow-xl">
          <CardContent className="p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <KeyRound className="size-4 text-zinc-400" />
              <span>Code PIN requis pour ce compte</span>
            </div>

            <form onSubmit={handleConfirmSwitch} className="space-y-2">
              <Input
                type="password"
                maxLength={6}
                value={switchPinInput}
                onChange={(e) => {
                  setSwitchPinInput(e.target.value);
                  setSwitchError(false);
                }}
                placeholder="Entrer le code PIN..."
                className="h-8 text-xs text-center tracking-widest"
                autoFocus
              />

              {switchError && (
                <p className="text-[11px] text-rose-400 text-center">Code PIN incorrect</p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setSwitchingToId(null)}
                  className="h-7 text-xs"
                >
                  Annuler
                </Button>
                <Button size="sm" type="submit" disabled={!switchPinInput.trim()} className="h-7 text-xs">
                  Valider
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
