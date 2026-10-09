-- ========================================================
-- MARTINIQUE EXPLORER - SCHEMA SQL SUPABASE
-- À exécuter dans le menu "SQL Editor" de votre tableau de bord Supabase
-- ========================================================

-- 1. Table des profils utilisateurs (complément d'auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'member', -- 'member' ou 'admin'
  avatar_url TEXT,
  points INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les profils sont visibles par tous" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Trigger automatique à la création d'un utilisateur Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    CASE 
      WHEN new.email ILIKE '%admin%' OR new.email ILIKE '%papa%' THEN 'admin'
      ELSE 'member'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Table des Lieux / Spots (Plages, Hôtels, Activités, Restaurants...)
CREATE TABLE IF NOT EXISTS public.places (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  commune TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating NUMERIC DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  is_hidden_gem BOOLEAN DEFAULT false,
  crowd_level TEXT DEFAULT 'Modérée',
  parking TEXT DEFAULT 'Facile et gratuit',
  toilets BOOLEAN DEFAULT false,
  restaurants_nearby BOOLEAN DEFAULT false,
  website TEXT,
  phone TEXT,
  address TEXT,
  schedules TEXT,
  price_range TEXT DEFAULT '€€',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les lieux" 
  ON public.places FOR SELECT USING (true);

CREATE POLICY "Seuls les utilisateurs authentifiés peuvent modifier" 
  ON public.places FOR ALL USING (auth.role() = 'authenticated');
