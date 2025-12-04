-- ===== RESIDENTIAL COMPLEXES (ЖК) =====
CREATE TABLE public.residential_complexes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  address TEXT,
  district TEXT,
  city TEXT DEFAULT 'Санкт-Петербург',
  coordinates JSONB, -- { lat: number, lng: number }
  price_from NUMERIC,
  price_to NUMERIC,
  status TEXT DEFAULT 'building', -- 'building', 'completed', 'selling'
  completion_date DATE,
  developer TEXT,
  floors_count INTEGER,
  apartments_count INTEGER,
  area_from NUMERIC,
  area_to NUMERIC,
  features JSONB DEFAULT '[]'::jsonb, -- array of features
  infrastructure JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb, -- array of image URLs
  main_image TEXT,
  presentation_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.residential_complexes ENABLE ROW LEVEL SECURITY;

-- Public read access for published complexes
CREATE POLICY "Anyone can view published complexes" 
ON public.residential_complexes 
FOR SELECT 
USING (is_published = true);

-- ===== SERVICES (УСЛУГИ) =====
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  icon TEXT,
  main_image TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  order_position INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published services" 
ON public.services 
FOR SELECT 
USING (is_published = true);

-- ===== TEAM MEMBERS (КОМАНДА) =====
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  order_position INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published team members" 
ON public.team_members 
FOR SELECT 
USING (is_published = true);

-- ===== REVIEWS (ОТЗЫВЫ) =====
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Клиент Art Estate',
  author_photo TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published reviews" 
ON public.reviews 
FOR SELECT 
USING (is_published = true);

-- ===== BLOG POSTS (СТАТЬИ/НОВОСТИ) =====
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'news', -- 'news', 'article', 'analytics'
  tags JSONB DEFAULT '[]'::jsonb,
  author_name TEXT,
  views_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

-- ===== LEADS (ЗАЯВКИ) =====
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  form_type TEXT NOT NULL, -- 'callback', 'quiz', 'consultation', 'tour', 'partner'
  form_source TEXT, -- page URL
  quiz_answers JSONB,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'processing', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads can be inserted by anyone (for form submissions)
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- ===== PROMOTIONS/AKCII =====
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  cover_image TEXT,
  category TEXT, -- 'discount', 'parking', 'mortgage', 'other'
  start_date DATE,
  end_date DATE,
  complexes JSONB DEFAULT '[]'::jsonb, -- array of complex IDs
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published promotions" 
ON public.promotions 
FOR SELECT 
USING (is_published = true AND is_active = true);

-- ===== UPDATED_AT TRIGGER =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_residential_complexes_updated_at
  BEFORE UPDATE ON public.residential_complexes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();