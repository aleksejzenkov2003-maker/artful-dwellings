import { Play } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexStatsGridProps {
  complex: ResidentialComplex;
}

export function ComplexStatsGrid({ complex }: ComplexStatsGridProps) {
  const stats = [
    { value: complex.floors_count || "—", label: "корпусов" },
    { value: complex.apartments_count || "—", label: "квартир" },
    { value: complex.area_from && complex.area_to ? `${complex.area_from} - ${complex.area_to}` : "—", label: "площадь квартир (м²)" },
    { value: "2,5 - 4", label: "высота потолков (м)" },
  ];

  const shortDescription = complex.description
    ? complex.description.length > 350
      ? complex.description.substring(0, 350) + "..."
      : complex.description
    : "";

  let secondaryImage = complex.main_image || "";
  if (Array.isArray(complex.images) && complex.images.length > 0) {
    const first = complex.images[0];
    if (typeof first === "string") secondaryImage = first;
    else if (first && typeof first === "object" && "url" in first) secondaryImage = (first as { url: string }).url;
  }

  return (
    <section id="details" className="py-16 lg:py-20 bg-background">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left column — stats + video */}
          <div>
            {/* Stats 2x2 */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="font-display text-[32px] md:text-[38px] lg:text-[42px] leading-[1] text-foreground tracking-[-0.02em]">
                    {stat.value}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium mt-1.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Video Button */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-full border-2 border-[#00C9CE] flex items-center justify-center group-hover:bg-[#00C9CE]/10 transition-colors">
                  <Play className="w-4 h-4 text-[#00C9CE] ml-0.5" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-px h-7 bg-border" />
                  <span className="text-[12px] uppercase tracking-[0.12em] font-medium text-foreground">
                    Видео о проекте
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Right column — concept text + image */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-5">
              КОНЦЕПЦИЯ
            </p>

            {shortDescription && (
              <p className="text-[14px] lg:text-[15px] leading-[1.75] text-muted-foreground mb-8 max-w-[540px]">
                {shortDescription}
              </p>
            )}

            {secondaryImage && (
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={secondaryImage}
                  alt={`${complex.name} — концепция`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
