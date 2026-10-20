import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { GroceryCategory } from '../types';
import { Plus, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from './ui/button';

const CATEGORIES: GroceryCategory[] = [
  'Fruits & Légumes',
  'Frais & Crémerie',
  'Viandes & Poissons',
  'Épicerie',
  'Boulangerie',
  'Boissons',
  'Entretien & Hygiène',
  'Surgelés',
  'Autre',
];

const QUICK_ITEMS = ['Pain', 'Lait', 'Oeufs', 'Avocats', 'Pâtes', 'Café'];

export const GroceriesView: React.FC = () => {
  const {
    getVisibleLists,
    getItemsForList,
    toggleItem,
    addItem,
    deleteItem,
    clearCompletedItems,
    createList,
  } = useAppStore();

  const [inputTitle, setInputTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GroceryCategory>('Fruits & Légumes');
  const [filterCategory, setFilterCategory] = useState<string>('Toutes');
  const [showCompleted, setShowCompleted] = useState(false);

  let groceryList = getVisibleLists().find((l) => l.type === 'groceries');

  if (!groceryList) {
    groceryList = createList({
      title: 'Courses',
      type: 'groceries',
      visibility: 'shared',
    });
  }

  const allItems = getItemsForList(groceryList.id);
  const pendingItems = allItems.filter((i) => !i.is_completed);
  const completedItems = allItems.filter((i) => i.is_completed);

  const displayedPending = filterCategory === 'Toutes'
    ? pendingItems
    : pendingItems.filter((i) => i.category === filterCategory);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputTitle.trim()) return;

    addItem({
      listId: groceryList!.id,
      title: inputTitle.trim(),
      category: selectedCategory,
    });

    setInputTitle('');
  };

  const handleQuickAdd = (name: string) => {
    addItem({
      listId: groceryList!.id,
      title: name,
      category: selectedCategory,
    });
  };

  return (
    <div className="pb-safe-nav pt-5 px-4 max-w-md mx-auto space-y-6">
      {/* En-tête aéré */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-zinc-100">
            Courses
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Liste partagée
          </p>
        </div>
        <Badge variant="secondary" className="px-2.5 py-0.5 text-xs">
          {pendingItems.length} à prendre
        </Badge>
      </div>

      {/* Zone de saisie principale */}
      <div className="space-y-3">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="Ajouter un article..."
            className="h-10 text-xs px-3.5 bg-zinc-900/60 border-zinc-800"
          />
          <Button type="submit" disabled={!inputTitle.trim()} className="h-10 px-4">
            <Plus className="size-4" />
          </Button>
        </form>

        {/* Suggestions rapides aérées */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] text-zinc-400 shrink-0 mr-1">Rapide :</span>
          {QUICK_ITEMS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleQuickAdd(name)}
              className="text-[11px] bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 px-2.5 py-1 rounded-md shrink-0 cursor-pointer transition-colors"
            >
              + {name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres par rayon bien espacés */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Rayon</span>
          {filterCategory !== 'Toutes' && (
            <button
              onClick={() => setFilterCategory('Toutes')}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setFilterCategory('Toutes')}
            className={cn(
              'text-xs px-3 py-1.5 rounded-md shrink-0 cursor-pointer transition-colors',
              filterCategory === 'Toutes'
                ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 border border-transparent'
            )}
          >
            Tous ({pendingItems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = pendingItems.filter((i) => i.category === cat).length;
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setFilterCategory(cat);
                  setSelectedCategory(cat);
                }}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-md shrink-0 cursor-pointer transition-colors flex items-center gap-1.5',
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 border border-transparent'
                )}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span className="text-[10px] text-zinc-400">({count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des articles à prendre (aérée et confortable) */}
      <div className="space-y-2.5">
        {displayedPending.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dashed border-zinc-850 p-6 text-zinc-400 text-xs">
            {pendingItems.length === 0
              ? 'Aucun article à acheter pour le moment.'
              : 'Aucun article dans ce rayon.'}
          </div>
        ) : (
          displayedPending.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors shadow-xs"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-3.5 text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="size-5 rounded-md border border-zinc-700 hover:border-zinc-500 bg-zinc-950 flex items-center justify-center transition-colors shrink-0">
                  {item.is_completed && <Check className="size-3.5 text-zinc-200" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-zinc-200 block truncate">
                    {item.title}
                  </span>
                  {item.category && item.category !== 'Autre' && (
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      {item.category}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-md transition-colors cursor-pointer ml-2"
                title="Supprimer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Section "Dans le panier" repliable et espacée */}
      {completedItems.length > 0 && (
        <div className="pt-4 border-t border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-1.5 font-medium hover:text-zinc-200 cursor-pointer"
            >
              <span>Dans le panier ({completedItems.length})</span>
              {showCompleted ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>

            {showCompleted && (
              <button
                onClick={() => clearCompletedItems(groceryList!.id)}
                className="text-xs text-zinc-400 hover:text-rose-400 font-medium cursor-pointer"
              >
                Vider le panier
              </button>
            )}
          </div>

          {showCompleted && (
            <div className="space-y-2">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-900 bg-zinc-950/40 opacity-50"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-3 text-left flex-1 line-through text-zinc-400 cursor-pointer"
                  >
                    <div className="size-4.5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-zinc-300" />
                    </div>
                    <span className="text-xs truncate">{item.title}</span>
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
          )}
        </div>
      )}
    </div>
  );
};
