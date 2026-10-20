import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Check, Trash2, Calendar, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { compressImage } from '../lib/imageUtils';

export const TodoView: React.FC = () => {
  const {
    getVisibleLists,
    getItemsForList,
    toggleItem,
    addItem,
    deleteItem,
    clearCompletedItems,
    createList,
  } = useAppStore();

  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);

  const [showExtras, setShowExtras] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  let todoList = getVisibleLists().find((l) => l.type === 'todo');

  if (!todoList) {
    todoList = createList({
      title: 'Tâches',
      type: 'todo',
      visibility: 'shared',
    });
  }

  const allItems = getItemsForList(todoList.id);
  const pendingItems = allItems.filter((i) => !i.is_completed);
  const completedItems = allItems.filter((i) => i.is_completed);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setNewImage(compressed);
      setShowExtras(true);
    } catch (err) {
      console.error('Erreur compression image', err);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addItem({
      listId: todoList!.id,
      title: newTitle.trim(),
      details: newDetails.trim() || undefined,
      dueDate: newDueDate || undefined,
      imageUrl: newImage || undefined,
    });

    setNewTitle('');
    setNewDetails('');
    setNewDueDate('');
    setNewImage(null);
    setShowExtras(false);
  };

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Aujourd\'hui';
    if (dateStr === tomorrow) return 'Demain';
    if (dateStr < today) return 'En retard';

    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}`;
  };

  return (
    <div className="pb-safe-nav pt-5 px-4 max-w-md mx-auto space-y-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-zinc-100">
            Tâches
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Missions communes
          </p>
        </div>
        <Badge variant="secondary" className="px-2.5 py-0.5 text-xs">
          {pendingItems.length} à faire
        </Badge>
      </div>

      {/* Saisie rapide avec date et photo */}
      <form onSubmit={handleAdd} className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="h-10 text-xs px-3.5 bg-zinc-900/60 border-zinc-800"
          />
          <Button type="submit" disabled={!newTitle.trim()} className="h-10 px-4">
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Boutons d'options complémentaires : Date / Photo / Note */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowExtras(!showExtras)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-1 py-1"
          >
            <span>{showExtras ? 'Moins d\'options' : '+ Date & Photo'}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {showExtras && (
          <div className="p-3 rounded-lg border border-zinc-850 bg-zinc-900/40 space-y-2.5 text-xs">
            {/* Date d'échéance */}
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-zinc-400 shrink-0" />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 focus:outline-none"
              />
              {newDueDate && (
                <button
                  type="button"
                  onClick={() => setNewDueDate('')}
                  className="text-zinc-400 hover:text-zinc-200 text-[10px]"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Note textuelle */}
            <Input
              type="text"
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              placeholder="Précision ou note..."
              className="h-7 text-[11px]"
            />

            {/* Photo de galerie */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-[11px] gap-1.5"
              >
                <ImageIcon className="size-3" />
                <span>{newImage ? 'Changer la photo' : 'Ajouter une photo'}</span>
              </Button>

              {newImage && (
                <div className="relative size-7 rounded border border-zinc-750 overflow-hidden shrink-0">
                  <img src={newImage} alt="preview" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewImage(null)}
                    className="absolute top-0 right-0 bg-black/80 text-white p-0.5"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Liste des tâches */}
      <div className="space-y-2.5">
        {pendingItems.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dashed border-zinc-850 p-6 text-zinc-400 text-xs">
            Aucune tâche en attente.
          </div>
        ) : (
          pendingItems.map((item) => {
            const dateLabel = formatDateLabel(item.due_date);
            const isOverdue = dateLabel === 'En retard';

            return (
              <div
                key={item.id}
                className="flex items-start justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors shadow-xs"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-start gap-3.5 text-left flex-1 min-w-0 cursor-pointer pt-0.5"
                >
                  <div className="size-5 rounded-md border border-zinc-700 hover:border-zinc-500 bg-zinc-950 flex items-center justify-center shrink-0 mt-0.5">
                    {item.is_completed && <Check className="size-3.5 text-zinc-200" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-zinc-200 block leading-snug">
                      {item.title}
                    </span>
                    {item.details && (
                      <span className="text-xs text-zinc-400 block mt-0.5">
                        {item.details}
                      </span>
                    )}

                    {/* Date d'échéance */}
                    {dateLabel && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium mt-1 px-1.5 py-0.2 rounded ${
                          isOverdue
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-900/60'
                            : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
                        }`}
                      >
                        <Calendar className="size-2.5" />
                        {dateLabel}
                      </span>
                    )}
                  </div>
                </button>

                {/* Miniature de photo si présente */}
                {item.image_url && (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(item.image_url!)}
                    className="size-10 rounded-lg border border-zinc-750 overflow-hidden shrink-0 ml-2 cursor-pointer hover:opacity-80 transition-opacity"
                    title="Agrandir la photo"
                  >
                    <img src={item.image_url} alt="tâche" className="size-full object-cover" />
                  </button>
                )}

                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-md transition-colors cursor-pointer ml-2"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Terminées */}
      {completedItems.length > 0 && (
        <div className="pt-4 border-t border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Terminées ({completedItems.length})</span>
            <button
              onClick={() => clearCompletedItems(todoList!.id)}
              className="text-xs text-zinc-400 hover:text-rose-400 font-medium cursor-pointer"
            >
              Effacer
            </button>
          </div>

          <div className="space-y-2">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-900 bg-zinc-950/40 opacity-50 text-xs"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center gap-3 text-left flex-1 line-through text-zinc-400 cursor-pointer"
                >
                  <div className="size-4.5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-zinc-300" />
                  </div>
                  <span className="truncate">{item.title}</span>
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-zinc-400 hover:text-rose-400"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
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
