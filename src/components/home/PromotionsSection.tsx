import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePromotions } from "@/hooks/usePromotions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PromotionsSection() {
  const { data: promotions } = usePromotions();
  const [currentSlide, setCurrentSlide] = useState(0);
  const activePromo = promotions?.[currentSlide] || promotions?.[0];

  const nextSlide = () => {
    if (promotions && promotions.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }
  };

  const prevSlide = () => {
    if (promotions && promotions.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
    }
  };

  return (
    <section className="bg-navy text-white relative overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[400px]">
        {/* Left content */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center relative z-10">
          <div className="mb-6">
            <span className="bg-primary text-primary-foreground text-xs px-4 py-1.5 uppercase tracking-wider">
              Акция
            </span>
          </div>
          
          <p className="text-white/50 text-sm mb-3 uppercase tracking-wider">
            {activePromo?.category || "Скидки"}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-8 leading-tight max-w-md">
            {activePromo?.title || "Скидка 5% на квартиры в ЖК «Полянка 44»"}
          </h2>
          
          <div className="flex items-center gap-4 mb-8">
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="border-white text-white bg-transparent hover:bg-white hover:text-navy uppercase text-xs tracking-wider px-6"
            >
              <Link to={activePromo?.slug ? `/akcii/${activePromo.slug}` : '/akcii'}>Подробнее</Link>
            </Button>
            
            <div className="flex gap-2 ml-4">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 border border-white/30 bg-transparent flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 border border-white/30 bg-transparent flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Slider dots */}
          <div className="flex gap-2">
            {(promotions || [{ id: 1 }]).slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentSlide ? "bg-primary" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Right image */}
        <div className="flex-1 relative min-h-[300px] md:min-h-full">
          {activePromo?.cover_image ? (
            <img 
              key={activePromo.id}
              src={activePromo.cover_image}
              alt={activePromo.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-6xl">🎁</span>
            </div>
          )}
        </div>

        {/* All promotions link */}
        <div className="absolute bottom-6 right-6 z-10">
          <Link to="/akcii" className="text-primary text-sm hover:underline uppercase tracking-wider flex items-center gap-2">
            Все акции <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
