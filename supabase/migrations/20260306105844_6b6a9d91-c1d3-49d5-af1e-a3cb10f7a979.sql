CREATE TABLE public.complex_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complex_id uuid NOT NULL REFERENCES public.residential_complexes(id) ON DELETE CASCADE,
  slide_type text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  order_position integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.complex_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published slides"
  ON public.complex_slides FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage slides"
  ON public.complex_slides FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_complex_slides_updated_at
  BEFORE UPDATE ON public.complex_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();