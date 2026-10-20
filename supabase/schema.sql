-- ========================================================
-- PINGPING - BASE DE DONNÉES SUPABASE (PostgreSQL)
-- Copier-coller ce script dans Supabase Dashboard > SQL Editor
-- ========================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table des Couples (le foyer / l'espace commun)
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Notre Espace',
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Table des Profils Utilisateurs (liés à Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES public.couples(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL DEFAULT 'Moi',
  avatar_color TEXT NOT NULL DEFAULT '#ec4899',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Table des Listes
-- visibility : 'shared' (visible par les 2) OU 'secret' (visible UNIQUEMENT par created_by)
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('groceries', 'todo', 'gifts', 'custom')),
  visibility TEXT NOT NULL CHECK (visibility IN ('shared', 'secret')),
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  icon TEXT DEFAULT 'ListTodo',
  color TEXT DEFAULT '#ec4899',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Table des Éléments de Liste
CREATE TABLE IF NOT EXISTS public.list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  details TEXT,
  category TEXT DEFAULT 'Autre',
  price_estimate NUMERIC(10, 2),
  url TEXT,
  image_url TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'ordered', 'wrapped')),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  position INT DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) - SÉCURITÉ STRICTE ANTI-SPOIL
-- ========================================================

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

-- Accès Couples : les membres du couple peuvent lire les infos de leur couple
CREATE POLICY "couples_read_policy" ON public.couples
FOR SELECT USING (
  id IN (SELECT couple_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "couples_insert_policy" ON public.couples
FOR INSERT WITH CHECK (true);

-- Accès Profils : tout utilisateur authentifié peut voir son profil et celui de son partenaire
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (
  couple_id IN (SELECT couple_id FROM public.profiles WHERE id = auth.uid())
  OR id = auth.uid()
);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (id = auth.uid());

-- ACCÈS LISTES (RÈGLE D'OR ANTI-SPOIL) :
-- Un utilisateur ne peut voir et modifier une liste que si :
-- 1. La liste est 'shared' ET appartient à son couple
-- 2. OU la liste est 'secret' ET il en est le créateur (created_by = auth.uid())
CREATE POLICY "lists_policy" ON public.lists
FOR ALL USING (
  (visibility = 'shared' AND couple_id IN (
    SELECT couple_id FROM public.profiles WHERE id = auth.uid()
  ))
  OR
  (visibility = 'secret' AND created_by = auth.uid())
);

-- ACCÈS LIST_ITEMS :
-- L'accès aux items hérite automatiquement de la sécurité de la liste parente.
CREATE POLICY "list_items_policy" ON public.list_items
FOR ALL USING (
  list_id IN (SELECT id FROM public.lists)
);

-- ========================================================
-- TEMPS RÉEL (Supabase Realtime)
-- ========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.lists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.list_items;

-- ========================================================
-- FONCTION D'APPAIRAGE (Rejoindre un couple avec un code)
-- ========================================================
CREATE OR REPLACE FUNCTION join_couple_by_code(code_input TEXT)
RETURNS UUID AS $$
DECLARE
  found_couple_id UUID;
BEGIN
  SELECT id INTO found_couple_id FROM public.couples WHERE UPPER(invite_code) = UPPER(TRIM(code_input));
  IF found_couple_id IS NULL THEN
    RAISE EXCEPTION 'Code de couple introuvable.';
  END IF;

  UPDATE public.profiles
  SET couple_id = found_couple_id
  WHERE id = auth.uid();

  RETURN found_couple_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
