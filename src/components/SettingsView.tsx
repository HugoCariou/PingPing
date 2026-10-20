import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  Settings, 
  Share2, 
  Copy, 
  Check, 
  Smartphone, 
  Database, 
  Users, 
  QrCode
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

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
        title: 'Rejoins notre espace sur PingPing',
        text: `Rejoins notre espace partagé avec le code : ${couple.invite_code}`,
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
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* En-tête épuré */}
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Settings className="size-4 text-zinc-400" />
          Paramètres du Foyer
        </h1>
        <p className="text-xs text-zinc-400">
          Appairage, profils et installation PWA
        </p>
      </div>

      {/* Carte d'appairage sobre */}
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-[10px] uppercase font-semibold text-zinc-400">
                Espace Partagé
              </CardDescription>
              {editingCoupleName ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="text"
                    value={coupleNameInput}
                    onChange={(e) => setCoupleNameInput(e.target.value)}
                    className="h-7 text-xs font-medium"
                  />
                  <Button size="sm" onClick={handleSaveCoupleName} className="h-7">
                    OK
                  </Button>
                </div>
              ) : (
                <CardTitle
                  onClick={() => setEditingCoupleName(true)}
                  className="cursor-pointer hover:text-zinc-300 transition-colors text-sm font-medium mt-0.5"
                >
                  {couple.name} ✏️
                </CardTitle>
              )}
            </div>

            <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <QrCode className="size-4" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div>
              <span className="text-[10px] uppercase font-medium text-zinc-400 block">
                Code de synchronisation
              </span>
              <span className="text-sm font-semibold tracking-wider text-zinc-200">
                {couple.invite_code}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={copyInviteCode}
                className="h-7 gap-1 text-xs"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </Button>

              <Button
                size="sm"
                onClick={shareInvite}
                className="h-7 gap-1 text-xs"
              >
                <Share2 className="size-3" />
                <span>Partager</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profils neutres */}
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs uppercase font-semibold text-zinc-400 flex items-center gap-1.5">
            <Users className="size-3.5" /> Profils
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="size-7 rounded-md flex items-center justify-center text-zinc-100 font-semibold text-xs border border-zinc-700"
                  style={{ backgroundColor: profile.avatar_color }}
                >
                  {profile.display_name.charAt(0)}
                </div>

                <div>
                  <span className="text-xs font-medium text-zinc-200 block">
                    {profile.display_name}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {profile.id === currentUserId ? 'Actif sur cet appareil' : 'Partenaire'}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newName = prompt('Nouveau nom pour ce profil :', profile.display_name);
                  if (newName && newName.trim()) {
                    updateProfileName(profile.id, newName.trim());
                  }
                }}
                className="h-6 text-[11px] text-zinc-400 hover:text-zinc-200"
              >
                Modifier
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guide Installation PWA */}
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs uppercase font-semibold text-zinc-400 flex items-center gap-1.5">
            <Smartphone className="size-3.5 text-zinc-400" /> Installation PWA (Écran d'accueil)
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-2 text-xs">
          <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 space-y-1">
            <span className="font-medium text-zinc-200 block text-[11px]">
              iPhone (Safari) :
            </span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Bouton Partager <strong className="text-zinc-300">⎋</strong> ➔ « Sur l'écran d'accueil ».
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 space-y-1">
            <span className="font-medium text-zinc-200 block text-[11px]">
              Android (Chrome) :
            </span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Menu <strong className="text-zinc-300">⋮</strong> ➔ « Installer l'application ».
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statut Backend Cloud */}
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Database className="size-3.5 text-zinc-400" /> Synchronisation Cloud
            </span>
            <Badge variant={isSupabaseConfigured ? 'success' : 'secondary'}>
              {isSupabaseConfigured ? 'Supabase Connecté' : 'Mode Local-First'}
            </Badge>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            {isSupabaseConfigured
              ? 'Synchronisation temps réel active avec Row Level Security.'
              : 'Données stockées localement sur cet appareil. Pour synchroniser 2 téléphones distants, configurez Supabase dans .env avec le script supabase/schema.sql.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
