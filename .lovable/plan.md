

## Plan: Redesign Residential Complex Detail Page

Based on the reference screenshots, the page needs a major restructure with a new concept slider, updated navigation, and layout changes. The key new feature is a **concept slider** (Архитектура, Благоустройство, Двор, Арт-объекты, Wellness) that is per-complex and admin-editable.

---

### 1. Database: New `complex_slides` table

Create a table to store per-complex slides:

```sql
CREATE TABLE public.complex_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complex_id uuid NOT NULL REFERENCES public.residential_complexes(id) ON DELETE CASCADE,
  slide_type text NOT NULL, -- e.g. 'architecture', 'landscaping', 'courtyard', 'art_objects', 'wellness'
  title text NOT NULL,
  description text,
  image_url text,
  order_position integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.complex_slides ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view published slides"
  ON public.complex_slides FOR SELECT
  USING (is_published = true);

-- Admin write
CREATE POLICY "Admins can manage slides"
  ON public.complex_slides FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
```

### 2. New Component: `ComplexConceptSlider.tsx`

A full-width slider section with:
- Arrow navigation (left/right) to cycle through slides
- Background image changes on slide change with crossfade transition
- Overlaid text card (title + description) on the left side, like in image-289
- Counter "1 — 4" top-left
- Only renders slides that exist for this complex
- Fetches from `complex_slides` table filtered by `complex_id`

### 3. Updated Navigation: `ComplexNavigation.tsx`

Change tabs to match reference (image-288):
- "О проекте" | "Инфраструктура" | "Планировки" | "3d панорама" | "Рассрочка / ипотека" | "Вопрос-ответ"

### 4. Updated Hero: `ComplexHero.tsx`

Match reference (image-287):
- Keep full-width background image with dark overlay
- Left side: "Назад в каталог" link, "ЖИЛОЙ КОМПЛЕКС" label, complex name, description, "СКАЧАТЬ ПРЕЗЕНТАЦИЮ" button
- Right side: award badge area, completion info grid (Сдача, Город, Адрес, Метро)

### 5. Updated Details Section: Stats Grid

Match reference (image-288): large numbers layout:
- "6 корпусов" | "368 квартир" | "20-80 площадь квартир (м²)" | "2,5-4 высота потолков (м)"
- Below: "Видео о проекте" play button with accent line

### 6. Updated Building Selector

- Building labels ("Корпус 1", "Корпус 2", etc.) overlaid on photo
- Highlight color: `#BA846E` or light blue as specified
- Below: "НЕ СМОГЛИ НАЙТИ ПОДХОДЯЩУЮ КВАРТИРУ?" CTA banner (image-290)

### 7. Updated Location Section

Match reference (image-291):
- Left side: "ЛОКАЦИЯ" label, description text, distance grid (3 мин / 5 мин / 7 мин / 10 мин with labels)
- Right side: stylized map placeholder (dark background)

### 8. Updated Advantages ("Плюсы") Section

Match reference (image-292):
- "ПЛЮСЫ" label left-aligned, description text right
- Horizontal scrollable cards with images + titles + descriptions
- Full-width panoramic image below

### 9. Admin: Slides Management Tab in `AdminComplexEdit.tsx`

Add a new tab "Слайды" to manage concept slides per complex:
- CRUD for slides (title, description, image, slide_type, order)
- Image upload via `SingleImageUploader`
- Predefined slide types: Архитектура, Благоустройство, Двор, Арт-объекты, Wellness

### 10. Page Structure (new order)

```
<ComplexHero />           -- image-287
<ComplexNavigation />     -- image-288 tabs
<ComplexStatsGrid />      -- image-288 stats + video button
<ComplexDescription />    -- image-288 concept text + photo
<ComplexConceptSlider />  -- image-289 architecture slider
<BuildingSelector />      -- image-290
<ComplexApartments />     -- planировки section
<ComplexLocation />       -- image-291
<ComplexAdvantages />     -- image-292
<ComplexQuizBanner />
<ComplexExcursionForm />
```

### Files Changed
- **New migration** — `complex_slides` table
- **New** `src/hooks/useComplexSlides.ts` — fetch slides by complex_id
- **New** `src/components/complex/ComplexConceptSlider.tsx` — slider component
- **Rewrite** `src/components/complex/ComplexHero.tsx` — match reference layout
- **Rewrite** `src/components/complex/ComplexNavigation.tsx` — new tab labels
- **Rewrite** `src/components/complex/ComplexDetails.tsx` — large stats grid
- **Rewrite** `src/components/complex/ComplexLocation.tsx` — two-column with map placeholder
- **Rewrite** `src/components/complex/ComplexAdvantages.tsx` — horizontal cards layout
- **Update** `src/components/complex/BuildingSelector.tsx` — color #BA846E, label overlays
- **Update** `src/pages/ResidentialComplex.tsx` — new section order
- **Update** `src/pages/admin/AdminComplexEdit.tsx` — add Slides tab

