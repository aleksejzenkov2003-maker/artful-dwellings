-- Add hover_text field to services table for hover overlay content
ALTER TABLE services ADD COLUMN IF NOT EXISTS hover_text text;