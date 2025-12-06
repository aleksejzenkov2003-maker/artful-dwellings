-- Add bio field to team_members for detailed biographies
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS bio TEXT;