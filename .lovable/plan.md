

## Plan: Remove table borders from ComplexHero info grid

Replace the bordered 2x2 grid with borderless key-value pairs matching the reference. The reference shows items arranged in 2 columns with just spacing between them -- no visible borders.

### Changes to `ComplexHero.tsx` (lines 111-145)

Replace the bordered grid with a simple 2-column layout using gap spacing instead of borders:

- Remove all `border border-white/10` and `border-l-0 border-t-0` classes
- Use `gap-x-12 gap-y-8` for spacing between items
- Keep the same label/value typography
- Add `metro` field if available (shown in reference image-302: "Метро — Василеостровская")

The items remain: Сдача, Город, Адрес, Район (+ Метро if data exists).

