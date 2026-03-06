import { useState } from "react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexAdvantagesProps {
  complex: ResidentialComplex;
}

interface ImageItem {
  type?: string;
  url?: string;
}

function extractImageUrl(item: unknown): string | null {
  if (typeof item === "string") return item;
  if (item && typeof item === "object" && "url" in item) {
    return (item as ImageItem).url || null;
  }
  return null;
}

export function ComplexAdvantages({ complex }: ComplexAdvantagesProps) {
  const features = Array.isArray(complex.features) ? (complex.features as string[]) : [];
  const infrastructure = Array.isArray(complex.infrastructure) ? (complex.infrastructure as string[]) : [];

  const advantages = [
    ...(infrastructure.length > 0
      ? [{ title: "Сложившаяся инфраструктура", description: infrastructure.join(", ") }]
      : []),
    ...(features.length > 0
      ? [{ title: "Собственная инфраструктура", description: features.join(", ") }]
      : []),
  ];

  const displayAdvantages =
    advantages.length > 0
      ? advantages
      : [
          { title: "Сложившаяся инфраструктура", description: "Школы, детские сады, магазины и транспорт в шаговой доступности" },
          { title: "Собственная инфраструктура", description: "Паркинг, кладовые, коворкинг, детский клуб. Закрытая территория" },
        ];

  // Parse images
  const parsedImages: string[] = [];
  if (complex.main_image) parsedImages.push(complex.main_image);
  if (Array.isArray(complex.images)) {
    complex.images.forEach((item) => {
      const url = extractImageUrl(item);
      if (url) parsedImages.push(url);
    });
  }

  return (
    <section id="advantages" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-4">
              ПЛЮСЫ
            </p>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.1]">
              Преимущества
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              {complex.description
                ? complex.description.substring(0, 150) + (complex.description.length > 150 ? "..." : "")
                : "Современный жилой комплекс с продуманной инфраструктурой и благоустроенной территорией."}
            </p>
          </div>
        </div>

        {/* Horizontal scrollable cards */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
          {displayAdvantages.map((advantage, index) => (
            <div
              key={index}
              className="shrink-0 w-[300px] lg:w-[360px] group"
            >
              {/* Image */}
              {parsedImages[index] && (
                <div className="aspect-[4/3] overflow-hidden mb-4">
                  <img
                    src={parsedImages[index]}
                    alt={advantage.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {/* Number */}
              <span className="text-[11px] text-muted-foreground tracking-wider">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* Title */}
              <h3 className="text-[14px] uppercase tracking-[0.08em] font-medium mt-2 mb-3">
                {advantage.title}
              </h3>
              {/* Description */}
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Panoramic image */}
        {parsedImages.length > 2 && (
          <div className="mt-12 aspect-[21/9] overflow-hidden">
            <img
              src={parsedImages[2]}
              alt={`${complex.name} — панорама`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
