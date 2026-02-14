

## Update "Дополнительные услуги" Section to Match Reference

### Current vs Reference Differences

1. **Background color**: Currently `bg-accent` (terracotta/brown) -- reference shows a light/white background
2. **Title**: Currently white text with `font-serif` -- reference shows dark text, Aeroport font
3. **Cards**: Currently `bg-white/90 rounded-lg` on brown bg -- reference shows white cards with a thin border on a light background
4. **Plus button**: Currently dark icon in a bordered circle -- reference shows a teal/cyan colored `+` icon in a light circle with subtle border
5. **Card layout**: Title and description on the left, plus button on the right, aligned vertically centered

### Changes to `src/components/about/AboutAdditionalServices.tsx`

**Section wrapper:**
- Change `bg-accent` to light background (white or very light gray)

**Title:**
- Remove `text-white`, use `text-foreground`
- Use Aeroport font (`font-serif`) with proper sizing (~36px)

**Cards:**
- Use white background with thin border (`border border-gray-200`)
- Sharp corners (no `rounded-lg`)
- Remove hover effects that change background

**Plus icon:**
- Change icon color to teal (`text-teal` / `#00C9CE`)
- Keep circular border but make it subtle gray

**Text colors:**
- Title: dark/foreground, bold
- Description: muted gray, normal weight

### Single file change
- `src/components/about/AboutAdditionalServices.tsx`

