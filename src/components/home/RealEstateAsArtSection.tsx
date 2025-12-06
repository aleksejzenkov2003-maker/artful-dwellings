import { Button } from "@/components/ui/button";

export function RealEstateAsArtSection() {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex">
          {/* Vertical text on the left */}
          <div className="hidden lg:flex items-center pr-8">
            <span 
              className="text-6xl xl:text-7xl font-serif text-muted-foreground/15 whitespace-nowrap"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
            >
              Недвижимость как Искусство
            </span>
          </div>
          
          {/* Content grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {/* Дешевле чем у застройщиков */}
            <div className="relative h-52 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=350&fit=crop"
                alt="Дешевле чем у застройщиков"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-center font-serif text-xl px-4">
                  Дешевле,<br />чем у застройщиков
                </p>
              </div>
            </div>
            
            {/* Любые финансовые схемы */}
            <div className="relative h-52 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&h=350&fit=crop"
                alt="Любые финансовые схемы"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-center font-serif text-xl px-4">
                  Любые финансовые<br />схемы
                </p>
              </div>
            </div>
            
            {/* Button - full width */}
            <div className="md:col-span-2">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase text-xs tracking-wider py-6">
                Узнать больше
              </Button>
            </div>
            
            {/* Description card */}
            <div className="md:col-span-2 bg-card border border-border p-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                Мы содействуем клиентам при покупке и продаже недвижимости, оформлении ипотеки, 
                инвестировании, проверяем юридическую чистоту сделок. Создаём уникальные 
                предложения для каждого клиента.
              </p>
            </div>
            
            {/* "Мы на вашей стороне" banner */}
            <div className="md:col-span-2 relative h-36 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=250&fit=crop"
                alt="Мы на вашей стороне"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent flex items-center">
                <div className="p-6">
                  <div className="w-10 h-0.5 bg-white mb-3" />
                  <p className="text-white font-serif text-xl">Мы на вашей стороне</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
