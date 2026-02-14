

## Fix spacing between header and team photos

The current code has `mb-12` (3rem / 48px) on the header div, creating too much gap between "Команда экспертов" and the photos. The reference shows a much tighter spacing.

### Changes

**File: `src/components/about/AboutTeamCarousel.tsx`**

- Reduce header bottom margin from `mb-12` to `mb-6` to bring the photos closer to the title, matching the reference layout.

