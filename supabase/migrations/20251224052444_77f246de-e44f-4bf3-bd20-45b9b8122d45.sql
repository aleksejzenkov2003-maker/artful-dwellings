-- Update storage policies to allow authenticated users to upload (admin panel is already protected)
DROP POLICY IF EXISTS "Admins can upload complex media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update complex media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete complex media" ON storage.objects;

-- Create new permissive policies for authenticated users
CREATE POLICY "Authenticated users can upload complex media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'complex-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update complex media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'complex-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete complex media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'complex-media' AND auth.role() = 'authenticated');