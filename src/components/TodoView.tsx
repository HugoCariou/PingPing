import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckSquare, Plus, Check, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export const TodoView: React.FC = () => {
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

  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  let todoList = getVisibleLists().find((l) => l.type === 'todo');

  if (!todoList) {
    todoList = createList({
      title: 'To-Do Commune',
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
            <CheckSquare className="size-4 text-zinc-400" />
            To-Do Commune
          </h1>
          <p className="text-xs text-zinc-400">
            Tâches et projets partagés
          </p>
        </div>

        <Badge variant="secondary">
          {pendingItems.length} à faire
        </Badge>
      </div>

      {/* Saisie sobre */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-3 space-y-2">
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nouvelle tâche..."
              className="h-8"
            />
            <Button
              type="submit"
              disabled={!newTitle.trim()}
              size="sm"
              className="gap-1"
            >
              <Plus className="size-3.5" />
              <span>Ajouter</span>
            </Button>
          </form>

          {showDetails ? (
            <Input
              type="text"
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              placeholder="Note ou détail (optionnel)..."
              className="h-7 text-[11px]"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              + Ajouter une note
            </button>
          )}
        </CardContent>
      </Card>

      {/* Liste des tâches en cours */}
      <div className="space-y-1.5">
        {pendingItems.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xs">
            Aucune tâche en cours.
          </div>
        ) : (
          pendingItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-start justify-between p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer pt-0.5"
              >
                <div className="size-4.5 rounded border border-zinc-700 group-hover:border-zinc-500 bg-zinc-950 flex items-center justify-center transition-colors mt-0.5">
                  {item.is_completed && <Check className="size-3 text-zinc-200" />}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-zinc-200 block leading-tight">
                    {item.title}
                  </span>
                  {item.details && (
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {item.details}
                    </p>
                  )}
                  {item.created_by && (
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      par {getProfileName(item.created_by)}
                    </span>
                  )}
                </div>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteItem(item.id)}
                className="size-7 text-zinc-400 hover:text-zinc-200 shrink-0"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Tâches terminées */}
      {completedItems.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-zinc-400">
              Terminées ({completedItems.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearCompletedItems(todoList!.id)}
              className="text-zinc-400 hover:text-rose-400 text-[11px] h-6"
            >
              Effacer
            </Button>
          </div>

          <div className="space-y-1">
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
        </div>
      )}
    </div>
  );
};
