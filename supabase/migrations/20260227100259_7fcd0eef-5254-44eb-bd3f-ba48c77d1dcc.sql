
-- Create awards table
CREATE TABLE public.awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_position INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- Public can view published awards
CREATE POLICY "Anyone can view published awards"
ON public.awards
FOR SELECT
USING (is_published = true);

-- Admins can manage all awards
CREATE POLICY "Admins can manage awards"
ON public.awards
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_awards_updated_at
BEFORE UPDATE ON public.awards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
