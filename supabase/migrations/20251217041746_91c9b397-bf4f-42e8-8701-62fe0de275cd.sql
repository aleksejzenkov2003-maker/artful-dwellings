-- Add video_url column to team_members
ALTER TABLE team_members ADD COLUMN video_url TEXT;

-- Create storage bucket for team videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team-videos', 'team-videos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for public read access
CREATE POLICY "Public read access for team videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-videos');

-- RLS policy for authenticated uploads
CREATE POLICY "Authenticated users can upload team videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team-videos');

-- RLS policy for updates
CREATE POLICY "Authenticated users can update team videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'team-videos');

-- RLS policy for deletions
CREATE POLICY "Authenticated users can delete team videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'team-videos');