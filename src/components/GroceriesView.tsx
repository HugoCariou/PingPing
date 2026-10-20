import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { GroceryCategory } from '../types';
import { 
  ShoppingCart, 
  Plus, 
  Check, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
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

const QUICK_SUGGESTIONS = [
  { name: 'Pain', cat: 'Boulangerie' as const },
  { name: 'Lait', cat: 'Boissons' as const },
  { name: 'Oeufs', cat: 'Frais & Crémerie' as const },
  { name: 'Avocats', cat: 'Fruits & Légumes' as const },
  { name: 'Pâtes', cat: 'Épicerie' as const },
  { name: 'Café', cat: 'Épicerie' as const },
];

export const GroceriesView: React.FC = () => {
  const {
    getVisibleLists,
    getItemsForList,
    toggleItem,
    addItem,
    deleteItem,
    clearCompletedItems,
    profiles,
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

  const handleQuickAdd = (s: { name: string; cat: GroceryCategory }) => {
    addItem({
      listId: groceryList!.id,
      title: s.name,
      category: s.cat,
    });
  };

  const getProfileName = (userId?: string) => {
    if (!userId) return '';
    const p = profiles.find((prof) => prof.id === userId);
    return p ? p.display_name : '';
  };

  return (
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* En-tête épuré */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <ShoppingCart className="size-4 text-zinc-400" />
            Courses
          </h1>
          <p className="text-xs text-zinc-400">
            Liste commune synchronisée
          </p>
        </div>

        <Badge variant="secondary">
          {pendingItems.length} à prendre
        </Badge>
      </div>

      {/* Saisie rapide sobre */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-3 space-y-2.5">
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <Input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Ajouter un article..."
              className="h-8"
            />
            <Button
              type="submit"
              disabled={!inputTitle.trim()}
              size="sm"
              className="gap-1"
            >
              <Plus className="size-3.5" />
              <span>Ajouter</span>
            </Button>
          </form>

          {/* Choix du rayon */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
            <span className="text-[11px] text-zinc-400 shrink-0 mr-1">Rayon :</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 transition-colors cursor-pointer',
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions rapides discrètes */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] uppercase font-semibold text-zinc-400 shrink-0">
          Rapide :
        </span>
        {QUICK_SUGGESTIONS.map((s) => (
          <button
            key={s.name}
            onClick={() => handleQuickAdd(s)}
            className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-2.5 py-0.5 rounded-md shrink-0 transition-colors cursor-pointer"
          >
            + {s.name}
          </button>
        ))}
      </div>

      {/* Filtres de rayons */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800/60 pb-2">
        <button
          onClick={() => setFilterCategory('Toutes')}
          className={cn(
            'text-[11px] font-medium px-2.5 py-1 rounded-md shrink-0 transition-colors cursor-pointer',
            filterCategory === 'Toutes'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
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
                'text-[11px] font-medium px-2 py-1 rounded-md shrink-0 transition-colors flex items-center gap-1 cursor-pointer',
                filterCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              <span>{cat}</span>
              {count > 0 && <span className="text-[10px] opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Liste des articles en attente */}
      <div className="space-y-1.5">
        {displayedPending.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xs">
            {pendingItems.length === 0
              ? 'Aucun article à acheter.'
              : 'Aucun article dans cette catégorie.'}
          </div>
        ) : (
          displayedPending.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="size-4.5 rounded border border-zinc-700 group-hover:border-zinc-500 bg-zinc-950 flex items-center justify-center transition-colors">
                  {item.is_completed && <Check className="size-3 text-zinc-200" />}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-zinc-200 block truncate">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-400">
                    {item.category && <span>{item.category}</span>}
                    {item.created_by && <span>• par {getProfileName(item.created_by)}</span>}
                  </div>
                </div>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteItem(item.id)}
                className="size-7 text-zinc-400 hover:text-zinc-200"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Déjà pris (repliable) */}
      {completedItems.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-between py-2 text-xs font-medium text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <span>Déjà pris ({completedItems.length})</span>
            {showCompleted ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>

          {showCompleted && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-end mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearCompletedItems(groceryList!.id)}
                  className="text-zinc-400 hover:text-rose-400 text-[11px] h-6"
                >
                  Vider les cochés
                </Button>
              </div>

              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-zinc-900 bg-zinc-950/40 opacity-50"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                  >
                    <div className="size-4 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <Check className="size-3 text-zinc-300" />
                    </div>
                    <span className="text-xs text-zinc-400 line-through truncate">
                      {item.title}
                    </span>
                  </button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="size-6 text-zinc-400 hover:text-rose-400"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
