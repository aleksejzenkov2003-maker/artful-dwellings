import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useResidentialComplexes } from "@/hooks/useResidentialComplexes";
import { HexagonPattern } from "@/components/ui/HexagonPattern";

export function PropertySearchSection() {
  const [activeTab, setActiveTab] = useState<"new" | "secondary">("new");
  const { data: complexes } = useResidentialComplexes();
  
  const displayComplexes = complexes?.slice(0, 4) || [];

  const formatPrice = (price: number | null) => {
    if (!price) return "—";
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <HexagonPattern className="right-0 top-0 w-96 h-full opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
          Подберем идеальное предложение от 300 застройщиков
        </h2>

        {/* Quick Search Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Комнат:</span>
              <div className="flex gap-1">
                {["Ст", "1", "2", "3", "4+"].map((room) => (
                  <button
                    key={room}
                    className="w-10 h-10 border border-border rounded hover:border-primary hover:text-primary transition-colors text-sm"
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">До</span>
              <Input 
                type="text" 
                placeholder="5 000 000" 
                className="w-32 text-right"
              />
              <span className="text-sm text-muted-foreground">₽</span>
            </div>

            <Button className="bg-primary hover:bg-primary/90 uppercase text-xs tracking-wider">
              Отправить заявку
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-12">
          <button
            onClick={() => setActiveTab("new")}
            className={`text-sm uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              activeTab === "new" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Строящаяся недвижимость
          </button>
          <button
            onClick={() => setActiveTab("secondary")}
            className={`text-sm uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              activeTab === "secondary" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Вторичная недвижимость
          </button>
        </div>

        {/* Property Cards - Masonry-like layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayComplexes.map((complex, index) => (
            <Link
              key={complex.id}
              to={`/novostroyki/${complex.slug}`}
              className={`group relative overflow-hidden bg-card border border-border ${
                index === 0 ? "md:row-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 0 ? "h-80 md:h-full" : "h-48"}`}>
                <img
                  src={complex.main_image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"}
                  alt={complex.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                  {complex.developer || "Застройщик"}
                </p>
                <h3 className="text-lg font-serif text-white mb-2">
                  {complex.name}
                </h3>
                <p className="text-primary text-sm">
                  от {formatPrice(complex.price_from)} ₽/м²
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {complex.city}, {complex.district}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          <Link to="/novostroyki">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white uppercase text-xs tracking-wider px-8">
              Показать ещё
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
