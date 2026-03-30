
-- Helper function: can user write (INSERT/UPDATE)?
CREATE OR REPLACE FUNCTION public.can_write(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin', 'manager', 'content')
  )
$$;

-- Helper function: can user delete?
CREATE OR REPLACE FUNCTION public.can_delete(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin')
  )
$$;

-- Helper function: is any admin level (super_admin or admin)?
CREATE OR REPLACE FUNCTION public.is_any_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin')
  )
$$;

-- ============================================
-- Update RLS policies on contacts
-- ============================================
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
CREATE POLICY "Admins can manage contacts" ON public.contacts
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));

-- ============================================
-- Update RLS policies on apartments
-- ============================================
DROP POLICY IF EXISTS "Admins can manage apartments" ON public.apartments;
-- Full CRUD for admin+
CREATE POLICY "Admins can manage apartments" ON public.apartments
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
-- Writers (manager/content) can INSERT/UPDATE
CREATE POLICY "Writers can insert apartments" ON public.apartments
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write(auth.uid()));
CREATE POLICY "Writers can update apartments" ON public.apartments
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));
-- All authenticated with a role can SELECT
CREATE POLICY "Authenticated can view all apartments" ON public.apartments
  FOR SELECT TO authenticated
  USING (public.can_write(auth.uid()) OR public.is_viewer(auth.uid()));

-- ============================================
-- Update RLS policies on complex_slides
-- ============================================
DROP POLICY IF EXISTS "Admins can manage slides" ON public.complex_slides;
CREATE POLICY "Admins can manage slides" ON public.complex_slides
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE POLICY "Writers can insert slides" ON public.complex_slides
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write(auth.uid()));
CREATE POLICY "Writers can update slides" ON public.complex_slides
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));

-- ============================================
-- Update RLS policies on awards
-- ============================================
DROP POLICY IF EXISTS "Admins can manage awards" ON public.awards;
CREATE POLICY "Admins can manage awards" ON public.awards
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE POLICY "Writers can insert awards" ON public.awards
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write(auth.uid()));
CREATE POLICY "Writers can update awards" ON public.awards
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));

-- ============================================
-- Update RLS policies on timeline_events
-- ============================================
DROP POLICY IF EXISTS "Admins can manage timeline events" ON public.timeline_events;
CREATE POLICY "Admins can manage timeline events" ON public.timeline_events
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE POLICY "Writers can insert timeline events" ON public.timeline_events
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write(auth.uid()));
CREATE POLICY "Writers can update timeline events" ON public.timeline_events
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));

-- ============================================
-- Update RLS policies on homepage_content
-- ============================================
DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE POLICY "Writers can insert homepage content" ON public.homepage_content
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write(auth.uid()));
CREATE POLICY "Writers can update homepage content" ON public.homepage_content
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));

-- ============================================
-- Update RLS policies on complex_buildings
-- ============================================
DROP POLICY IF EXISTS "Admins can manage buildings" ON public.complex_buildings;
CREATE POLICY "Admins can manage buildings" ON public.complex_buildings
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE POLICY "Writers can insert buildings" ON public.complex_buildings
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write(auth.uid()));
CREATE POLICY "Writers can update buildings" ON public.complex_buildings
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));

-- ============================================
-- Update RLS on leads: allow content role to view
-- ============================================
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Staff can view leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.can_write(auth.uid()) OR public.is_viewer(auth.uid()));

DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Staff can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.can_write(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated
  USING (public.can_delete(auth.uid()));

-- ============================================
-- Update RLS on profiles: allow any admin to view all
-- ============================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_any_admin(auth.uid()));

-- ============================================
-- Update audit_logs: allow admin to SELECT too
-- ============================================
DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_any_admin(auth.uid()));
