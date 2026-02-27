

## Problem
The PartneramGrid cards currently use `aspect-square` making them too tall/square. The reference screenshots show rectangular cards matching the AboutServices component style — shorter, with shadow styling, not square.

## Plan
Edit `src/components/partneram/PartneramGrid.tsx`:
- Replace `aspect-square` with `min-h-[200px] xl:min-h-[240px]` on both regular cards and CTA card (matching AboutServices)
- Replace `border border-border` with `shadow-[0_2px_12px_rgba(0,0,0,0.08)]` for the white cards
- Keep `p-8` padding as requested earlier

This aligns the grid with the existing AboutServices component pattern from the About page.

