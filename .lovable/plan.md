

## Plan: Fully Populate "Полянка 44" Complex

### Current State
- Complex record exists with basic data (name, address, description, features, infrastructure, 3 unsplash images, price range)
- 4 concept slides exist but **without images** (`image_url` is null)
- **0 apartments** — the apartments table is empty for this complex
- **0 buildings** — no building/corpus records
- Missing: `completion_date`, `seo_title`, `seo_description`

### What Will Be Done

#### 1. Update Complex Record
- Set `completion_date` to Q2 2026
- Add `seo_title` and `seo_description`
- Expand `description` to a richer, multi-paragraph text
- Update `images` array with more high-quality Unsplash architecture/interior photos (6-8 images)
- Update `floors_count` to reflect building count (3 корпуса)

#### 2. Add Concept Slide Images
Update 4 existing slides with relevant Unsplash image URLs:
- Architecture → modern building facade photo
- Landscaping → green landscaping/park photo
- Courtyard → residential courtyard photo
- Art objects → urban art/sculpture photo

#### 3. Create Buildings (3 корпуса)
Insert 3 buildings into `complex_buildings`:
- Корпус 1: 12 этажей
- Корпус 2: 8 этажей
- Корпус 3: 15 этажей

#### 4. Generate Apartments (~30 records)
Insert apartments across 3 buildings with realistic data:
- Studios (25-35 m²): from 4.9M ₽
- 1-bedroom (40-55 m²): from 8.5M ₽
- 2-bedroom (60-85 m²): from 14M ₽
- 3-bedroom (90-120 m²): from 22M ₽
- Penthouse (150-210 m²): from 35M ₽
- Various floors, statuses (available/reserved/sold), layout images from Unsplash

### Technical Details

**Single database migration** containing:
1. `UPDATE residential_complexes` — enrich fields
2. `UPDATE complex_slides` — add image_url to 4 slides
3. `INSERT INTO complex_buildings` — 3 buildings with polygon_points as empty arrays
4. `INSERT INTO apartments` — ~30 apartments distributed across buildings and floors

No code file changes needed — all data population via SQL migration.

