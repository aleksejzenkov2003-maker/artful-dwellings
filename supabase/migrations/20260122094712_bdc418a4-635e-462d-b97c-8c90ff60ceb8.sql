-- 1. Add broker_id to leads table for broker-specific leads
ALTER TABLE public.leads ADD COLUMN broker_id uuid REFERENCES public.team_members(id) ON DELETE SET NULL;

-- 2. Create broker_reviews table for agent-specific reviews
CREATE TABLE public.broker_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_role text DEFAULT 'Клиент',
  author_photo text,
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.broker_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policy for broker_reviews - full access for now (admin panel development)
CREATE POLICY "Full access to broker_reviews" ON public.broker_reviews
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_broker_reviews_broker_id ON public.broker_reviews(broker_id);
CREATE INDEX idx_leads_broker_id ON public.leads(broker_id);