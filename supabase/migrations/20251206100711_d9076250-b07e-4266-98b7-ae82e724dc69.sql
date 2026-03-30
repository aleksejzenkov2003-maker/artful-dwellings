-- Create company_stats table for dynamic statistics
CREATE TABLE public.company_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  order_position INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view published stats"
  ON public.company_stats
  FOR SELECT
  USING (is_published = true);

-- Add trigger for updated_at
CREATE TRIGGER update_company_stats_updated_at
  BEFORE UPDATE ON public.company_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo data
INSERT INTO public.company_stats (label, value, suffix, icon, order_position) VALUES
  ('Лет на рынке', '15', '+', 'calendar', 1),
  ('Довольных клиентов', '2500', '+', 'users', 2),
  ('Объектов в базе', '850', '+', 'building', 3),
  ('Успешных сделок', '4200', '+', 'check-circle', 4);