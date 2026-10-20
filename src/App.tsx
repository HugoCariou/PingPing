import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { GroceriesView } from './components/GroceriesView';
import { TodoView } from './components/TodoView';
import { GiftsView } from './components/GiftsView';
import { SettingsView } from './components/SettingsView';
import { Download, X } from 'lucide-react';
import { Button } from './components/ui/button';

export const App: React.FC = () => {
  const { activeTab } = useAppStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* Barre de navigation haute */}
      <Navbar />

      {/* Bannière discrète d'installation PWA si disponible */}
      {showInstallBanner && (
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-zinc-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Download className="size-3.5 text-zinc-400" />
            <span>Installer l'application sur l'écran d'accueil</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleInstallClick} className="h-6 text-[11px]">
              Installer
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInstallBanner(false)}
              className="size-6 text-zinc-400"
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 w-full overflow-y-auto">
        {activeTab === 'groceries' && <GroceriesView />}
        {activeTab === 'todo' && <TodoView />}
        {activeTab === 'gifts' && <GiftsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Barre de navigation basse */}
      <BottomNav />
    </div>
  );
};

export default App;
