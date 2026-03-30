ALTER TABLE residential_complexes
ADD COLUMN IF NOT EXISTS page_content jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN residential_complexes.page_content IS
  'Structured JSON for full page content: hero, about, video, infrastructure, mortgage, faq, contacts';
