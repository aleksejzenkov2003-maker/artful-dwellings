import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useComplexSlides, SLIDE_TYPES } from "@/hooks/useComplexSlides";

interface ComplexConceptSliderProps {
  complexId: string;
}

export function ComplexConceptSlider({ complexId }: ComplexConceptSliderProps) {
  const { data: slides } = useComplexSlides(complexId);
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    if (!slides) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const goPrev = useCallback(() => {
    if (!slides) return;
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeIndex];
  const slideLabel =
    SLIDE_TYPES.find((t) => t.value === currentSlide.slide_type)?.label ||
    currentSlide.slide_type;

  return (
    <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
      {/* Background images with crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: slide.image_url
              ? `url(${slide.image_url})`
              : undefined,
            opacity: index === activeIndex ? 1 : 0,
          }}
        />
      ))}

      {/* White card overlay */}
      <div className="relative z-10 h-full flex items-stretch">
        <div className="w-full lg:w-[42%] bg-white/95 backdrop-blur-sm px-8 md:px-12 lg:px-14 py-12 lg:py-14 flex flex-col justify-between">
          {/* Counter */}
          <span className="text-[13px] tracking-[0.15em] text-muted-foreground uppercase font-medium">
            {activeIndex + 1} — {slides.length}
          </span>

          {/* Title + Description */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <h3 className="font-bold text-[26px] md:text-[30px] lg:text-[32px] uppercase tracking-[0.04em] leading-[1.15] mb-6 text-foreground">
              {slideLabel}
            </h3>
            {currentSlide.description && (
              <p className="text-[14px] lg:text-[15px] leading-[1.75] text-muted-foreground max-w-md">
                {currentSlide.description}
              </p>
            )}
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}