

## Fix: Number/Text Overlap on Services Page (/uslugi)

The same overlap issue from the Partners page exists here -- the large serif numbers (01/, 02/, etc.) collide with the adjacent text due to insufficient gap and no fixed width on the number element.

### Changes

**File: `src/pages/Uslugi.tsx`** (line 64-66)

1. Increase gap from `gap-1` to `gap-4`
2. Add `flex-shrink-0` and `min-w-[70px] lg:min-w-[90px]` to the number span so it never compresses into the text
3. Reduce font size from `text-5xl md:text-6xl lg:text-7xl` to `text-[2.5rem] lg:text-[3.5rem]` for better fit -- matching the fix already applied on the Partners page

### Technical Detail

```tsx
// Before (line 64-66):
<div className="flex items-start gap-1">
  <span className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-primary leading-none">

// After:
<div className="flex items-start gap-4">
  <span className="flex-shrink-0 min-w-[70px] lg:min-w-[90px] text-[2.5rem] lg:text-[3.5rem] font-serif italic text-primary leading-none">
```

This mirrors the exact same fix already applied to `src/pages/Partneram.tsx`.
