-- Create storage bucket for complex media (images and videos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complex-media', 'complex-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for complex-media bucket
CREATE POLICY "Anyone can view complex media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'complex-media');

CREATE POLICY "Admins can upload complex media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'complex-media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update complex media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'complex-media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete complex media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'complex-media' AND public.is_admin(auth.uid()));