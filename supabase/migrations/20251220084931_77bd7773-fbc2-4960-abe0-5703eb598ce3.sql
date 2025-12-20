-- Add content_blocks field to services table for rich content editing
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;