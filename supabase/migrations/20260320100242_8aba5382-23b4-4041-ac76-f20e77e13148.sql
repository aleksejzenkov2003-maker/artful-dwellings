
-- 1. Add new enum values to app_role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';
