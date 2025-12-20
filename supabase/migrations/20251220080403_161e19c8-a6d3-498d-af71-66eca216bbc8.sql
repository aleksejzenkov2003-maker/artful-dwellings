-- Create apartments table for residential complexes
CREATE TABLE public.apartments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complex_id UUID NOT NULL REFERENCES public.residential_complexes(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL CHECK (room_type IN ('studio', '1', '2', '3', '4', '5+')),
  area NUMERIC NOT NULL,
  floor INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  layout_image TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

-- Create policies - anyone can view published apartments
CREATE POLICY "Anyone can view published apartments"
ON public.apartments
FOR SELECT
USING (is_published = true);

-- Admins can manage all apartments
CREATE POLICY "Admins can manage apartments"
ON public.apartments
FOR ALL
USING (public.is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_apartments_complex_id ON public.apartments(complex_id);
CREATE INDEX idx_apartments_room_type ON public.apartments(room_type);
CREATE INDEX idx_apartments_status ON public.apartments(status);

-- Add trigger for updated_at
CREATE TRIGGER update_apartments_updated_at
BEFORE UPDATE ON public.apartments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();