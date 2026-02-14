

## Fix Service Cards to Match Reference

### Current Issues
1. Cards have a horizontal divider line (`border-t`) between title and description -- reference has none
2. Cards have rounded corners (`rounded-xl`) -- reference shows sharp/square corners
3. Cards lack a shadow -- reference shows a subtle shadow behind cards

### Changes to `src/components/about/AboutServices.tsx`

**Service cards:**
- Remove `rounded-xl` -- use sharp corners (no border-radius)
- Remove `border-t border-[#e5e0db]` divider wrapper from description area
- Remove the visible border `border border-[#e5e0db]` from cards
- Add a subtle shadow: `shadow-md` or `shadow-[0_2px_12px_rgba(0,0,0,0.08)]`
- Keep description as a simple `<p>` without the `<div>` wrapper

**CTA card:**
- Also remove `rounded-xl` for consistency

### Single file change
- `src/components/about/AboutServices.tsx`

