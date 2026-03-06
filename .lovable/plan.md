

## Plan: Redesign ComplexConceptSlider to match reference

The reference shows a **white card** overlaid on the left side of a full-bleed background image, containing:
- Counter "1 — 4" at top
- Large bold title "АРХИТЕКТУРА" 
- Description paragraph text
- Navigation arrows (circle outline) at bottom-left

No tab row — just arrows to cycle slides, with the background image changing per slide.

### Changes to `ComplexConceptSlider.tsx`

**Layout:**
- Full-width section with background image crossfade (keep existing)
- Remove the dark gradient overlay — use a lighter or no overlay since text is on a white card
- Add a **white semi-transparent card** (`bg-white/95`) positioned on the left side, with padding, containing:
  - Counter: `1 — 4` small text at top
  - Title: large bold uppercase text (slide type label like "АРХИТЕКТУРА")
  - Description: body text paragraph
- Navigation arrows at bottom-left of the card — circular outline buttons (not filled)
- Remove the tab row completely — navigation is only via arrows

**Styling details from reference:**
- White card: roughly 40-45% width on desktop, full height padding
- Title: bold, ~28-32px, uppercase
- Description: ~14-15px, regular weight, good line height
- Arrows: thin circle border, chevron icons inside
- Card has generous padding (~40-50px)

### Files changed
- `src/components/complex/ComplexConceptSlider.tsx` — rewrite layout to white card overlay style

