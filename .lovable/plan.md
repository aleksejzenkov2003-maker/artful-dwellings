

## Plan: Interactive Timeline "История компании"

Add an interactive horizontal timeline below the team section on /o-kompanii. When the user hovers/moves the mouse along the year markers, the timeline line highlights up to that year in accent color, and a detail card appears below showing a title, image, and description for that year.

### Data structure

Timeline entries with fields: `year`, `title`, `image` (optional placeholder for now), `description`. Data from the existing `timelineYears` array, expanded with titles and descriptions.

### Component — `AboutTimeline.tsx` (rewrite)

**Desktop (md+):**
- Title "История компании" left-aligned, Aeroport font
- Horizontal row of years (2016–2026, plus "..." at the end)
- Dashed/dotted line connecting years
- On hover/click a year: that year text turns accent color, the dotted line from start to that year turns accent, a card appears below with:
  - Title (e.g. "Основание компании")
  - Image placeholder (gray box with mountain icon)
  - Description paragraph
- State: `activeYear` controlled by `onMouseEnter` on each year label
- Line coloring: use a gradient or two overlapping lines — one gray full width, one accent up to the active year's position

**Mobile:**
- Vertical scrollable timeline, tap to select year

### Integration

- Add `AboutTimeline` to `OKompanii.tsx` after `AboutTeamCarousel` (before `AboutTestimonials`)
- Export from `src/components/about/index.ts`

### Files changed
- `src/components/about/AboutTimeline.tsx` — full rewrite with interactive hover logic
- `src/components/about/index.ts` — add export
- `src/pages/OKompanii.tsx` — add `<AboutTimeline />` after team section

