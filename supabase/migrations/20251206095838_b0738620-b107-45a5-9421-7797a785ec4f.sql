-- Create cities table
CREATE TABLE public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  country text DEFAULT 'Россия',
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  order_position integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Policy for cities (public read)
CREATE POLICY "Anyone can view active cities" ON public.cities
  FOR SELECT USING (is_active = true);

-- Create contacts table for city-specific contact info
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  phone text NOT NULL,
  phone_secondary text,
  email text,
  address text,
  working_hours text,
  coordinates jsonb,
  whatsapp text,
  telegram text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Policy for contacts (public read)
CREATE POLICY "Anyone can view contacts" ON public.contacts
  FOR SELECT USING (true);

-- Add city_id to residential_complexes
ALTER TABLE public.residential_complexes 
ADD COLUMN city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL;

-- Add city_id to team_members
ALTER TABLE public.team_members
ADD COLUMN city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL;

-- Create index for faster filtering
CREATE INDEX idx_residential_complexes_city ON public.residential_complexes(city_id);
CREATE INDEX idx_team_members_city ON public.team_members(city_id);
CREATE INDEX idx_contacts_city ON public.contacts(city_id);