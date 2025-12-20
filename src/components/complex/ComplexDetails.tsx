import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { Building2, Layers, Home, MapPin, Calendar, Ruler } from "lucide-react";

interface ComplexDetailsProps {
  complex: ResidentialComplex;
}

export function ComplexDetails({ complex }: ComplexDetailsProps) {
  return (
    <section id="details" className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1] mb-12">
          Детали
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {complex.developer && (
            <div className="flex flex-col gap-3 p-6 bg-background rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Застройщик</p>
                <p className="font-medium text-[15px]">{complex.developer}</p>
              </div>
            </div>
          )}
          {complex.floors_count && (
            <div className="flex flex-col gap-3 p-6 bg-background rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Этажность</p>
                <p className="font-medium text-[15px]">{complex.floors_count} этажей</p>
              </div>
            </div>
          )}
          {complex.apartments_count && (
            <div className="flex flex-col gap-3 p-6 bg-background rounded-lg">
              <Home className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Квартир</p>
                <p className="font-medium text-[15px]">{complex.apartments_count}</p>
              </div>
            </div>
          )}
          {complex.district && (
            <div className="flex flex-col gap-3 p-6 bg-background rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Район</p>
                <p className="font-medium text-[15px]">{complex.district}</p>
              </div>
            </div>
          )}
          {complex.completion_date && (
            <div className="flex flex-col gap-3 p-6 bg-background rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Сдача</p>
                <p className="font-medium text-[15px]">
                  {new Date(complex.completion_date).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          )}
          {(complex.area_from || complex.area_to) && (
            <div className="flex flex-col gap-3 p-6 bg-background rounded-lg">
              <Ruler className="h-6 w-6 text-primary" />
              <div>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Площади</p>
                <p className="font-medium text-[15px]">
                  {complex.area_from}–{complex.area_to} м²
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
