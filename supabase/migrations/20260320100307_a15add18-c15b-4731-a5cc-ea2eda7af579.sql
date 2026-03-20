
-- 2. Create audit_logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view logs
CREATE POLICY "Super admins can view audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- System can insert logs (via trigger functions running as SECURITY DEFINER)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- 3. Helper functions
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_manager(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'manager')
$$;

CREATE OR REPLACE FUNCTION public.is_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'content')
$$;

CREATE OR REPLACE FUNCTION public.is_viewer(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'viewer')
$$;

-- 4. Get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role::text FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'manager' THEN 3
    WHEN 'content' THEN 4
    WHEN 'viewer' THEN 5
    ELSE 6
  END
  LIMIT 1
$$;

-- 5. Audit trigger function
CREATE OR REPLACE FUNCTION public.log_audit_action()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _user_id uuid;
  _user_email text;
  _action text;
  _record_id text;
BEGIN
  _user_id := auth.uid();
  SELECT email INTO _user_email FROM auth.users WHERE id = _user_id;

  IF TG_OP = 'INSERT' THEN
    _action := 'create';
    _record_id := NEW.id::text;
    INSERT INTO public.audit_logs (user_id, user_email, action, table_name, record_id, new_data)
    VALUES (_user_id, _user_email, _action, TG_TABLE_NAME, _record_id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    _action := 'update';
    _record_id := NEW.id::text;
    INSERT INTO public.audit_logs (user_id, user_email, action, table_name, record_id, old_data, new_data)
    VALUES (_user_id, _user_email, _action, TG_TABLE_NAME, _record_id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    _action := 'delete';
    _record_id := OLD.id::text;
    INSERT INTO public.audit_logs (user_id, user_email, action, table_name, record_id, old_data)
    VALUES (_user_id, _user_email, _action, TG_TABLE_NAME, _record_id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 6. Attach audit triggers to key tables
CREATE TRIGGER audit_residential_complexes AFTER INSERT OR UPDATE OR DELETE ON public.residential_complexes FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_blog_posts AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_promotions AFTER INSERT OR UPDATE OR DELETE ON public.promotions FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_services AFTER INSERT OR UPDATE OR DELETE ON public.services FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_team_members AFTER INSERT OR UPDATE OR DELETE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_reviews AFTER INSERT OR UPDATE OR DELETE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_leads AFTER INSERT OR UPDATE OR DELETE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_apartments AFTER INSERT OR UPDATE OR DELETE ON public.apartments FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_cities AFTER INSERT OR UPDATE OR DELETE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_awards AFTER INSERT OR UPDATE OR DELETE ON public.awards FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_timeline_events AFTER INSERT OR UPDATE OR DELETE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_homepage_content AFTER INSERT OR UPDATE OR DELETE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();

-- 7. Update user_roles RLS to allow super_admin full management
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
