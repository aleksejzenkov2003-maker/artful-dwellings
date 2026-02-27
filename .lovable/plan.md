

## Differences: Current vs Reference

Comparing the current implementation (screenshot) with the reference image:

### Issues to fix in `src/components/partneram/PartneramHero.tsx`:

1. **Title size too large** — current title is enormous (`5.5rem` at xl). In reference it's noticeably smaller, roughly `3rem-3.5rem` range. Also the line break is different — reference has it all on one line "ЗАРАБАТЫВАЙТЕ С ART ESTATE"

2. **Subtitle not italic enough / wrong weight** — reference shows "Приведите клиента и получите до 30% комиссии" in a lighter, more understated italic. Current is close but the `!` should be removed (reference has no exclamation mark) and font size should be slightly smaller

3. **Text paragraphs** — reference text is smaller and more compact (`14px` range), with less spacing between paragraphs. The first paragraph in reference starts with "Art Estate входит в **ТОП-3 ведущих агентств**..." (no intro about selling real estate). The text content differs from reference

4. **Button position** — in reference the button sits closer to the text with less margin. Button appears slightly smaller (closer to `lg` size, not `xl`)

5. **Column proportions** — the photo column in the reference takes up more space, and the two columns are more evenly split. The founders' photo aligns with the top of the title, not pushed down

6. **Items alignment** — reference uses `items-end` or `items-center` so the photo bottom aligns with the button area. Currently `items-start` pushes photo to top

7. **Breadcrumb** — not visible in reference image (may be cropped), keep as-is

### Changes:

**`src/components/partneram/PartneramHero.tsx`:**
- Reduce h1 font sizes: `text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem]`
- Remove `<br />` from title — single line
- Remove `!` from subtitle, reduce size to `text-base md:text-lg`
- Reduce paragraph spacing from `space-y-5` to `space-y-4`, font to `text-[14px] lg:text-[15px]`
- Trim first paragraph — remove the intro sentence about selling property, start directly with "Art Estate входит в..."
- Change button from `size="xl"` to `size="lg"`
- Reduce `mb-10` to `mb-8` before button
- Change grid alignment from `items-start` to `items-end`

