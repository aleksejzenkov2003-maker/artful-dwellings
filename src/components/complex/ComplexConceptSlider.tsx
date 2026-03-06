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
  const slideLabel = SLIDE_TYPES.find((t) => t.value === currentSlide.slide_type)?.label || currentSlide.slide_type;

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-[#1a2a3a]">
      {/* Background images with crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: slide.image_url ? `url(${slide.image_url})` : undefined,
            opacity: index === activeIndex ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a3a]/80 via-[#1a2a3a]/40 to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full w-full max-w-[1800px] mx-auto px-6 lg:px-12 flex flex-col justify-between py-12 lg:py-16">
        {/* Top: counter */}
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-[13px] tracking-[0.15em] uppercase font-medium">
            {activeIndex + 1} — {slides.length}
          </span>
        </div>

        {/* Middle: slide tabs */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Slide type tabs */}
          <div className="flex flex-wrap gap-6 mb-8">
            {slides.map((slide, index) => {
              const label = SLIDE_TYPES.find((t) => t.value === slide.slide_type)?.label || slide.slide_type;
              return (
                <button
                  key={slide.id}
                  onClick={() => setActiveIndex(index)}
                  className={`text-[12px] lg:text-[13px] uppercase tracking-[0.15em] font-medium transition-colors pb-2 border-b-2 ${
                    index === activeIndex
                      ? "text-white border-[#BA846E]"
                      : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Content card */}
          <div className="max-w-lg">
            <h3 className="font-serif text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] mb-6">
              {currentSlide.title}
            </h3>
            {currentSlide.description && (
              <p className="text-white/70 text-[15px] lg:text-[17px] leading-[1.7] max-w-md">
                {currentSlide.description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom: arrows */}
        <div className="flex items-center gap-4">
          <button
            onClick={goPrev}
            className="w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="w-12 h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
