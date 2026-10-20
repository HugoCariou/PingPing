import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShoppingCart, CheckSquare, Gift, Settings } from 'lucide-react';
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
    {
      id: 'groceries' as const,
      label: 'Courses',
      icon: ShoppingCart,
      badge: pendingGroceries,
    },
    {
      id: 'todo' as const,
      label: 'To-Do',
      icon: CheckSquare,
      badge: pendingTodos,
    },
    {
      id: 'gifts' as const,
      label: 'Coffre Secret',
      icon: Gift,
      badge: totalGifts,
    },
    {
      id: 'settings' as const,
      label: 'Paramètres',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/60 px-4 pt-2 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-all duration-150 select-none cursor-pointer',
                isActive
                  ? 'text-zinc-100 bg-zinc-900 border border-zinc-800/80 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              )}
            >
              <div className="relative">
                <IconComponent className="size-5 transition-colors" />

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/80 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-medium mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
