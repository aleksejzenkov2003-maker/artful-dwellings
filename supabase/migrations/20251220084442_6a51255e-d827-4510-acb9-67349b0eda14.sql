-- Add fields to team_members for personal pages
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS telegram text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS experience_years integer,
ADD COLUMN IF NOT EXISTS specialization text[];

-- Create broker_apartments junction table
CREATE TABLE IF NOT EXISTS public.broker_apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  apartment_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(broker_id, apartment_id)
);

-- Create broker_complexes junction table
CREATE TABLE IF NOT EXISTS public.broker_complexes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  complex_id uuid NOT NULL REFERENCES public.residential_complexes(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(broker_id, complex_id)
);

-- Enable RLS
ALTER TABLE public.broker_apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_complexes ENABLE ROW LEVEL SECURITY;

-- RLS policies for broker_apartments
CREATE POLICY "Anyone can view broker apartments" 
ON public.broker_apartments 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage broker apartments" 
ON public.broker_apartments 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS policies for broker_complexes
CREATE POLICY "Anyone can view broker complexes" 
ON public.broker_complexes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage broker complexes" 
ON public.broker_complexes 
FOR ALL 
USING (is_admin(auth.uid()));