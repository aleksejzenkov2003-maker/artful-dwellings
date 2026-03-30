import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useAwards } from "@/hooks/useAwards";

// Static fallbacks
import award1 from "@/assets/award-1.png";
import award2 from "@/assets/award-2.png";
import award3 from "@/assets/award-3.png";
import award4 from "@/assets/award-4.png";

const staticAwards = [
  { id: "1", title: "1 место", image_url: award1 },
  { id: "2", title: "Legenda Best Agency", image_url: award2 },
  { id: "3", title: "Renaissance Development", image_url: award3 },
  { id: "4", title: "RBI партнер года", image_url: award4 },
];

export function AboutCertificates() {
  const { data: dbAwards } = useAwards();
  const awards = dbAwards && dbAwards.length > 0 ? dbAwards : staticAwards;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 lg:py-16 xl:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Label + Link row */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            ◆ СЕРТИФИКАТЫ
          </p>
          <Link
            to="/partneram"
            className="text-accent text-sm uppercase tracking-wider hover:underline"
          >
            СМОТРЕТЬ ВСЕ +
          </Link>
        </div>

        {/* Main title */}
        <h2 className="text-2xl md:text-3xl lg:text-[32px] xl:text-[38px] font-serif leading-tight mb-12 xl:mb-16">
          Являемся <span className="text-accent">официальным партнером</span> ведущих застройщиков
          и банков, что подтверждается <span className="text-accent">наградами и сертификатами</span>
        </h2>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-6">
              {awards.map((award) => (
                <div
                  key={award.id}
                  className="min-w-0 shrink-0 grow-0 basis-1/2 md:basis-1/4 pl-6"
                >
                  <div className="flex items-end justify-center h-[350px] md:h-[450px]">
                    <img
                      src={award.image_url}
                      alt={award.title}
                      className="max-h-full object-contain transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {awards.length > 4 && (
            <>
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-accent text-accent flex items-center justify-center transition-all hover:bg-accent hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-accent text-accent flex items-center justify-center transition-all hover:bg-accent hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === selectedIndex ? "bg-accent scale-110" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
