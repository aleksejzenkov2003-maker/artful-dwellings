interface Advantage {
  id: string;
  number: string;
  title: string;
  description: string;
  image_url?: string;
  background_type: "white" | "terracotta" | "image";
  size?: "small" | "medium" | "large";
}

interface ServiceAdvantagesGridProps {
  advantages: Advantage[];
  title?: string;
}

export function ServiceAdvantagesGrid({ advantages, title }: ServiceAdvantagesGridProps) {
  if (!advantages || advantages.length === 0) return null;

  // Define grid span classes for masonry effect
  const getSpanClasses = (advantage: Advantage, index: number) => {
    const size = advantage.size || "medium";
    const bgType = advantage.background_type;
    
    // Image blocks are larger
    if (bgType === "image") {
      return "md:col-span-2 md:row-span-2";
    }
    
    // Size-based spans
    if (size === "large") {
      return "md:col-span-2 md:row-span-2";
    }
    if (size === "medium") {
      // Alternate between single and double spans
      return index % 3 === 0 ? "md:col-span-2" : "";
    }
    return "";
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">{title}</h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
          {advantages.map((advantage, index) => {
            const isImageBlock = advantage.background_type === "image" && advantage.image_url;
            const isTerracotta = advantage.background_type === "terracotta";
            const spanClasses = getSpanClasses(advantage, index);

            if (isImageBlock) {
              return (
                <div 
                  key={advantage.id} 
                  className={`relative overflow-hidden min-h-[300px] md:min-h-[400px] ${spanClasses}`}
                >
                  <img
                    src={advantage.image_url}
                    alt={advantage.title || "Преимущество"}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  {advantage.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 md:p-8">
                      <div>
                        <span className="text-4xl md:text-5xl font-serif italic text-white/80">
                          {advantage.number}/
                        </span>
                        <h4 className="text-white text-sm font-medium tracking-widest uppercase mt-3">
                          {advantage.title}
                        </h4>
                        {advantage.description && (
                          <p className="text-white/80 text-sm mt-2 max-w-xs">
                            {advantage.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div 
                key={advantage.id}
                className={`p-6 md:p-8 flex flex-col justify-between min-h-[280px] ${spanClasses} ${
                  isTerracotta 
                    ? "bg-[#c4a77d] text-white" 
                    : "bg-muted/30"
                }`}
              >
                <div>
                  <span className={`text-5xl md:text-6xl lg:text-7xl font-serif italic leading-none block ${
                    isTerracotta ? "text-white/80" : "text-primary"
                  }`}>
                    {advantage.number}/
                  </span>
                </div>
                <div className="mt-auto pt-8">
                  <h4 className={`text-xs font-medium tracking-widest uppercase mb-3 ${
                    isTerracotta ? "text-white" : "text-foreground"
                  }`}>
                    {advantage.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    isTerracotta ? "text-white/90" : "text-muted-foreground"
                  }`}>
                    {advantage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
