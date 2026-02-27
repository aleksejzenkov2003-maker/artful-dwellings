

## Redesign Partners Page — New Hero Block

Based on the reference images, the hero section needs a complete redesign. The current copper banner + building image layout will be replaced with a two-column layout featuring founders' photos.

### What changes

**1. Copy uploaded founder photos to project assets**
- `user-uploads://image_23.png` → `src/assets/founders-duo.png` (the combined photo of both founders)
- `user-uploads://Константин_Назаров.png` → name label reference (will be rendered as styled text, not an image)
- `user-uploads://Сергей_Чурганов.png` → name label reference (same)

**2. Rewrite `src/components/partneram/PartneramHero.tsx`**

New layout (two columns on desktop):
- **Left column (~55%)**: Breadcrumb "Главная / Партнерам", large serif title "ЗАРАБАТЫВАЙТЕ С ART ESTATE", subtitle "Приведите клиента и получите до 30% комиссии", three text paragraphs about the company (TOP-3, closed sales, 160 objects, 800 clients, 80M check), teal "СТАТЬ ПАРТНЁРОМ" button
- **Right column (~45%)**: The founders duo photo with two dark overlay labels at the bottom — "КОНСТАНТИН НАЗАРОВ / Основатель Art Estate" and "СЕРГЕЙ ЧУРГАНОВ / Основатель Art Estate"

Key design details from reference:
- Title: large uppercase serif font
- Subtitle: italic, smaller
- Text paragraphs: normal weight with bold keywords
- Labels on photos: dark semi-transparent background, white text, positioned at bottom of each founder
- Teal button uses existing `TealButton` component
- On mobile: single column, text first, photo below

**3. Remove old sections from `Partneram.tsx`**

The old pillars and bullet points sections are being replaced by the content now in the hero. The hero itself consolidates the key selling points. Keep the `partneramGrid` and `UnifiedConsultationForm` sections as-is.

### Technical details

- Remove `consultationHouse` import, replace with `founders-duo.png`
- The founder labels will be absolutely positioned `div` elements over the photo
- Breadcrumb changes to text-based "Главная / Партнерам" with copper-colored "Партнерам" link style (matching reference)
- Button scrolls to or links to the consultation form at bottom

