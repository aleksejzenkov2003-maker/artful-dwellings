
# Responsive Adaptation for Mac Screens (About Company Page)

## Problem
On Mac screens (1280px-1536px), the About Company page has excessive vertical gaps between sections, oversized elements, and doesn't look polished. The design was optimized for 1800px-wide screens and mobile, but the intermediate Mac resolutions (MacBook Air 13" at 1280px, MacBook Pro 14" at 1512px, MacBook Pro 15"/16" at 1536px) are neglected.

## What Will Change

### 1. Reduce Section Spacing on Mac Screens
All sections currently use `py-16 lg:py-24` which creates too much vertical breathing room on 1280-1536px screens. Add an `xl` breakpoint for tighter spacing:
- Change from `py-16 lg:py-24` to `py-16 lg:py-16 xl:py-24` across all About page sections
- This reduces the gap on Mac-sized screens while keeping the generous spacing on ultra-wide displays

### 2. Hero Section Refinements
- Reduce gap between columns: `gap-10 lg:gap-12 xl:gap-16`
- Slightly reduce hero title font size for the `lg` range so it doesn't dominate on smaller Macs
- Reduce stats spacing: `mt-14 lg:mt-14 xl:mt-20`

### 3. Certificates Section Title
- Keep the two-line title layout by adjusting font size: use `lg:text-[32px] xl:text-[38px]` so it stays on 2 lines at 1280px without overflowing

### 4. Advantage Cards
- Reduce `min-h-[420px]` to `min-h-[360px] xl:min-h-[420px]` so cards are more proportional on Mac screens
- Reduce icon height from `h-[180px]` to `h-[140px] xl:h-[180px]`

### 5. Team Photos
- Add `max-h-[400px] xl:max-h-none` constraint to keep photos from getting excessively tall on 1280-1536px screens

### 6. Testimonial Cards
- Adjust card width: `w-[320px] md:w-[380px] xl:w-[420px]` for better proportion

### 7. Services Grid Cards
- Reduce `min-h-[240px]` to `min-h-[200px] xl:min-h-[240px]`

## Files to Modify

| File | Change |
|------|--------|
| `src/components/about/AboutHero.tsx` | Reduce spacing, font sizes for lg/xl breakpoints |
| `src/components/about/AboutServices.tsx` | Reduce section padding, card min-height |
| `src/components/about/AboutAdditionalServices.tsx` | Reduce section padding |
| `src/components/about/AboutCertificates.tsx` | Reduce section padding, title font size for 2-line preservation |
| `src/components/about/AboutAdvantages.tsx` | Reduce card min-height, icon size |
| `src/components/about/AboutTeamCarousel.tsx` | Reduce section padding, constrain photo height |
| `src/components/about/AboutTestimonials.tsx` | Reduce section padding, card width |
| `src/components/about/AboutConsultationForm.tsx` | Reduce section padding |

## Technical Details

All changes use Tailwind's responsive prefixes (`lg:` for 1024px+, `xl:` for 1280px+). No new breakpoints or config changes needed. The approach:
- `lg:` values become the "Mac" sizes (tighter)
- `xl:` values restore the original "wide desktop" sizes
- Mobile values remain unchanged
