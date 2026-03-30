

## Problem

The header and footer extend beyond the viewport width, causing text to be cut off on the right side (visible in screenshots: "ЗАКАЗАТЬ ЗВОН-", "КОНТА-", "Арт И-", "Санкт-Пет-").

The current fix (`overflow-x-hidden` + `max-width: 100vw` on `html, body`) does not work because:
1. `100vw` includes the scrollbar width, making content slightly wider than the visible area
2. `overflow-x-hidden` on both `html` and `body` simultaneously can behave inconsistently across browsers — when set on `html`, the browser may transfer it to the viewport, causing `body`'s rule to be ignored

## Root Cause

`max-width: 100vw` is the culprit. On pages with a vertical scrollbar, `100vw` = viewport + scrollbar width, so content overflows by ~15px.

## Plan

### 1. Fix `src/index.css` — replace `100vw` with `100%`

Change the `html, body` rule:
```css
html, body {
  @apply overflow-x-hidden;
  max-width: 100%;
}
```

`100%` respects the actual available width (excluding scrollbar), unlike `100vw`.

### 2. Fix `src/pages/ResidentialComplex.tsx` — same change on Tilda container

Change `max-w-[100vw]` to `max-w-full` on the Tilda body div:
```tsx
<div className="t-body -mt-28 lg:-mt-28 overflow-x-hidden max-w-full" .../>
```

These two changes should resolve the header/footer clipping on all pages.

