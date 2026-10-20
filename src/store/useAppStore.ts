import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import type { 
  Couple, 
  Profile, 
  List, 
  ListItem, 
  ListType, 
  ListVisibility, 
  GiftStatus,
  GroceryCategory 
} from '../types';
import { initialCouple, initialProfiles, initialLists, initialItems } from '../data/mockData';

interface AppState {
  // Profil & Couple
  couple: Couple;
  profiles: Profile[];
  currentUserId: string;
  isOnline: boolean;

  // Données
  lists: List[];
  items: ListItem[];

  // Filtres actifs
  activeTab: 'groceries' | 'todo' | 'gifts' | 'settings';
  selectedGroceryCategory: GroceryCategory | 'Toutes';

  // Actions Utilisateur
  setCurrentUser: (userId: string) => void;
  setActiveTab: (tab: 'groceries' | 'todo' | 'gifts' | 'settings') => void;
  setSelectedGroceryCategory: (cat: GroceryCategory | 'Toutes') => void;
  updateCoupleName: (name: string) => void;
  updateProfileName: (userId: string, newName: string) => void;

  // Actions Listes
  createList: (params: {
    title: string;
    type: ListType;
    visibility: ListVisibility;
    targetUserId?: string;
    icon?: string;
    color?: string;
  }) => List;
  deleteList: (listId: string) => void;

  // Actions Items
  addItem: (params: {
    listId: string;
    title: string;
    details?: string;
    category?: string;
    priceEstimate?: number;
    url?: string;
  }) => void;
  toggleItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  clearCompletedItems: (listId: string) => void;
  updateGiftStatus: (itemId: string, status: GiftStatus) => void;

  // Sélecteurs
  getVisibleLists: () => List[];
  getCurrentProfile: () => Profile;
  getPartnerProfile: () => Profile | undefined;
  getItemsForList: (listId: string) => ListItem[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      couple: initialCouple,
      profiles: initialProfiles,
      currentUserId: 'user-1',
      isOnline: navigator.onLine,
      lists: initialLists,
      items: initialItems,
      activeTab: 'groceries',
      selectedGroceryCategory: 'Toutes',

      setCurrentUser: (userId) => set({ currentUserId: userId }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedGroceryCategory: (cat) => set({ selectedGroceryCategory: cat }),

      updateCoupleName: (name) =>
        set((state) => ({
          couple: { ...state.couple, name },
        })),

      updateProfileName: (userId, newName) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === userId ? { ...p, display_name: newName } : p
          ),
        })),

      createList: ({ title, type, visibility, targetUserId, icon, color }) => {
        const { currentUserId, couple } = get();
        const newList: List = {
          id: `list-${Date.now()}`,
          couple_id: couple.id,
          created_by: currentUserId,
          title,
          type,
          visibility,
          target_user_id: targetUserId,
          icon: icon || (type === 'gifts' ? 'Gift' : type === 'groceries' ? 'ShoppingCart' : 'CheckSquare'),
          color: color || (type === 'gifts' ? '#f43f5e' : type === 'groceries' ? '#10b981' : '#8b5cf6'),
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          lists: [newList, ...state.lists],
        }));

        return newList;
      },

      deleteList: (listId) =>
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== listId),
          items: state.items.filter((item) => item.list_id !== listId),
        })),

      addItem: ({ listId, title, details, category, priceEstimate, url }) => {
        const { currentUserId } = get();
        const newItem: ListItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          list_id: listId,
          title: title.trim(),
          details: details?.trim() || undefined,
          category: category || 'Autre',
          price_estimate: priceEstimate,
          url: url?.trim() || undefined,
          status: 'pending',
          is_completed: false,
          created_by: currentUserId,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          items: [newItem, ...state.items],
        }));
      },

      toggleItem: (itemId) => {
        const { items, currentUserId } = get();
        const target = items.find((i) => i.id === itemId);
        if (!target) return;

        const nextCompleted = !target.is_completed;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  is_completed: nextCompleted,
                  completed_by: nextCompleted ? currentUserId : undefined,
                  completed_at: nextCompleted ? new Date().toISOString() : undefined,
                }
              : item
          ),
        }));

        // Petite pluie de confettis joyeux si on coche un élément
        if (nextCompleted) {
          try {
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.85 },
              colors: ['#ec4899', '#f43f5e', '#a855f7', '#10b981'],
              disableForReducedMotion: true,
            });
          } catch {
            // Pas d'erreur si confetti non dispo
          }
        }
      },

      deleteItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      clearCompletedItems: (listId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.list_id === listId && item.is_completed)
          ),
        })),

      updateGiftStatus: (itemId, status) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status,
                  is_completed: status === 'wrapped',
                }
              : item
          ),
        })),

      // Sélecteurs
      getVisibleLists: () => {
        const { lists, currentUserId } = get();
        return lists.filter((list) => {
          // Si partagée, accessible aux deux membres
          if (list.visibility === 'shared') return true;
          // Si secrète, SEUL le créateur a le droit de la voir (Anti-spoil garanti)
          if (list.visibility === 'secret') {
            return list.created_by === currentUserId;
          }
          return false;
        });
      },

      getCurrentProfile: () => {
        const { profiles, currentUserId } = get();
        return profiles.find((p) => p.id === currentUserId) || profiles[0];
      },

      getPartnerProfile: () => {
        const { profiles, currentUserId } = get();
        return profiles.find((p) => p.id !== currentUserId);
      },

      getItemsForList: (listId) => {
        const { items } = get();
        return items.filter((i) => i.list_id === listId);
      },
    }),
    {
      name: 'pingping-couple-storage-v2',
    }
  )
);
