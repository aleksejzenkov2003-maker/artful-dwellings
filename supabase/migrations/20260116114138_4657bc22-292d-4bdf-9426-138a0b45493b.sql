-- Create homepage_content table for editable main page content
CREATE TABLE public.homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid REFERENCES public.cities(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(city_id, section_key)
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view published content
CREATE POLICY "Anyone can view published homepage content"
  ON public.homepage_content FOR SELECT
  USING (is_published = true);

-- Admins can manage all content
CREATE POLICY "Admins can manage homepage content"
  ON public.homepage_content FOR ALL
  USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();