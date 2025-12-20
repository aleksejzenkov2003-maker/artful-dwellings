import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { Button } from "@/components/ui/button";

interface ComplexApartmentsProps {
  complex: ResidentialComplex;
}

const roomTypes = [
  { label: "СТ", value: "studio", count: 12 },
  { label: "1", value: "1", count: 24 },
  { label: "2", value: "2", count: 18 },
  { label: "3", value: "3", count: 8 },
  { label: "4+", value: "4", count: 3 },
];

export function ComplexApartments({ complex }: ComplexApartmentsProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return "По запросу";
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  return (
    <section id="apartments" className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1]">
            Квартиры
          </h2>
          
          {/* Room Type Filter */}
          <div className="flex gap-2">
            {roomTypes.map((room) => (
              <button
                key={room.value}
                className="px-4 py-2 border border-border hover:border-primary hover:text-primary transition-colors text-[13px] font-medium"
              >
                {room.label}
              </button>
            ))}
          </div>
        </div>

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((room, index) => (
            <div 
              key={room.value}
              className="bg-background p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">
                    {room.value === "studio" ? "Студии" : `${room.label}-комнатные`}
                  </p>
                  <p className="font-serif text-[32px] leading-none">{room.count}</p>
                </div>
                <span className="text-primary text-[24px] font-serif">{String(index + 1).padStart(2, "0")}</span>
              </div>
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-muted-foreground">Площадь</span>
                  <span>{complex.area_from || 25}–{complex.area_to || 120} м²</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted-foreground">Цена от</span>
                  <span className="text-primary font-medium">{formatPrice(complex.price_from)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-[13px] px-8 py-6"
          >
            Показать все квартиры
          </Button>
        </div>
      </div>
    </section>
  );
}
