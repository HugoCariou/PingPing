import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { GiftStatus } from '../types';
import { Lock, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/button';

const STATUS_LABELS: Record<GiftStatus, string> = {
  pending: 'Idée',
  ordered: 'Commandé',
  received: 'Reçu',
  wrapped: 'Prêt',
};

export const GiftsView: React.FC = () => {
  const {
    getVisibleLists,
    getItemsForList,
    getPartnerProfile,
    createList,
    addItem,
    deleteItem,
    updateGiftStatus,
  } = useAppStore();

  const partnerProfile = getPartnerProfile();

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [activeGiftListId, setActiveGiftListId] = useState<string | null>(null);

  const [giftTitle, setGiftTitle] = useState('');
  const [giftDetails, setGiftDetails] = useState('');
  const [giftPrice, setGiftPrice] = useState('');
  const [giftUrl, setGiftUrl] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const secretLists = getVisibleLists().filter(
    (l) => l.type === 'gifts' && l.visibility === 'secret'
  );

  const currentList = secretLists.find((l) => l.id === activeGiftListId) || secretLists[0];
  const currentItems = currentList ? getItemsForList(currentList.id) : [];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    const list = createList({
      title: newListTitle.trim(),
      type: 'gifts',
      visibility: 'secret',
      targetUserId: partnerProfile?.id,
    });

    setActiveGiftListId(list.id);
    setNewListTitle('');
    setIsAddingList(false);
  };

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTitle.trim() || !currentList) return;

    addItem({
      listId: currentList.id,
      title: giftTitle.trim(),
      details: giftDetails.trim() || undefined,
      priceEstimate: giftPrice ? parseFloat(giftPrice) : undefined,
      url: giftUrl.trim() || undefined,
    });

    setGiftTitle('');
    setGiftDetails('');
    setGiftPrice('');
    setGiftUrl('');
    setIsAddingItem(false);
  };

  const totalBudget = currentItems.reduce(
    (acc, item) => acc + (item.price_estimate || 0),
    0
  );

  return (
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-3">
      {/* En-tête sobre */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-1.5">
          <Lock className="size-3.5 text-zinc-400" />
          Secrets
        </h1>
        {totalBudget > 0 && (
          <span className="text-xs text-zinc-500 font-medium">
            Total : {totalBudget} €
          </span>
        )}
      </div>

      {/* Onglets de listes */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800/60 pb-1.5">
        {secretLists.map((list) => {
          const isActive = currentList?.id === list.id;
          return (
            <button
              key={list.id}
              onClick={() => setActiveGiftListId(list.id)}
              className={cn(
                'text-xs px-2.5 py-1 rounded transition-colors cursor-pointer',
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {list.title}
            </button>
          );
        })}

        <button
          onClick={() => setIsAddingList(!isAddingList)}
          className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 cursor-pointer"
        >
          + Liste
        </button>
      </div>

      {/* Ajout liste */}
      {isAddingList && (
        <form onSubmit={handleCreateList} className="flex gap-2">
          <Input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Nom de la liste..."
            className="h-8 text-xs"
          />
          <Button type="submit" size="sm" disabled={!newListTitle.trim()}>
            Créer
          </Button>
        </form>
      )}

      {currentList ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>{currentItems.length} article{currentItems.length > 1 ? 's' : ''}</span>
            <Button
              size="sm"
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="h-6 text-[11px] px-2.5"
            >
              + Idée
            </Button>
          </div>

          {/* Formulaire ajout cadeau */}
          {isAddingItem && (
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-3 space-y-2">
                <Input
                  type="text"
                  value={giftTitle}
                  onChange={(e) => setGiftTitle(e.target.value)}
                  placeholder="Article..."
                  className="h-8 text-xs"
                />
                <Input
                  type="text"
                  value={giftDetails}
                  onChange={(e) => setGiftDetails(e.target.value)}
                  placeholder="Détails (taille, couleur)..."
                  className="h-7 text-[11px]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={giftPrice}
                    onChange={(e) => setGiftPrice(e.target.value)}
                    placeholder="Prix (€)"
                    className="h-7 text-[11px]"
                  />
                  <Input
                    type="url"
                    value={giftUrl}
                    onChange={(e) => setGiftUrl(e.target.value)}
                    placeholder="Lien..."
                    className="h-7 text-[11px]"
                  />
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingItem(false)} className="h-6 text-[11px]">
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleAddGift} disabled={!giftTitle.trim()} className="h-6 text-[11px]">
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste */}
          <div className="space-y-1.5">
            {currentItems.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                Aucune idée enregistrée
              </div>
            ) : (
              currentItems.map((item) => {
                const currentStatus = item.status || 'pending';

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded border border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-zinc-200 block truncate">
                          {item.title}
                        </span>
                        {item.details && (
                          <span className="text-[11px] text-zinc-500 block mt-0.5">
                            {item.details}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-zinc-600 hover:text-zinc-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-xs">
                      <div className="flex items-center gap-2">
                        {item.price_estimate && (
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {item.price_estimate} €
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="size-2.5" /> Lien
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5">
                        {(['pending', 'ordered', 'received', 'wrapped'] as GiftStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateGiftStatus(item.id, st)}
                            className={cn(
                              'text-[10px] px-1.5 py-0.2 rounded transition-colors cursor-pointer',
                              currentStatus === st
                                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                                : 'text-zinc-600 hover:text-zinc-400'
                            )}
                          >
                            {STATUS_LABELS[st]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-zinc-500 text-xs">
          Aucune liste
        </div>
      )}
    </div>
  );
};
