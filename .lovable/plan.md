

## Analysis: "О компании" Page Design Implementation

### Current State vs. Reference Images

The OKompanii page structure already exists with 9 sections, but comparing with your Figma reference images reveals several key differences that need pixel-perfect alignment:

**Reference Image Breakdown:**
1. **Image 188**: Hero intro section with team photo and stats section  
2. **Image 189**: Services section (Услуги) with 8 cards in 2×4 grid on brown/coral background
3. **Image 190**: Additional services (Дополнительные услуги) with 4 expandable cards  
4. **Image 191**: Certificates/Awards section (СЕРТИФИКАТЫ) on dark background
5. **Image 192**: Advantages section (Art Estate — это) with 3 icon cards
6. **Image 193**: Team of Experts (Команда экспертов) in dark section with 4 team members
7. **Image 194**: Client testimonials (Слово нашим клиентам) with video carousel and consultation CTA
8. **Image 195**: Consultation form section with side image and footer

### Major Structural Differences

**Components Currently Missing:**
1. **AboutCertificates** - Dark section showcasing awards/certificates with text about being an official partner
2. **AboutConsultationForm** - Full-width form section with background image for consultation requests
3. **AboutAdditionalServices** - Expandable accordion-style additional services section (Дополнительные услуги)

**Components Needing Significant Updates:**
1. **AboutIntro** → Should include stats section (15+, 850+, 50, 4200+, 3500) with colored text and separator line
2. **AboutServices** → Background color should be brown/coral (#BA846E), services in 2×4 grid (8 items), larger icons
3. **AboutFounders** → Not visible in reference images; placement needs clarification
4. **AboutAdvantages** → Visual style matches reference but may need icon adjustments
5. **AboutTeamCarousel** → Layout correct but needs "СПЕЦИАЛИСТЫ" label/stars above title
6. **AboutTestimonials** → Mostly correct but may need quotation mark decoration above title

### Technical Implementation Plan

**Phase 1: Create Missing Components**
- Create `AboutCertificates.tsx` - Dark background section with certificate showcase, partners text, CTA button
- Create `AboutConsultationForm.tsx` - Form section with left side form input, right side background image
- Create `AboutAdditionalServices.tsx` - 2×2 grid of expandable accordion items with plus icons

**Phase 2: Update Existing Components**
- **AboutIntro.tsx**:
  - Add stats grid below main intro text
  - Stats: "15+ лет на рынке", "850+ объектов в базе", "50 специалистов", "4200+ успешных сделок", "3500 довольных клиентов"
  - Use teal color (#20b2aa) for numbers, smaller gray text for labels
  - Add separator line (brown/coral color #BA846E) below stats

- **AboutServices.tsx**:
  - Change background from `bg-secondary` to brown/coral (#BA846E)
  - Adjust grid to 2 columns on desktop, 1 on mobile (2×4 layout for 8 items)
  - Make section title white text on brown background
  - Add larger icons (if available from database) or placeholder circles
  - Increase padding/spacing around cards

- **AboutTeamCarousel.tsx**:
  - Add "◆ СПЕЦИАЛИСТЫ ◆" label above "Команда экспертов" title
  - Ensure proper spacing and layout matches reference

- **AboutTestimonials.tsx**:
  - Add quotation mark icon (" ") above title
  - Adjust carousel padding and spacing
  - Ensure play button styling matches reference

**Phase 3: Update OKompanii.tsx**
- Reorder components to match reference flow:
  1. AboutHero
  2. AboutIntro (with stats)
  3. AboutServices (updated with brown background)
  4. AboutAdditionalServices (new)
  5. AboutTimeline (keep as is)
  6. AboutFounders (if keeping)
  7. AboutIdea
  8. AboutAdvantages
  9. AboutCertificates (new)
  10. AboutTeamCarousel
  11. AboutTestimonials
  12. AboutConsultationForm (new - replaces current consultation in testimonials)

### Color & Styling Notes
- Brown/Coral background: `#BA846E`
- Teal text for stats numbers: `hsl(var(--primary))`
- Keep dark background (#1a1a1a) for team and testimonials sections
- Maintain responsive design for mobile (single column where applicable)

### Data Dependencies
- Services section pulls from `useServices()` hook (8 items)
- Team section uses `useTeamMembers()` hook
- Reviews section uses `useReviews()` hook
- Stats and additional services may need hardcoded data or database entries

