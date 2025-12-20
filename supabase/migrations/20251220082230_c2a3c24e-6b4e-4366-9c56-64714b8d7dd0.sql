-- Create storage bucket for presentations
INSERT INTO storage.buckets (id, name, public) 
VALUES ('presentations', 'presentations', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for presentations bucket
CREATE POLICY "Anyone can view presentations" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'presentations');

CREATE POLICY "Admins can upload presentations" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'presentations' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update presentations" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'presentations' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete presentations" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'presentations' AND public.is_admin(auth.uid()));