import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexAdvantagesProps {
  complex: ResidentialComplex;
}

export function ComplexAdvantages({ complex }: ComplexAdvantagesProps) {
  const features = Array.isArray(complex.features) ? (complex.features as string[]) : [];
  const infrastructure = Array.isArray(complex.infrastructure) ? (complex.infrastructure as string[]) : [];
  
  // Combine features and infrastructure for advantages
  const advantages = [
    ...(infrastructure.length > 0 
      ? [{ title: "Сложившаяся инфраструктура", description: infrastructure.join(", ") }]
      : []),
    ...(features.length > 0 
      ? [{ title: "Собственная инфраструктура", description: features.join(", ") }]
      : []),
  ];

  // Default advantages if none provided
  const displayAdvantages = advantages.length > 0 ? advantages : [
    { title: "Сложившаяся инфраструктура", description: "В шаговой доступности расположены школы, гимназия, детские сады, творческие студии, магазины и пр." },
    { title: "Собственная инфраструктура", description: "Подземный паркинг, кладовые, кинозал, коворкинг, детский клуб и комната для спорта. Закрытая территория." },
  ];

  const images = complex.main_image 
    ? [complex.main_image, ...(Array.isArray(complex.images) ? complex.images as string[] : [])]
    : (Array.isArray(complex.images) ? complex.images as string[] : []);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <h2 className="font-serif font-normal text-[48px] md:text-[64px] leading-[1.1] mb-16">
          Плюсы
        </h2>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {displayAdvantages.map((advantage, index) => (
            <div 
              key={index}
              className={`relative ${
                index % 2 === 0 
                  ? "lg:pr-8" 
                  : "lg:pl-8"
              }`}
            >
              {/* Background Image for even items */}
              {index % 2 === 1 && images[index] && (
                <div 
                  className="absolute inset-0 bg-cover bg-center -z-10"
                  style={{ backgroundImage: `url(${images[index]})` }}
                >
                  <div className="absolute inset-0 bg-[#C4A882]/80" />
                </div>
              )}
              
              {/* Content */}
              <div className={`py-12 lg:py-16 ${index % 2 === 1 ? "px-8 lg:px-12 text-white" : ""}`}>
                {/* Number */}
                <div className="flex items-start gap-2 mb-4">
                  <span className={`font-serif text-[48px] lg:text-[64px] leading-none ${
                    index % 2 === 1 ? "text-white/30" : "text-primary/30"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-primary text-3xl leading-none">/</span>
                </div>
                
                {/* Title */}
                <h3 className={`text-[13px] uppercase tracking-[0.1em] font-medium mb-4 ${
                  index % 2 === 1 ? "text-white" : "text-foreground"
                }`}>
                  {advantage.title}
                </h3>
                
                {/* Description */}
                <p className={`font-serif text-[18px] lg:text-[20px] leading-[1.5] ${
                  index % 2 === 1 ? "text-white/90" : "text-muted-foreground"
                }`}>
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Image Row */}
        {images.length > 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-0">
            {images.slice(2, 4).map((image, index) => (
              <div key={index} className="aspect-[16/10] overflow-hidden">
                <img 
                  src={image} 
                  alt={`${complex.name} - преимущество ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
