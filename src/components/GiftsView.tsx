import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { GiftStatus } from '../types';
import { Lock, ExternalLink, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/button';
import { compressImage } from '../lib/imageUtils';

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
  const [giftImage, setGiftImage] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const secretLists = getVisibleLists().filter(
    (l) => l.type === 'gifts' && l.visibility === 'secret'
  );

  const currentList = secretLists.find((l) => l.id === activeGiftListId) || secretLists[0];
  const currentItems = currentList ? getItemsForList(currentList.id) : [];

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setGiftImage(compressed);
    } catch (err) {
      console.error('Erreur compression image', err);
    }
  };

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
      imageUrl: giftImage || undefined,
    });

    setGiftTitle('');
    setGiftDetails('');
    setGiftPrice('');
    setGiftUrl('');
    setGiftImage(null);
    setIsAddingItem(false);
  };

  const totalBudget = currentItems.reduce(
    (acc, item) => acc + (item.price_estimate || 0),
    0
  );

  return (
    <div className="pb-safe-nav pt-5 px-4 max-w-md mx-auto space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold tracking-tight text-zinc-100 flex items-center gap-1.5">
          <Lock className="size-4 text-zinc-400" />
          Secrets
        </h1>
        {totalBudget > 0 && (
          <span className="text-xs text-zinc-400 font-medium">
            Total : {totalBudget} €
          </span>
        )}
      </div>

      {/* Onglets de listes */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800/60 pb-2">
        {secretLists.map((list) => {
          const isActive = currentList?.id === list.id;
          return (
            <button
              key={list.id}
              onClick={() => setActiveGiftListId(list.id)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer',
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {list.title}
            </button>
          );
        })}

        <button
          onClick={() => setIsAddingList(!isAddingList)}
          className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 cursor-pointer font-medium"
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
            className="h-9 text-xs"
          />
          <Button type="submit" size="sm" disabled={!newListTitle.trim()} className="h-9">
            Créer
          </Button>
        </form>
      )}

      {currentList ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>{currentItems.length} article{currentItems.length > 1 ? 's' : ''}</span>
            <Button
              size="sm"
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="h-7 text-xs px-3"
            >
              + Idée
            </Button>
          </div>

          {/* Formulaire ajout cadeau avec photo */}
          {isAddingItem && (
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-3.5 space-y-2.5">
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
                  className="h-8 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={giftPrice}
                    onChange={(e) => setGiftPrice(e.target.value)}
                    placeholder="Prix (€)"
                    className="h-8 text-xs"
                  />
                  <Input
                    type="url"
                    value={giftUrl}
                    onChange={(e) => setGiftUrl(e.target.value)}
                    placeholder="Lien..."
                    className="h-8 text-xs"
                  />
                </div>

                {/* Ajout photo galerie */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-[11px] gap-1.5"
                  >
                    <ImageIcon className="size-3" />
                    <span>{giftImage ? 'Changer photo' : 'Photo'}</span>
                  </Button>

                  {giftImage && (
                    <div className="relative size-7 rounded border border-zinc-750 overflow-hidden shrink-0">
                      <img src={giftImage} alt="preview" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGiftImage(null)}
                        className="absolute top-0 right-0 bg-black/80 text-white p-0.5"
                      >
                        <X className="size-2.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingItem(false)} className="h-7 text-xs">
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleAddGift} disabled={!giftTitle.trim()} className="h-7 text-xs">
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des cartes cadeaux */}
          <div className="space-y-2.5">
            {currentItems.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed border-zinc-850 p-6 text-zinc-400 text-xs">
                Aucune idée enregistrée pour le moment.
              </div>
            ) : (
              currentItems.map((item) => {
                const currentStatus = item.status || 'pending';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-zinc-200 block truncate">
                          {item.title}
                        </span>
                        {item.details && (
                          <span className="text-xs text-zinc-400 block mt-0.5 leading-relaxed">
                            {item.details}
                          </span>
                        )}
                      </div>

                      {/* Miniature photo si présente */}
                      {item.image_url && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(item.image_url!)}
                          className="size-11 rounded-lg border border-zinc-750 overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img src={item.image_url} alt="cadeau" className="size-full object-cover" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-850 text-xs">
                      <div className="flex items-center gap-2.5">
                        {item.price_estimate && (
                          <span className="text-xs text-zinc-300 font-medium">
                            {item.price_estimate} €
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="size-3" /> Lien
                          </a>
                        )}
                      </div>

                      {/* Micro-statuts */}
                      <div className="flex items-center gap-1">
                        {(['pending', 'ordered', 'received', 'wrapped'] as GiftStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateGiftStatus(item.id, st)}
                            className={cn(
                              'text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer',
                              currentStatus === st
                                ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700'
                                : 'text-zinc-500 hover:text-zinc-300'
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
        <div className="text-center py-8 text-zinc-400 text-xs">
          Aucune liste
        </div>
      )}

      {/* Modale plein écran d'aperçu photo */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm max-h-[80vh] overflow-hidden rounded-xl border border-zinc-800">
            <img src={previewImage} alt="Agrandie" className="w-full h-auto object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-zinc-900/90 text-white p-1 rounded-full border border-zinc-700"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
