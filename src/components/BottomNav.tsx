import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShoppingCart, CheckSquare, Lock, Settings } from 'lucide-react';
import { cn } from './ui/button';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, getVisibleLists, getItemsForList } = useAppStore();

  const visibleLists = getVisibleLists();
  const groceryList = visibleLists.find((l) => l.type === 'groceries');
  const todoList = visibleLists.find((l) => l.type === 'todo');
  const secretGiftLists = visibleLists.filter((l) => l.type === 'gifts' && l.visibility === 'secret');

  const pendingGroceries = groceryList
    ? getItemsForList(groceryList.id).filter((i) => !i.is_completed).length
    : 0;

  const pendingTodos = todoList
    ? getItemsForList(todoList.id).filter((i) => !i.is_completed).length
    : 0;

  const totalGifts = secretGiftLists.reduce(
    (acc, l) => acc + getItemsForList(l.id).length,
    0
  );

  const navItems = [
    { id: 'groceries' as const, label: 'Courses', icon: ShoppingCart, badge: pendingGroceries },
    { id: 'todo' as const, label: 'Tâches', icon: CheckSquare, badge: pendingTodos },
    { id: 'gifts' as const, label: 'Secrets', icon: Lock, badge: totalGifts },
    { id: 'settings' as const, label: 'Réglages', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur border-t border-zinc-800/60 px-4 pt-1.5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors cursor-pointer',
                isActive
                  ? 'text-zinc-100 bg-zinc-900 border border-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <div className="relative">
                <Icon className="size-4.5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full text-[9px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
