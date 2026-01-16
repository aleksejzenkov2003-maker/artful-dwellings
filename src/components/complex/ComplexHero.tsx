import { Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentStats } from "@/hooks/useApartments";
import { toast } from "sonner";
import { ComplexPresentationButton } from "./ComplexPresentationButton";
import { TealButton } from "@/components/ui/teal-button";

interface ComplexHeroProps {
  complex: ResidentialComplex;
}

export function ComplexHero({ complex }: ComplexHeroProps) {
  const { data: apartmentStats } = useApartmentStats(complex.id);
  
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ЖК «${complex.name}»`,
          text: complex.description || "",
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    }
  };

  const scrollToApartments = () => {
    const element = document.getElementById("apartments");
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Use real apartment count or fallback to apartments_count field
  const availableCount = apartmentStats?.totalAvailable ?? complex.apartments_count ?? 0;
  
  // Map status to display text
  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "ready":
      case "completed": 
        return "СДАН";
      case "building": 
        return "СТРОИТСЯ";
      case "soon": 
        return "СКОРО";
      default: 
        return "В ПРОДАЖЕ";
    }
  };

  // Truncate description for hero
  const shortDescription = complex.description
    ? complex.description.length > 200
      ? complex.description.substring(0, 200) + "..."
      : complex.description
    : "";

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${complex.main_image || "/placeholder.svg"})`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a3a]/95 via-[#1a2a3a]/70 to-[#1a2a3a]/30" />

      {/* Back Button - Fixed position */}
      <div className="absolute top-6 left-4 lg:left-8 z-20">
        <Button 
          asChild 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Link to="/novostroyki">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[60vh]">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 xl:col-span-6 text-white">
            {/* Breadcrumb */}
            <div className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/60 font-medium">
                НОВОСТРОЙКИ
              </span>
            </div>

            {/* Label */}
            <div className="mb-4">
              <span className="text-[12px] uppercase tracking-[0.15em] text-white/70 font-medium">
                ЖИЛОЙ КОМПЛЕКС
              </span>
            </div>

            {/* Complex Name */}
            <h1 className="font-serif text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] font-normal leading-[0.95] tracking-[-0.02em] mb-6">
              {complex.name}
            </h1>

            {/* Decorative Line */}
            <div className="w-16 h-px bg-white/40 mb-8" />

            {/* Description */}
            {shortDescription && (
              <p className="font-serif text-[15px] md:text-[17px] leading-relaxed text-white/80 max-w-lg mb-10 italic">
                {shortDescription}
              </p>
            )}

            {/* Buttons Row */}
            <div className="flex flex-col">
              <ComplexPresentationButton complex={complex} />
              <span className="text-[11px] text-white/50 mt-3 tracking-wide">
                Скачайте полную презентацию дома с ценами
              </span>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-3 mt-10 text-white/60 hover:text-white transition-colors group"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.15em] font-medium">
                ПОДЕЛИТЬСЯ
              </span>
              <span className="w-8 h-8 bg-[#4C75A3] flex items-center justify-center hover:opacity-80 transition-opacity">
                <span className="text-white text-xs font-bold">VK</span>
              </span>
            </button>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-start lg:items-end justify-center text-white">
            <div className="lg:text-right">
              {/* Apartments Count */}
              <div className="mb-6">
                <div className="text-teal text-[64px] md:text-[80px] lg:text-[100px] xl:text-[120px] font-light leading-none font-serif">
                  {availableCount}
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 mt-2">
                  КВАРТИР В ПРОДАЖЕ
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-10">
                <span className="inline-block px-6 py-2.5 border border-white/30 text-[11px] uppercase tracking-[0.2em] text-white/80">
                  {getStatusLabel(complex.status)}
                </span>
              </div>

              {/* CTA Button */}
              <TealButton
                onClick={scrollToApartments}
                variant="outline"
                size="lg"
                className="min-w-[200px] lg:min-w-[240px]"
              >
                ВЫБРАТЬ КВАРТИРУ
              </TealButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
