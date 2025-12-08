-- Drop restrictive policies and add permissive ones for admin tables during development
DROP POLICY IF EXISTS "Admins can manage company_stats" ON public.company_stats;
DROP POLICY IF EXISTS "Anyone can view published stats" ON public.company_stats;

-- Allow all operations on company_stats for development
CREATE POLICY "Full access to company_stats" 
ON public.company_stats 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Same for other admin tables
DROP POLICY IF EXISTS "Admins can manage residential_complexes" ON public.residential_complexes;
DROP POLICY IF EXISTS "Anyone can view published complexes" ON public.residential_complexes;

CREATE POLICY "Full access to residential_complexes" 
ON public.residential_complexes 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;

CREATE POLICY "Full access to blog_posts" 
ON public.blog_posts 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage promotions" ON public.promotions;
DROP POLICY IF EXISTS "Anyone can view published promotions" ON public.promotions;

CREATE POLICY "Full access to promotions" 
ON public.promotions 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view published services" ON public.services;

CREATE POLICY "Full access to services" 
ON public.services 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage team_members" ON public.team_members;
DROP POLICY IF EXISTS "Anyone can view published team members" ON public.team_members;

CREATE POLICY "Full access to team_members" 
ON public.team_members 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view published reviews" ON public.reviews;

CREATE POLICY "Full access to reviews" 
ON public.reviews 
FOR ALL 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage cities" ON public.cities;
DROP POLICY IF EXISTS "Anyone can view active cities" ON public.cities;

CREATE POLICY "Full access to cities" 
ON public.cities 
FOR ALL 
USING (true)
WITH CHECK (true);