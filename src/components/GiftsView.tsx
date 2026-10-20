import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { GiftStatus } from '../types';
import { 
  Gift, 
  Lock, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Clock, 
  Package, 
  ShoppingBag,
  CheckCircle2,
  Euro
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/button';

const STATUS_LABELS: Record<GiftStatus, { label: string; icon: any }> = {
  pending: { label: 'Idée', icon: Clock },
  ordered: { label: 'Commandé', icon: ShoppingBag },
  received: { label: 'Reçu', icon: Package },
  wrapped: { label: 'Prêt', icon: CheckCircle2 },
};

export const GiftsView: React.FC = () => {
  const {
    getVisibleLists,
    getItemsForList,
    getCurrentProfile,
    getPartnerProfile,
    createList,
    addItem,
    deleteItem,
    updateGiftStatus,
  } = useAppStore();

  const currentProfile = getCurrentProfile();
  const partnerProfile = getPartnerProfile();

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const [activeGiftListId, setActiveGiftListId] = useState<string | null>(null);

  // Formulaire d'ajout
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
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* En-tête épuré */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <Gift className="size-4 text-zinc-400" />
            Coffre Secret
          </h1>
          <p className="text-xs text-zinc-400">
            Idées cadeaux strictement privées
          </p>
        </div>

        <Badge variant="secret" className="gap-1">
          <Lock className="size-3" />
          <span>Privé</span>
        </Badge>
      </div>

      {/* Note discrète de confidentialité */}
      <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 text-xs text-zinc-400 flex items-start gap-2.5">
        <Lock className="size-3.5 text-zinc-500 mt-0.5 shrink-0" />
        <p className="leading-relaxed text-[11px]">
          Ce coffre est visible uniquement depuis votre profil ({currentProfile.display_name}). 
          {partnerProfile && ` ${partnerProfile.display_name} n'y a pas accès.`}
        </p>
      </div>

      {/* Onglets des listes secrètes */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {secretLists.map((list) => {
          const isActive = currentList?.id === list.id;
          return (
            <button
              key={list.id}
              onClick={() => setActiveGiftListId(list.id)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-md shrink-0 transition-colors cursor-pointer flex items-center gap-1.5',
                isActive
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              )}
            >
              <Lock className="size-3 text-zinc-500" />
              <span>{list.title}</span>
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingList(!isAddingList)}
          className="h-7 text-[11px] gap-1"
        >
          <Plus className="size-3" />
          <span>Nouvelle liste</span>
        </Button>
      </div>

      {/* Modal création de liste */}
      {isAddingList && (
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="p-3 space-y-2">
            <p className="text-xs font-medium text-zinc-200">Créer une liste secrète</p>
            <form onSubmit={handleCreateList} className="flex gap-2">
              <Input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Ex: Noël, Anniversaire..."
                className="h-8"
              />
              <Button type="submit" size="sm" disabled={!newListTitle.trim()}>
                Créer
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {currentList ? (
        <div className="space-y-3">
          {/* Barre résumé */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              {currentItems.length} idée{currentItems.length > 1 ? 's' : ''}
              {totalBudget > 0 && ` • Budget : ${totalBudget} €`}
            </span>

            <Button
              size="sm"
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="h-7 gap-1"
            >
              <Plus className="size-3.5" />
              <span>Ajouter une idée</span>
            </Button>
          </div>

          {/* Formulaire ajout cadeau */}
          {isAddingItem && (
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardContent className="p-3 space-y-2">
                <Input
                  type="text"
                  value={giftTitle}
                  onChange={(e) => setGiftTitle(e.target.value)}
                  placeholder="Nom du cadeau..."
                  className="h-8"
                />
                <Input
                  type="text"
                  value={giftDetails}
                  onChange={(e) => setGiftDetails(e.target.value)}
                  placeholder="Détails (taille, couleur)..."
                  className="h-8"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      type="number"
                      value={giftPrice}
                      onChange={(e) => setGiftPrice(e.target.value)}
                      placeholder="Prix (€)"
                      className="h-8 pl-7"
                    />
                    <Euro className="size-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                  </div>
                  <Input
                    type="url"
                    value={giftUrl}
                    onChange={(e) => setGiftUrl(e.target.value)}
                    placeholder="Lien web..."
                    className="h-8"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                  >
                    Annuler
                  </Button>
                  <Button size="sm" type="button" onClick={handleAddGift} disabled={!giftTitle.trim()}>
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cartes cadeaux sobres */}
          <div className="space-y-2">
            {currentItems.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs">
                Aucune idée enregistrée pour le moment.
              </div>
            ) : (
              currentItems.map((item) => {
                const currentStatus = item.status || 'pending';

                return (
                  <Card key={item.id} className="border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors">
                    <CardContent className="p-3 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-medium text-zinc-200 leading-snug">
                            {item.title}
                          </h3>
                          {item.details && (
                            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                              {item.details}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                          className="size-6 text-zinc-400 hover:text-rose-400 shrink-0"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {item.price_estimate && (
                          <Badge variant="outline" className="text-[10px]">
                            {item.price_estimate} €
                          </Badge>
                        )}

                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            <ExternalLink className="size-3" />
                            <span>Voir le produit</span>
                          </a>
                        )}
                      </div>

                      {/* Statuts façon segmented control */}
                      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">Statut :</span>

                        <div className="flex items-center gap-1">
                          {(['pending', 'ordered', 'received', 'wrapped'] as GiftStatus[]).map((st) => {
                            const isCurrent = currentStatus === st;
                            const config = STATUS_LABELS[st];
                            const StIcon = config.icon;

                            return (
                              <button
                                key={st}
                                onClick={() => updateGiftStatus(item.id, st)}
                                className={cn(
                                  'text-[10px] font-medium px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer',
                                  isCurrent
                                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                                    : 'text-zinc-400 hover:text-zinc-300'
                                )}
                              >
                                <StIcon className="size-2.5" />
                                <span>{config.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-400 text-xs">
          Aucune liste secrète active.
        </div>
      )}
    </div>
  );
};
