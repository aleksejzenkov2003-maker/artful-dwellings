

## Fix Testimonials: Photos, Play Button, and Navigation Arrows

### 1. Replace photos with correct ones

The current testimonial photos are incorrect. Will re-copy the user's uploaded photos:
- `user-uploads://Frame_33208-2.png` -> `src/assets/testimonial-1.png` (Лера Кудрявцева)
- `user-uploads://Frame_33210-3.png` -> `src/assets/testimonial-2.png` (Джузеппе)
- `user-uploads://Frame_33211-2.png` -> `src/assets/testimonial-3.png` (Татьяна Буланова)

### 2. Replace play button with custom SVG

Based on the reference (`play-2.png`), the play button is a teal circle with an **outline-style** play triangle (not filled solid). Will also add a subtle drop shadow. Replace the current Lucide `<Play>` icon with a custom inline SVG matching the reference exactly.

### 3. Fix navigation arrows color

Based on `arrows-2.png`, the arrows should be:
- **Left arrow**: light outline circle (as currently) -- no change needed
- **Right arrow**: **copper/brown (#BA846E)** filled circle, NOT teal

Current right arrow uses `bg-[#00C9CE]` -- will change to `bg-[#BA846E]` with hover `hover:bg-[#a0725d]`.

### Technical details

**File to modify**: `src/components/about/AboutTestimonials.tsx`

Changes:
- Line 116-118: Replace Play lucide icon with custom SVG (outline triangle in teal circle with shadow)
- Line 149-153: Change right arrow from `bg-[#00C9CE]` to `bg-[#BA846E]`
- Remove `Play` from lucide imports since it won't be needed

**Assets to re-copy**: 3 testimonial photos from user uploads

