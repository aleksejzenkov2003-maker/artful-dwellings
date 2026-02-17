
## Fix: Number/Text Overlap in Services Section

The large serif numbers (01/, 02/, etc.) in the "Three Pillars" section are overlapping with the adjacent text because of tight spacing and large font sizes.

### Changes

**File: `src/pages/Partneram.tsx`** (lines 44-57)

1. Reduce the number font size slightly on smaller screens (from `text-[3rem]` to `text-[2.5rem]`)
2. Add `flex-shrink-0` to the number span so it doesn't compress
3. Increase the gap between number and text (from `gap-3` to `gap-4`)
4. Ensure the number container has a minimum width so text doesn't wrap into it

### Technical Detail

- Change the pillar item layout from `flex gap-3` to `flex gap-4 items-start`
- Wrap the number in a `flex-shrink-0` container with a set `min-w` so the "01/" text never wraps or collides
- Adjust font size to `text-[2.5rem] lg:text-[3.5rem]` for better fit
