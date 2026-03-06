import { MapPin, Navigation, Car, Clock } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexLocationProps {
  complex: ResidentialComplex;
}

export function ComplexLocation({ complex }: ComplexLocationProps) {
  const distances = [
    { time: "3", unit: "мин", label: "Детский сад", icon: Clock },
    { time: "5", unit: "мин", label: "Школа", icon: Clock },
    { time: "7", unit: "мин", label: "Метро", icon: Navigation },
    { time: "10", unit: "мин", label: "Центр города", icon: Car },
  ];

  return (
    <section id="location" className="py-16 lg:py-24 bg-background">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: text + distances */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-4">
              ЛОКАЦИЯ
            </p>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.1] mb-6">
              {complex.address || "Расположение"}
            </h2>

            {complex.district && (
              <p className="text-muted-foreground text-[15px] leading-relaxed mb-10">
                Район {complex.district}. Развитая инфраструктура в шаговой доступности — школы, детские сады, магазины и общественный транспорт.
              </p>
            )}

            {/* Distance grid */}
            <div className="grid grid-cols-2 gap-6">
              {distances.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-[36px] md:text-[48px] font-serif leading-none text-foreground">
                    {item.time}
                  </div>
                  <div className="pt-2">
                    <p className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
                      {item.unit}
                    </p>
                    <p className="text-[14px] font-medium mt-1">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: map placeholder */}
          <div className="relative rounded-none overflow-hidden bg-[#1a2a3a] min-h-[400px] flex items-center justify-center">
            <MapPin className="w-12 h-12 text-white/20" />
            <p className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.15em] text-white/40">
              Карта
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
