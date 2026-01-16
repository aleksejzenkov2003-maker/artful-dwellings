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
}

export function ServiceAdvantagesGrid({ advantages }: ServiceAdvantagesGridProps) {
  if (!advantages || advantages.length === 0) return null;

  // Generate grid layout based on advantages count
  const getGridClasses = (index: number, total: number) => {
    // Create varied grid patterns
    const patterns = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-2",
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {advantages.map((advantage, index) => {
        const isImageBlock = advantage.background_type === "image" && advantage.image_url;
        const isTerracotta = advantage.background_type === "terracotta";
        
        // Alternate sizes for visual interest
        const sizeClass = advantage.size === "large" 
          ? "md:col-span-2 aspect-[2/1]" 
          : advantage.size === "medium"
          ? "aspect-square"
          : "aspect-[4/3]";

        if (isImageBlock) {
          return (
            <div 
              key={advantage.id} 
              className={`relative overflow-hidden ${sizeClass}`}
            >
              <img
                src={advantage.image_url}
                alt={advantage.title || "Преимущество"}
                className="w-full h-full object-cover"
              />
              {/* Optional overlay with text */}
              {advantage.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-3xl md:text-4xl font-serif italic text-white/80">
                      {advantage.number}/
                    </span>
                    <h4 className="text-white text-sm font-medium tracking-wide uppercase mt-2">
                      {advantage.title}
                    </h4>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div 
            key={advantage.id}
            className={`p-6 lg:p-8 flex flex-col justify-between ${sizeClass} ${
              isTerracotta 
                ? "bg-[#c4a77d] text-white" 
                : "bg-muted/30"
            }`}
          >
            <div>
              <span className={`text-4xl md:text-5xl lg:text-6xl font-serif italic leading-none ${
                isTerracotta ? "text-white/80" : "text-primary"
              }`}>
                {advantage.number}/
              </span>
            </div>
            <div className="mt-4">
              <h4 className={`text-xs font-medium tracking-wide uppercase mb-3 ${
                isTerracotta ? "text-white" : "text-foreground"
              }`}>
                {advantage.title}
              </h4>
              <p className={`text-sm italic leading-relaxed ${
                isTerracotta ? "text-white/90" : "text-muted-foreground"
              }`}>
                {advantage.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
