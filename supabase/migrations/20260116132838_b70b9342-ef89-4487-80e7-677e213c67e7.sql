-- Add problem_blocks field to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS problem_blocks jsonb DEFAULT '[]'::jsonb;