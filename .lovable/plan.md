

## Redesign "Слово нашим клиентам" to match reference

### What changes

**1. Copy uploaded testimonial thumbnails to project assets**

Three video thumbnail images will be added to `src/assets/`:
- `testimonial-1.png` (Лера Кудрявцева - Frame_33208.png)
- `testimonial-2.png` (Джузеппе - Frame_33210-2.png)
- `testimonial-3.png` (Татьяна Буланова - Frame_33211.png)

**2. Update database reviews with correct names and photos**

Update the 3 published reviews to match the reference:
- Мария → Лера Кудрявцева (with testimonial-1 photo)
- Николай → Джузеппе (with testimonial-2 photo)
- Елена → Татьяна Буланова (with testimonial-3 photo)

All keep `author_role: "Покупка квартиры в новостройке"`.

**3. Restyle `AboutTestimonials.tsx` to match reference exactly**

| Element | Current | Reference |
|---------|---------|-----------|
| Quotation mark `"` | `text-muted-foreground/30` (gray) | `text-[#BA846E]` (copper) |
| Play button | `bg-primary` (brown) | `bg-[#00C9CE]` (teal) |
| Card width | `w-[300px] md:w-[380px]` | `w-[320px] md:w-[420px]` |
| Progress bar width | `w-32` (fixed small) | Full width of container |
| Progress bar fill | `bg-accent` | `bg-[#BA846E]` (copper) |
| Progress bar track | `bg-muted` | `bg-[#e5e5e5]` (light gray) |
| Right arrow | `bg-primary` (brown) | `bg-[#00C9CE]` (teal) |
| Left arrow | `border-border` | `border-[#d0d0d0]` (light gray outline) |
| Section background | white | white (no change) |

**4. Progress bar becomes dynamic**

The progress bar fill width will be calculated from the current Embla scroll position, updating as the user scrolls through the carousel. Currently it is hardcoded at 1/3.

### Files to modify
- `src/components/about/AboutTestimonials.tsx` -- all styling updates and dynamic progress bar

### Database changes
- Update 3 review records: author_name, author_role, author_photo

