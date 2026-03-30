import { useState } from "react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentStats } from "@/hooks/useApartments";
import { Button } from "@/components/ui/button";

interface ComplexApartmentsProps {
  complex: ResidentialComplex;
}

const roomTypeLabels: Record<string, string> = {
  "studio": "СТ",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5+": "5+",
};

const roomTypeNames: Record<string, string> = {
  "studio": "Студии",
  "1": "1-комнатные",
  "2": "2-комнатные",
  "3": "3-комнатные",
  "4": "4-комнатные",
  "5+": "5+ комнатные",
};

export function ComplexApartments({ complex }: ComplexApartmentsProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const { data: apartmentStats, isLoading } = useApartmentStats(complex.id);

  const formatPrice = (price: number | null) => {
    if (!price || price === Infinity) return "По запросу";
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const roomTypes = ["studio", "1", "2", "3", "4", "5+"];
  
  // Filter room types that have apartments
  const availableRoomTypes = roomTypes.filter(
    type => apartmentStats?.stats[type]?.count > 0
  );

  // If no apartments in DB, show placeholder
  const hasApartments = availableRoomTypes.length > 0;

  return (
    <section id="apartments" className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1]">
            Квартиры
          </h2>
          
          {/* Room Type Filter */}
          {hasApartments && (
            <div className="flex gap-2">
              {availableRoomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedRoomType(selectedRoomType === type ? null : type)}
                  className={`px-4 py-2 border transition-colors text-[13px] font-medium ${
                    selectedRoomType === type
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {roomTypeLabels[type]}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Загрузка...
          </div>
        ) : hasApartments ? (
          <>
            {/* Apartments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedRoomType ? [selectedRoomType] : availableRoomTypes).map((type, index) => {
                const stats = apartmentStats?.stats[type];
                if (!stats) return null;
                
                return (
                  <div 
                    key={type}
                    className="bg-background p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">
                          {roomTypeNames[type]}
                        </p>
                        <p className="font-serif text-[32px] leading-none">{stats.count}</p>
                      </div>
                      <span className="text-primary text-[24px] font-serif">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between text-[13px] mb-2">
                        <span className="text-muted-foreground">Площадь</span>
                        <span>
                          {stats.minArea === stats.maxArea 
                            ? `${stats.minArea} м²`
                            : `${stats.minArea}–${stats.maxArea} м²`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-muted-foreground">Цена от</span>
                        <span className="text-primary font-medium">
                          {formatPrice(stats.minPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Квартиры пока не добавлены
            </p>
            <p className="text-[14px] text-muted-foreground">
              Свяжитесь с нами для получения актуального каталога квартир
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
