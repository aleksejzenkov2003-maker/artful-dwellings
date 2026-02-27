

## Replace Partners Hero with SVG

Simple replacement — remove the entire `PartneramHero` component content and replace it with the uploaded SVG image.

### Steps:

1. **Copy SVG to project**: `user-uploads://1_1819820.svg` → `src/assets/partneram-hero.svg`

2. **Rewrite `src/components/partneram/PartneramHero.tsx`**: Strip all current content, replace with a simple `<img>` tag rendering the SVG at full width inside the container. Keep the "СТАТЬ ПАРТНЁРОМ" button anchor link below it if the SVG doesn't include one, or remove the component entirely.

3. **Update `src/pages/Partneram.tsx`**: If PartneramHero is simplified to just an SVG, keep it as-is. Remove any unused imports (foundersDuo, labels, etc.).

### Technical detail:
- Import SVG as `import partneramHero from "@/assets/partneram-hero.svg"`
- Render as `<img src={partneramHero} alt="Партнерам" className="w-full h-auto" />`
- The SVG is 1440×562, so it will scale naturally with `w-full`

