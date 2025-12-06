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
    <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="max-w-2xl relative z-10">
          <div className="mb-6">
            <span className="bg-primary text-primary-foreground text-xs px-4 py-1.5 uppercase tracking-wider">
              Акция
            </span>
          </div>
          
          <p className="text-white/60 text-sm mb-3 uppercase tracking-wider">
            {activePromo?.category || "При покупке жилья"}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 leading-tight">
            {activePromo?.title || "Паркинг в подарок, при покупке квартиры в марте."}
          </h2>
          
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 uppercase text-xs tracking-wider">
              Показать ещё
            </Button>
            
            <div className="flex gap-2 ml-8">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 border border-white/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 border border-white/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
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
        
        {/* Car image positioned on the right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] lg:w-[600px] h-auto hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=350&fit=crop"
            alt="Автомобиль"
            className="w-full h-full object-contain opacity-80"
          />
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
