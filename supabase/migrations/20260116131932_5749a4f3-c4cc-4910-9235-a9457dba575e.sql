-- Add new fields to services table for the new design
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS featured_text text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS intro_text text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS advantages jsonb DEFAULT '[]'::jsonb;