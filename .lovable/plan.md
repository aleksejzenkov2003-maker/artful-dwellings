

## Redesign Consultation Form on About Page

### What changes

The consultation form block on the About page will be redesigned to match the reference exactly:

1. **Background**: Replace the current `bg-accent` with the copper/nude background image (`Frame_33178.png`) which has subtle hexagon geometric patterns and diagonal lines
2. **Building photo**: Replace the current `promo-apartment-building.jpg` with the provided night-lit twin towers image (`house_1.png`) -- positioned on the right side, overlapping/overlaying the background
3. **Form styling**: 
   - White input fields with icons (User, Phone) -- already close, keep
   - Sharp corners (no `rounded-2xl` on container, no `rounded-lg` on inputs) per the page's design standard
   - Black "ОСТАВИТЬ ЗАЯВКУ" button with uppercase text
4. **Layout**: Two-column grid stays -- left side has the form text + inputs, right side shows the building image with transparent/cutout background (PNG with no background)

### Technical steps

**Assets to copy:**
- `user-uploads://Frame_33178.png` -> `src/assets/consultation-bg.png` (copper background with hexagon pattern)
- `user-uploads://house_1.png` -> `src/assets/consultation-house.png` (twin towers PNG)

**File to modify:** `src/components/about/AboutConsultationForm.tsx`

- Replace the outer container background from `bg-accent rounded-2xl` to use the copper background image (`consultation-bg.png`) with no rounded corners
- Replace the right-side image from `promo-apartment-building.jpg` to `consultation-house.png` 
- Change image styling from `object-cover` to `object-contain` since it's a cutout PNG that should show naturally
- Remove `rounded-lg` from inputs (use sharp corners)
- Ensure button is dark/black with white text, uppercase "ОСТАВИТЬ ЗАЯВКУ"
- Keep the HexagonPattern or remove it since the background image already contains the pattern
