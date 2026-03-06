import { Play } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexStatsGridProps {
  complex: ResidentialComplex;
}

export function ComplexStatsGrid({ complex }: ComplexStatsGridProps) {
  const stats = [
    {
      value: complex.floors_count || "—",
      label: "КОРПУСОВ",
    },
    {
      value: complex.apartments_count || "—",
      label: "КВАРТИР",
    },
    {
      value: complex.area_from && complex.area_to ? `${complex.area_from}-${complex.area_to}` : "—",
      label: "ПЛОЩАДЬ КВАРТИР (М²)",
    },
    {
      value: "2,5-4",
      label: "ВЫСОТА ПОТОЛКОВ (М)",
    },
  ];

  return (
    <section id="details" className="py-16 lg:py-24 bg-background">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-display text-[56px] md:text-[80px] lg:text-[96px] xl:text-[110px] leading-[0.9] text-foreground tracking-[-0.03em]">
                {stat.value}
              </div>
              <p className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-muted-foreground font-medium mt-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Video Button */}
        <div className="flex items-center gap-5">
          <div className="w-px h-14 bg-[#BA846E]" />
          <button className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-full border-2 border-[#BA846E] flex items-center justify-center group-hover:bg-[#BA846E]/10 transition-colors">
              <Play className="w-5 h-5 text-[#BA846E] ml-0.5" />
            </div>
            <span className="text-[12px] uppercase tracking-[0.18em] font-medium text-foreground">
              Видео о проекте
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
