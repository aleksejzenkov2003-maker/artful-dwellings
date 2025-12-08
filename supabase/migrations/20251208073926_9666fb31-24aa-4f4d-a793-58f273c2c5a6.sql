-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user metadata
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Create trigger for profiles auto-creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add admin policies for all content tables
-- residential_complexes
CREATE POLICY "Admins can manage residential_complexes"
ON public.residential_complexes FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- blog_posts
CREATE POLICY "Admins can manage blog_posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- promotions
CREATE POLICY "Admins can manage promotions"
ON public.promotions FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- services
CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- team_members
CREATE POLICY "Admins can manage team_members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- reviews
CREATE POLICY "Admins can manage reviews"
ON public.reviews FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- leads (admins can view and update)
CREATE POLICY "Admins can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update leads"
ON public.leads FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete leads"
ON public.leads FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- company_stats
CREATE POLICY "Admins can manage company_stats"
ON public.company_stats FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- cities
CREATE POLICY "Admins can manage cities"
ON public.cities FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- contacts
CREATE POLICY "Admins can manage contacts"
ON public.contacts FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();