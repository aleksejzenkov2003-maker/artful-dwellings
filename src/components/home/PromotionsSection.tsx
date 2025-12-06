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
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left - Promo Content with car image */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 lg:p-12 text-white relative overflow-hidden min-h-[400px]">
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 uppercase tracking-wider">
                Акция
              </span>
            </div>
            
            <div className="pt-8 relative z-10">
              <p className="text-white/60 text-sm mb-2">
                {activePromo?.category || "При покупке жилья"}
              </p>
              <h3 className="text-2xl md:text-3xl font-serif mb-6">
                {activePromo?.title || "Паркинг в подарок, при покупке квартиры"}
              </h3>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 uppercase text-xs">
                  Показать ещё
                </Button>
                
                <div className="flex gap-2 ml-auto">
                  <button 
                    onClick={prevSlide}
                    className="w-8 h-8 border border-white/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-8 h-8 border border-white/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Slider dots */}
              <div className="flex gap-2 mt-6">
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
            
            {/* Car image */}
            <div className="absolute -right-10 -bottom-5 w-80 h-48">
              <img 
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop"
                alt="Автомобиль"
                className="w-full h-full object-contain opacity-60"
              />
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <Link to="/akcii" className="text-primary text-sm hover:underline uppercase tracking-wider">
                Все акции →
              </Link>
            </div>
          </div>

          {/* Right - "Недвижимость как искусство" */}
          <div className="relative">
            {/* Vertical text */}
            <div className="absolute -left-4 top-0 bottom-0 hidden lg:flex items-center z-20">
              <span 
                className="text-5xl xl:text-6xl font-serif text-muted-foreground/20 whitespace-nowrap"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
              >
                Недвижимость как Искусство
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 lg:pl-12">
              {/* Дешевле чем у застройщиков */}
              <div className="relative h-44 overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
                  alt="Дешевле чем у застройщиков"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <p className="text-white text-center font-serif text-lg px-4">
                    Дешевле,<br />чем у застройщиков
                  </p>
                </div>
              </div>
              
              {/* Любые финансовые схемы */}
              <div className="relative h-44 overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop"
                  alt="Любые финансовые схемы"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <p className="text-white text-center font-serif text-lg px-4">
                    Любые финансовые<br />схемы
                  </p>
                </div>
              </div>
              
              {/* Button */}
              <div className="col-span-2">
                <Button variant="outline" className="w-full border-foreground/20 hover:border-primary hover:text-primary uppercase text-xs tracking-wider py-5">
                  Узнать больше
                </Button>
              </div>
              
              {/* Description card */}
              <div className="col-span-2 bg-card border border-border p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Мы содействуем клиентам при покупке и продаже недвижимости, оформлении ипотеки, 
                  инвестировании, проверяем юридическую чистоту сделок. Создаём уникальные 
                  предложения для каждого клиента.
                </p>
              </div>
              
              {/* "Мы на вашей стороне" banner */}
              <div className="col-span-2 relative h-28 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop"
                  alt="Мы на вашей стороне"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 flex items-center">
                  <div className="p-5">
                    <div className="w-8 h-0.5 bg-white mb-2" />
                    <p className="text-white font-serif text-lg">Мы на вашей стороне</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
