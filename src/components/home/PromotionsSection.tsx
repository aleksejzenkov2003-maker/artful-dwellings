import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePromotions } from "@/hooks/usePromotions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PromotionsSection() {
  const { data: promotions } = usePromotions();
  const activePromo = promotions?.[0];

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left - Promo Content */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 uppercase tracking-wider">
                Акция
              </span>
            </div>
            
            <div className="pt-8">
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
                  <button className="w-8 h-8 border border-white/30 flex items-center justify-center hover:border-primary transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 border border-white/30 flex items-center justify-center hover:border-primary transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decorative car image placeholder */}
            <div className="absolute -right-20 -bottom-10 w-80 h-40 opacity-50">
              <div className="w-full h-full bg-gradient-to-r from-transparent to-zinc-700 rounded-full transform -rotate-6" />
            </div>

            <div className="flex justify-end mt-8">
              <Link to="/akcii" className="text-primary text-sm hover:underline">
                ВСЕ АКЦИИ →
              </Link>
            </div>
          </div>

          {/* Right - "Недвижимость как искусство" */}
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 hidden lg:flex items-center">
              <span 
                className="text-6xl xl:text-7xl font-serif text-muted-foreground/20 whitespace-nowrap"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
              >
                Недвижимость как Искусство
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:pl-16">
              <div className="relative h-48 overflow-hidden rounded-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
                  alt="Дешевле чем у застройщиков"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-center font-serif px-4">
                    Дешевле,<br />чем у застройщиков
                  </p>
                </div>
              </div>
              
              <div className="relative h-48 overflow-hidden rounded-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop"
                  alt="Любые финансовые схемы"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-center font-serif px-4">
                    Любые финансовые<br />схемы
                  </p>
                </div>
              </div>
              
              <div className="col-span-2">
                <Button variant="outline" className="w-full border-foreground/20 uppercase text-xs tracking-wider">
                  Узнать больше
                </Button>
              </div>
              
              <div className="col-span-2 bg-card border border-border p-6 rounded-lg">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Мы содействуем клиентам при покупке и продаже недвижимости, оформлении ипотеки, 
                  инвестировании, проверяем юридическую чистоту сделок. Создаём уникальные 
                  предложения для каждого клиента.
                </p>
              </div>
              
              <div className="col-span-2 relative h-32 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop"
                  alt="Мы на вашей стороне"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
                  <div className="p-6">
                    <div className="w-8 h-0.5 bg-white mb-3" />
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
