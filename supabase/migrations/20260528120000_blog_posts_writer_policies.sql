-- Allow content team to manage blog posts (insert/update/select drafts)
DROP POLICY IF EXISTS "Full access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage blog_posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (public.is_any_admin(auth.uid()))
WITH CHECK (public.is_any_admin(auth.uid()));

CREATE POLICY "Writers can insert blog_posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.can_write(auth.uid()));

CREATE POLICY "Writers can update blog_posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.can_write(auth.uid()));

CREATE POLICY "Writers can view all blog_posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (public.can_write(auth.uid()) OR public.is_viewer(auth.uid()));

CREATE POLICY "Admins can delete blog_posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.can_delete(auth.uid()));
