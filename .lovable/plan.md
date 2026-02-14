

## Block 2: "Услуги" — Fix to Match Figma 1:1

### What's Wrong Now
The current implementation has a **brown (#BA846E) background** for the entire section, but the Figma screenshot clearly shows a **white/light background** with the cards having subtle borders/shadows. Only the CTA card ("Заинтересовали?") has the brown background.

### Changes to `AboutServices.tsx`

1. **Section background**: Change from `#BA846E` to white/light (remove the brown background entirely)
2. **Title "Услуги"**: Change from white text to dark/black text, keep serif italic style
3. **Service cards**: Add subtle border (`border border-gray-200`) or light shadow, keep white background, keep rounded corners
4. **Icons**: Keep brown/terracotta (#BA846E) color, outline style — matches reference
5. **Card titles**: Bold, dark text — currently correct
6. **Card descriptions**: Gray text at bottom — currently correct  
7. **CTA card**: Keep brown (#BA846E) background with white text — currently correct
8. **CTA "+" button**: Circle with border, white — currently correct
9. **Grid**: Keep 4-column layout with consistent gap

### Specific Style Adjustments
- Section: `className="py-16 lg:py-24"` (no background color)
- Title: `className="text-4xl lg:text-5xl font-serif italic text-foreground mb-12"`
- Cards: Add `border border-[#e5e0db]` for the subtle warm border visible in reference
- Increase `min-h` slightly to ~240px to give more breathing room matching reference
- CTA card text "Заинтересовали?" should be larger, italic serif style

### Files to Modify
- `src/components/about/AboutServices.tsx` — single file change

