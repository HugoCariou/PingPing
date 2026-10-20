import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

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
  const [showDetails, setShowDetails] = useState(false);

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addItem({
      listId: todoList!.id,
      title: newTitle.trim(),
      details: newDetails.trim() || undefined,
    });

    setNewTitle('');
    setNewDetails('');
    setShowDetails(false);
  };

  return (
    <div className="pb-safe-nav pt-4 px-4 max-w-md mx-auto space-y-3">
      {/* En-tête concis */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
          Tâches
        </h1>
        <Badge variant="secondary">
          {pendingItems.length}
        </Badge>
      </div>

      {/* Saisie sobre */}
      <form onSubmit={handleAdd} className="space-y-1.5">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="h-8 text-xs"
          />
          <Button type="submit" disabled={!newTitle.trim()} size="sm" className="h-8 px-3">
            <Plus className="size-3.5" />
          </Button>
        </div>

        {showDetails ? (
          <Input
            type="text"
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            placeholder="Détail (optionnel)..."
            className="h-7 text-[11px]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            + Note
          </button>
        )}
      </form>

      {/* Liste des tâches */}
      <div className="space-y-1">
        {pendingItems.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs">
            Aucune tâche
          </div>
        ) : (
          pendingItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-2 px-2.5 rounded border border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-start gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="size-4 rounded border border-zinc-700 bg-zinc-950 flex items-center justify-center mt-0.5 shrink-0">
                  {item.is_completed && <Check className="size-3 text-zinc-200" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-zinc-200 block leading-tight">
                    {item.title}
                  </span>
                  {item.details && (
                    <span className="text-[11px] text-zinc-500 block mt-0.5">
                      {item.details}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="p-1 text-zinc-600 hover:text-zinc-400 cursor-pointer ml-1"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Terminées */}
      {completedItems.length > 0 && (
        <div className="pt-2 border-t border-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Terminées ({completedItems.length})</span>
            <button
              onClick={() => clearCompletedItems(todoList!.id)}
              className="text-[10px] hover:text-rose-400 cursor-pointer"
            >
              Effacer
            </button>
          </div>

          <div className="space-y-1">
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
        </div>
      )}
    </div>
  );
};
