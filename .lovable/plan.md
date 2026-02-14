

## Fix "Команда экспертов" block to match reference

### Problems identified

1. **Only 2 of 4 members showing** -- team members are assigned to specific cities (Moscow/Dubai), but the About page is viewed from SPb context, so the city filter hides them.
2. **Name color wrong** -- currently white, should be copper/gold (~#C4956A) as in reference.
3. **Name font wrong** -- should use font-display (Aeroport) with semi-bold weight, not generic font-semibold.
4. **Role color wrong** -- currently white/50 opacity, should be a warmer muted tone to match reference.
5. **Background color** -- currently #1a1a1a, reference looks slightly different (~#2a2a2a or #333).
6. **Section header** -- subtitle "специалисты" should be uppercase with wider letter-spacing, matching accent color from reference (copper tone).

### Plan

**1. Database update (city_id = NULL for all 4 published members)**

Set `city_id = NULL` on all 4 published team members so they appear on the About page regardless of which city is selected. This ensures all 4 are always visible.

**2. Style fixes in `AboutTeamCarousel.tsx`**

- Change name `h3` color from `text-white` to copper/gold `text-[#C4956A]` with `font-display` (Aeroport) font
- Change role `p` color from `text-white/50` to `text-white/60` for slightly warmer feel
- Adjust background from `#1a1a1a` to `#2d2d2d` to match reference
- Ensure heading uses `font-display` (Aeroport) class

### Technical details

Files to modify:
- `src/components/about/AboutTeamCarousel.tsx` -- styling updates (colors, fonts)

Database changes:
- `UPDATE team_members SET city_id = NULL WHERE id IN (4 published member IDs)` -- remove city restriction so all 4 show on every city context

