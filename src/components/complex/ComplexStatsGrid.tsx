import { Play } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexStatsGridProps {
  complex: ResidentialComplex;
}

export function ComplexStatsGrid({ complex }: ComplexStatsGridProps) {
  const stats = [
    {
      value: complex.floors_count || "—",
      label: "корпусов",
    },
    {
      value: complex.apartments_count || "—",
      label: "квартир",
    },
    {
      value: complex.area_from && complex.area_to ? `${complex.area_from}-${complex.area_to}` : "—",
      label: "площадь квартир (м²)",
    },
    {
      value: "2,5-4",
      label: "высота потолков (м)",
    },
  ];

  return (
    <section id="details" className="py-16 lg:py-24 bg-background border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-serif text-[48px] md:text-[64px] lg:text-[72px] leading-none text-foreground mb-2">
                {stat.value}
              </div>
              <p className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Video Button */}
        <div className="flex items-center gap-6">
          <div className="w-px h-12 bg-[#BA846E]" />
          <button className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-full border-2 border-[#BA846E] flex items-center justify-center group-hover:bg-[#BA846E]/10 transition-colors">
              <Play className="w-5 h-5 text-[#BA846E] ml-0.5" />
            </div>
            <span className="text-[13px] uppercase tracking-[0.12em] font-medium text-foreground">
              Видео о проекте
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
