import type { Couple, Profile, List, ListItem } from '../types';

export const initialCouple: Couple = {
  id: 'couple-ping-01',
  name: 'Notre Espace',
  invite_code: 'DUO-742',
  created_at: new Date().toISOString(),
};

export const initialProfiles: Profile[] = [
  {
    id: 'user-1',
    couple_id: 'couple-ping-01',
    display_name: 'Alex',
    avatar_color: '#71717a',
    pin: undefined,
  },
  {
    id: 'user-2',
    couple_id: 'couple-ping-01',
    display_name: 'Sam',
    avatar_color: '#a1a1aa',
    pin: undefined,
  },
];

export const initialLists: List[] = [
  {
    id: 'list-groceries',
    couple_id: 'couple-ping-01',
    created_by: 'user-1',
    title: 'Courses',
    type: 'groceries',
    visibility: 'shared',
    icon: 'ShoppingCart',
    color: '#71717a',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'list-todo',
    couple_id: 'couple-ping-01',
    created_by: 'user-2',
    title: 'Tâches',
    type: 'todo',
    visibility: 'shared',
    icon: 'CheckSquare',
    color: '#71717a',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'list-gifts-for-sam',
    couple_id: 'couple-ping-01',
    created_by: 'user-1',
    title: 'Pour Sam',
    type: 'gifts',
    visibility: 'secret',
    target_user_id: 'user-2',
    icon: 'Gift',
    color: '#71717a',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'list-gifts-for-alex',
    couple_id: 'couple-ping-01',
    created_by: 'user-2',
    title: 'Pour Alex',
    type: 'gifts',
    visibility: 'secret',
    target_user_id: 'user-1',
    icon: 'Gift',
    color: '#71717a',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export const initialItems: ListItem[] = [
  // Courses
  {
    id: 'item-g-1',
    list_id: 'list-groceries',
    title: 'Avocats',
    category: 'Fruits & Légumes',
    is_completed: false,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-g-2',
    list_id: 'list-groceries',
    title: 'Parmesan',
    category: 'Frais & Crémerie',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-g-3',
    list_id: 'list-groceries',
    title: 'Café grains',
    category: 'Épicerie',
    is_completed: true,
    completed_by: 'user-1',
    completed_at: new Date().toISOString(),
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-g-4',
    list_id: 'list-groceries',
    title: 'Pain',
    category: 'Boulangerie',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },

  // Tâches
  {
    id: 'item-t-1',
    list_id: 'list-todo',
    title: 'Réservation train',
    details: 'Vendredi soir',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-t-2',
    list_id: 'list-todo',
    title: 'Restaurant samedi',
    is_completed: true,
    completed_by: 'user-1',
    completed_at: new Date().toISOString(),
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },

  // Cadeaux
  {
    id: 'item-gift-sam-1',
    list_id: 'list-gifts-for-sam',
    title: 'Livre photo',
    details: 'Édition reliée',
    price_estimate: 45,
    status: 'ordered',
    url: 'https://example.com/item',
    is_completed: false,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-gift-sam-2',
    list_id: 'list-gifts-for-sam',
    title: 'Casque audio',
    price_estimate: 180,
    status: 'pending',
    is_completed: false,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },
];
