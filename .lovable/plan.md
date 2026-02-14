

# Unified Consultation Form Design Across All Pages

## Overview

Replace all contact/consultation forms across the site with a unified design matching the reference: brown/copper background with hexagon pattern, building image overflowing on the right, white input fields with icons (user + phone), and a full-width dark "ОСТАВИТЬ ЗАЯВКУ" button.

## Design Specification (from reference)

- Brown/copper background (using `consultation-bg.png`)
- Building image on right side overflowing the top (using `consultation-house.png`)
- Hexagon geometric pattern overlay
- Title: "Получите консультацию" (customizable per page)
- Subtitle: "И наши специалисты ответят на все ваши вопросы"
- White input fields with User and Phone icons on the left
- Full-width dark button "ОСТАВИТЬ ЗАЯВКУ"
- Sharp corners (no border-radius) on all elements

## Forms to Update

The following 9 form components/instances will be unified:

1. **AboutConsultationForm** (`src/components/about/AboutConsultationForm.tsx`) -- already matches, will be the template
2. **ConsultationSection** (`src/components/home/ConsultationSection.tsx`) -- used on Index page
3. **ConsultationBlock** (`src/components/shared/ConsultationBlock.tsx`) -- used on Novostroyki & PropertyCatalog pages
4. **ConsultationForm** (`src/components/home/ConsultationForm.tsx`) -- inline sentence-style form
5. **ComplexExcursionForm** (`src/components/complex/ComplexExcursionForm.tsx`) -- single-line form on complex page
6. **ComplexContactForm** (`src/components/complex/ComplexContactForm.tsx`) -- sidebar form on complex page
7. **ServiceContactForm** (`src/components/services/ServiceContactForm.tsx`) -- sidebar form on service pages
8. **MortgageContactForm** (`src/components/ipoteka/MortgageContactForm.tsx`) -- two-column form on mortgage page
9. **Kontakty page form** (`src/pages/Kontakty.tsx`) -- inline form on contacts page
10. **Partneram page form** (`src/pages/Partneram.tsx`) -- partner application form

**Excluded from unification** (different purpose/context):
- `CallbackDialog` -- modal dialog, stays as-is
- `ComplexPresentationButton` -- PDF download dialog, stays as-is
- `BrokerContactForm` -- broker-specific sidebar form with message field, stays as-is
- `ComplexQuiz` / `ComplexQuizBanner` -- quiz, not a form

## Technical Approach

### Step 1: Create a Universal ConsultationForm Component

Create `src/components/shared/UnifiedConsultationForm.tsx` -- a reusable component with props:

```text
Props:
  - title: string (default: "Получите консультацию")
  - subtitle: string (default: "И наши специалисты ответят на все ваши вопросы")
  - formSource: string (for lead tracking)
  - formType: string (default: "consultation")
  - variant: "full" | "compact"
    - "full": full-width section with building image (for standalone sections)
    - "compact": card-style without building image (for sidebars)
  - buttonText: string (default: "ОСТАВИТЬ ЗАЯВКУ")
```

The component will:
- Use `consultation-bg.png` as background
- Show `consultation-house.png` overflowing on the right (full variant only)
- White inputs with User and Phone icons
- Full-width dark button
- Zod validation for name and phone
- `useSubmitLead` hook integration
- Success state with checkmark

### Step 2: Replace Each Form

| Component | Variant | Custom Props |
|-----------|---------|-------------|
| AboutConsultationForm | full | formSource="about_page" |
| ConsultationSection | full | formSource="Главная страница" |
| ConsultationBlock | full | title/subtitle from props, formSource from props |
| ConsultationForm | full | formSource="Главная страница" |
| ComplexExcursionForm | full | title="Запишитесь на экскурсию", formType="excursion" |
| ComplexContactForm | compact | title="Записаться на просмотр", formType="complex_inquiry" |
| ServiceContactForm | compact | title="Заказать услугу", formType="service" |
| MortgageContactForm | full | title="Получите консультацию по ипотеке", formType="mortgage" |
| Kontakty form | compact | title="Напишите нам", formType="contact" |
| Partneram form | compact | title="Оставить заявку", formType="partner" |

### Step 3: Update Parent Pages

Update imports in all parent pages/components to use the new unified component:
- `src/pages/Index.tsx`
- `src/pages/OKompanii.tsx`
- `src/pages/Novostroyki.tsx`
- `src/pages/PropertyCatalog.tsx`
- `src/pages/Ipoteka.tsx`
- `src/pages/Kontakty.tsx`
- `src/pages/Partneram.tsx`
- `src/pages/ServicePage.tsx`
- `src/pages/ResidentialComplex.tsx`

### Compact Variant Details

For sidebar/card forms (ServiceContactForm, ComplexContactForm, Kontakty, Partneram), the compact variant will use the same visual style but without the building image: brown background, white inputs with icons, dark button, contained within a card.

## Files Changed

- **New**: `src/components/shared/UnifiedConsultationForm.tsx`
- **Modified**: 10+ files (parent pages and existing form components updated to use new unified component)
- **Potentially removed**: Old form components that become unused

