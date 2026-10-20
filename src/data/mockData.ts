import type { Couple, Profile, List, ListItem } from '../types';

export const initialCouple: Couple = {
  id: 'couple-ping-01',
  name: 'Notre Espace 🌿',
  invite_code: 'DUO-742',
  created_at: new Date().toISOString(),
};

export const initialProfiles: Profile[] = [
  {
    id: 'user-1',
    couple_id: 'couple-ping-01',
    display_name: 'Alex',
    avatar_color: '#71717a', // Zinc élégant neutre
  },
  {
    id: 'user-2',
    couple_id: 'couple-ping-01',
    display_name: 'Sam',
    avatar_color: '#a1a1aa', // Zinc clair neutre
  },
];

export const initialLists: List[] = [
  {
    id: 'list-groceries',
    couple_id: 'couple-ping-01',
    created_by: 'user-1',
    title: 'Courses de la semaine',
    type: 'groceries',
    visibility: 'shared',
    icon: 'ShoppingCart',
    color: '#10b981',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'list-todo',
    couple_id: 'couple-ping-01',
    created_by: 'user-2',
    title: 'To-Do Partagée',
    type: 'todo',
    visibility: 'shared',
    icon: 'CheckSquare',
    color: '#6366f1',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'list-gifts-for-sam',
    couple_id: 'couple-ping-01',
    created_by: 'user-1', // Créé par Alex pour Sam -> SEUL Alex le voit !
    title: 'Surprises pour Sam',
    type: 'gifts',
    visibility: 'secret',
    target_user_id: 'user-2',
    icon: 'Gift',
    color: '#e11d48',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'list-gifts-for-alex',
    couple_id: 'couple-ping-01',
    created_by: 'user-2', // Créé par Sam pour Alex -> SEUL Sam le voit !
    title: 'Surprises pour Alex',
    type: 'gifts',
    visibility: 'secret',
    target_user_id: 'user-1',
    icon: 'Sparkles',
    color: '#d946ef',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export const initialItems: ListItem[] = [
  // Items Courses
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
    title: 'Parmesan 24 mois',
    category: 'Frais & Crémerie',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-g-3',
    list_id: 'list-groceries',
    title: 'Café en grains',
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
    title: 'Pain complet',
    category: 'Boulangerie',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },

  // Items To-Do
  {
    id: 'item-t-1',
    list_id: 'list-todo',
    title: 'Réserver le restaurant pour samedi soir',
    details: 'Vérifier s\'il reste de la place en terrasse',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-t-2',
    list_id: 'list-todo',
    title: 'Prendre les billets de train pour le week-end',
    details: 'Départ vendredi 18h',
    is_completed: true,
    completed_by: 'user-1',
    completed_at: new Date().toISOString(),
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-t-3',
    list_id: 'list-todo',
    title: 'Rempoter les plantes du salon',
    is_completed: false,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },

  // Items Cadeaux Alex -> Sam (Secret)
  {
    id: 'item-gift-sam-1',
    list_id: 'list-gifts-for-sam',
    title: 'Week-end détente au calme',
    details: 'Maison d\'hôtes avec vue nature',
    price_estimate: 240,
    status: 'ordered',
    url: 'https://example.com/weekend',
    is_completed: false,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-gift-sam-2',
    list_id: 'list-gifts-for-sam',
    title: 'Livre de photographie d\'art',
    details: 'Édition reliée grand format',
    price_estimate: 55,
    status: 'pending',
    is_completed: false,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
  },

  // Items Cadeaux Sam -> Alex (Secret)
  {
    id: 'item-gift-alex-1',
    list_id: 'list-gifts-for-alex',
    title: 'Casque audio sans fil haute fidélité',
    details: 'Finition noir mat',
    price_estimate: 290,
    status: 'pending',
    url: 'https://example.com/audio',
    is_completed: false,
    created_by: 'user-2',
    created_at: new Date().toISOString(),
  },
];
