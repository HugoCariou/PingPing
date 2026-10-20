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
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-3">
      {/* En-tête concis */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
          Courses
        </h1>
        <Badge variant="secondary">
          {pendingItems.length}
        </Badge>
      </div>

      {/* Saisie rapide */}
      <div className="space-y-2">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="Ajouter un article..."
            className="h-8 text-xs"
          />
          <Button type="submit" disabled={!inputTitle.trim()} size="sm" className="h-8 px-3">
            <Plus className="size-3.5" />
          </Button>
        </form>

        {/* Rayons et suggestions */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'text-[10px] px-2 py-0.5 rounded shrink-0 transition-colors cursor-pointer',
                selectedCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {QUICK_ITEMS.map((name) => (
            <button
              key={name}
              onClick={() => handleQuickAdd(name)}
              className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-2 py-0.5 rounded shrink-0 cursor-pointer"
            >
              + {name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres par rayon */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-800/60 pb-1.5 no-scrollbar">
        <button
          onClick={() => setFilterCategory('Toutes')}
          className={cn(
            'text-[11px] px-2 py-0.5 rounded shrink-0 cursor-pointer',
            filterCategory === 'Toutes' ? 'text-zinc-100 font-medium' : 'text-zinc-500'
          )}
        >
          Tous ({pendingItems.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = pendingItems.filter((i) => i.category === cat).length;
          if (count === 0 && filterCategory !== cat) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'text-[11px] px-2 py-0.5 rounded shrink-0 cursor-pointer',
                filterCategory === cat ? 'text-zinc-100 font-medium' : 'text-zinc-500'
              )}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Liste des items */}
      <div className="space-y-1">
        {displayedPending.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs">
            Aucun article
          </div>
        ) : (
          displayedPending.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-1.5 px-2 rounded border border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="size-4 rounded border border-zinc-700 bg-zinc-950 flex items-center justify-center">
                  {item.is_completed && <Check className="size-3 text-zinc-200" />}
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <span className="text-xs text-zinc-200 block truncate">
                    {item.title}
                  </span>
                </div>
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="p-1 text-zinc-600 hover:text-zinc-400 cursor-pointer"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Panier */}
      {completedItems.length > 0 && (
        <div className="pt-2 border-t border-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-1 cursor-pointer hover:text-zinc-300"
            >
              <span>Pris ({completedItems.length})</span>
              {showCompleted ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
            {showCompleted && (
              <button
                onClick={() => clearCompletedItems(groceryList!.id)}
                className="text-[10px] text-zinc-500 hover:text-rose-400 cursor-pointer"
              >
                Effacer
              </button>
            )}
          </div>

          {showCompleted && (
            <div className="space-y-1 pt-1.5">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1 px-2 rounded opacity-40 text-xs"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-2 text-left flex-1 line-through text-zinc-500 cursor-pointer"
                  >
                    <Check className="size-3 text-zinc-400" />
                    <span className="truncate">{item.title}</span>
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1 text-zinc-600 hover:text-rose-400"
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
