export type ListType = 'groceries' | 'todo' | 'gifts' | 'custom';
export type ListVisibility = 'shared' | 'secret';
export type GiftStatus = 'pending' | 'ordered' | 'received' | 'wrapped';

export type GroceryCategory =
  | 'Fruits & Légumes'
  | 'Frais & Crémerie'
  | 'Viandes & Poissons'
  | 'Épicerie'
  | 'Boulangerie'
  | 'Boissons'
  | 'Entretien & Hygiène'
  | 'Surgelés'
  | 'Autre';

export interface Couple {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface Profile {
  id: string;
  couple_id: string | null;
  display_name: string;
  avatar_color: string;
  created_at?: string;
}

export interface ListItem {
  id: string;
  list_id: string;
  title: string;
  details?: string;
  category?: GroceryCategory | string;
  price_estimate?: number;
  url?: string;
  image_url?: string;
  due_date?: string;
  status?: GiftStatus;
  is_completed: boolean;
  completed_by?: string;
  completed_at?: string;
  position?: number;
  created_by?: string;
  created_at: string;
}

export interface List {
  id: string;
  couple_id: string;
  created_by: string;
  title: string;
  type: ListType;
  visibility: ListVisibility;
  target_user_id?: string; // id de la personne pour qui la surprise est faite si visibility === 'secret'
  icon?: string;
  color?: string;
  created_at: string;
  items?: ListItem[];
}
