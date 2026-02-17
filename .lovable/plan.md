

# Fix Partners Hero: Banner Behind Building Image

## What's Wrong Now
Currently the copper banner and building image are side-by-side in a flex row. In the reference, the copper banner spans the full width and the building image overlaps ON TOP of the banner from the right, extending upward above it.

## Layout Structure (from reference)

```text
+--------------------------------------------------+
| < ГЛАВНАЯ                                        |
| ПАРТНЕРАМ                                        |
| Партнёрам                    [Building Image]    |
|                              [sits ON TOP of     |
+================================[the banner]======+
| Copper Banner (full width)   [overlapping up]    |
| "Зарабатывайте с Art Estate"                     |
| Text content here...                             |
+--------------------------------------------------+
```

Key observations:
- The copper banner spans the FULL WIDTH of the container
- The building image is absolutely positioned on the right, sitting ON TOP of the banner
- The building image extends upward above the banner (into the title area)
- The banner text content stays on the left ~50%

## Technical Changes

**File: `src/components/partneram/PartneramHero.tsx`**

1. Make the banner+image wrapper `relative` with full width
2. The copper banner becomes full-width (`w-full`)
3. The building image becomes `absolute`, positioned `right-0 bottom-0` with upward overflow via negative top or `h` larger than parent
4. Banner text gets a `max-w` or `lg:w-[55%]` to stay on the left side only
5. The image gets a higher `z-index` than the banner (image ON TOP of banner)

