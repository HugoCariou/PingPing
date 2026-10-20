import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { GroceriesView } from './components/GroceriesView';
import { TodoView } from './components/TodoView';
import { GiftsView } from './components/GiftsView';
import { SettingsView } from './components/SettingsView';
import { X } from 'lucide-react';
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
      <Navbar />

      {showInstallBanner && (
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-1.5 text-zinc-300 flex items-center justify-between text-xs">
          <span>Installer sur l'écran d'accueil</span>
          <div className="flex items-center gap-1.5">
            <Button size="sm" onClick={handleInstallClick} className="h-5 text-[10px] px-2">
              Installer
            </Button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full overflow-y-auto">
        {activeTab === 'groceries' && <GroceriesView />}
        {activeTab === 'todo' && <TodoView />}
        {activeTab === 'gifts' && <GiftsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <BottomNav />
    </div>
  );
};

export default App;
