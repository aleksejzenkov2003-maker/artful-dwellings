import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentStats } from "@/hooks/useApartments";
import { toast } from "sonner";
import { ComplexPresentationButton } from "./ComplexPresentationButton";

interface ComplexHeroProps {
  complex: ResidentialComplex;
}

export function ComplexHero({ complex }: ComplexHeroProps) {
  const { data: apartmentStats } = useApartmentStats(complex.id);
  
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `ЖК «${complex.name}»`,
        text: complex.description || "",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    }
  };

  // Use real apartment count or fallback to apartments_count field
  const availableCount = apartmentStats?.totalAvailable ?? complex.apartments_count ?? 0;
  
  // Map status to display text
  const statusDisplay = complex.status === "ready" ? "СДАН" : "СТРОИТСЯ";

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${complex.main_image || '/placeholder.svg'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a3a]/90 via-[#1a2a3a]/60 to-[#1a2a3a]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 min-h-[600px] lg:min-h-[700px] flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center gap-4 pt-6 lg:pt-8">
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
          <span className="text-white/80 text-sm uppercase tracking-wider">Новостройки</span>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-16 py-12 lg:py-20">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Label */}
            <p className="text-white/50 text-[13px] uppercase tracking-[0.12em] font-sans font-medium mb-4">
              Жилой комплекс
            </p>
            
            {/* Complex Name - Playfair Display */}
            <h1 className="font-serif font-normal text-[48px] md:text-[64px] lg:text-[80px] leading-[1.05] text-white mb-6">
              {complex.name}
            </h1>
            
            {/* Description */}
            {complex.description && (
              <p className="font-sans font-normal text-[16px] md:text-[18px] leading-[1.6] text-white/70 max-w-2xl mb-10">
                {complex.description.length > 200 
                  ? complex.description.substring(0, 200) + "..."
                  : complex.description}
              </p>
            )}

            {/* Download Presentation Button with popup */}
            <div className="mb-8">
              <ComplexPresentationButton complex={complex} />
            </div>

            {/* Share */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShare}
                className="text-white/60 hover:text-white text-[13px] uppercase tracking-wider transition-colors"
              >
                Поделиться
              </button>
              <button 
                onClick={handleShare}
                className="w-8 h-8 bg-[#4C75A3] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <span className="text-white text-xs font-bold">VK</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col justify-center lg:justify-start lg:pt-20">
            {/* Apartments Count - Dynamic from apartments table */}
            <div className="mb-8">
              <p className="text-primary font-serif text-[48px] leading-none">
                {availableCount}
              </p>
              <p className="text-white/50 text-[12px] uppercase tracking-[0.1em] mt-1">
                Квартир в продаже
              </p>
            </div>

            {/* Status */}
            <div className="mb-8">
              <p className="text-white text-[16px] font-medium uppercase tracking-wider">
                {statusDisplay}
              </p>
            </div>

            {/* Select Apartment Button */}
            <Button 
              variant="outline"
              className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-[13px] py-6"
              onClick={() => {
                const apartmentsSection = document.getElementById('apartments');
                if (apartmentsSection) {
                  apartmentsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Выбрать квартиру
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
