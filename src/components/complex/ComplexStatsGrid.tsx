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

  // Pick a secondary image from images array
  let secondaryImage = complex.main_image || "";
  if (Array.isArray(complex.images) && complex.images.length > 0) {
    const first = complex.images[0];
    if (typeof first === "string") secondaryImage = first;
    else if (first && typeof first === "object" && "url" in first) secondaryImage = (first as { url: string }).url;
  }

  return (
    <section id="details" className="py-16 lg:py-24 bg-background">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column — stats + video */}
          <div>
            {/* Stats 2x2 grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 mb-14">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="font-display text-[48px] md:text-[64px] lg:text-[72px] xl:text-[84px] leading-[0.9] text-foreground tracking-[-0.03em]">
                    {stat.value}
                  </div>
                  <p className="text-[11px] lg:text-[12px] uppercase tracking-[0.15em] text-muted-foreground font-medium mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Video Button */}
            <div className="flex items-center gap-5">
              <button className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border-2 border-[#BA846E] flex items-center justify-center group-hover:bg-[#BA846E]/10 transition-colors">
                  <Play className="w-4 h-4 text-[#BA846E] ml-0.5" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-px h-8 bg-[#BA846E]" />
                  <span className="text-[12px] uppercase tracking-[0.15em] font-medium text-foreground">
                    Видео о проекте
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Right column — concept text + image */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-6">
              КОНЦЕПЦИЯ
            </p>

            {shortDescription && (
              <p className="text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground mb-10">
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
