import { MapPin, Navigation, Car, Plane } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexLocationProps {
  complex: ResidentialComplex;
}

export function ComplexLocation({ complex }: ComplexLocationProps) {
  return (
    <section className="py-16 lg:py-20 bg-background border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Address */}
        <div className="text-center mb-8">
          <h2 className="font-serif font-normal text-[28px] md:text-[36px] lg:text-[42px] leading-[1.15] mb-4">
            {complex.address || "Адрес не указан"}
          </h2>
          
          {/* District */}
          {complex.district && (
            <p className="text-muted-foreground text-[13px] uppercase tracking-[0.1em]">
              Район {complex.district}
            </p>
          )}
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-border mb-8" />

        {/* Location Info */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Distance to Center */}
          <div className="flex items-start gap-3">
            <Navigation className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] font-medium">
                До центра
              </p>
              <p className="text-[13px] text-muted-foreground">
                10.3 км / 43 мин
              </p>
            </div>
          </div>

          {/* Metro */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] font-medium">
                {complex.address?.split(",")[0] || "Метро"}
              </p>
              <p className="text-[13px] text-muted-foreground">
                7 минут пешком
              </p>
            </div>
          </div>

          {/* KAD */}
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] font-medium">
                КАД
              </p>
              <p className="text-[13px] text-muted-foreground">
                5 км / 19 мин
              </p>
            </div>
          </div>

          {/* Airport */}
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] font-medium">
                Аэропорт
              </p>
              <p className="text-[13px] text-muted-foreground">
                10.6 км / 20 мин
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
