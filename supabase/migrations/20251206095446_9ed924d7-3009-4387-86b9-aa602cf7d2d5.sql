-- Add source fields to reviews table
ALTER TABLE public.reviews 
ADD COLUMN source text DEFAULT NULL,
ADD COLUMN source_url text DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.reviews.source IS 'Source platform: yandex, google, cian, avito, etc.';
COMMENT ON COLUMN public.reviews.source_url IS 'Direct URL to the review on the source platform';