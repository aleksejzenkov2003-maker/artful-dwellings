import { useState } from "react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexConceptCardsProps {
  complex: ResidentialComplex;
}

interface ImageItem {
  type?: string;
  url?: string;
}

const defaultCards = [
  { title: "Концепция", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" },
  { title: "Материалы, фасад, остекление", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop" },
  { title: "Паркинг", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop" },
];

// Helper to extract URL from image data (handles both string and {url} object formats)
function extractImageUrl(item: unknown): string | null {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object' && 'url' in item) {
    return (item as ImageItem).url || null;
  }
  return null;
}

// Image component with fallback on error
function ConceptCardImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt}
      onError={handleError}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

export function ComplexConceptCards({ complex }: ComplexConceptCardsProps) {
  // Parse images array - handle both string[] and {url, type}[] formats
  const parsedImages: string[] = [];
  
  if (complex.main_image) {
    parsedImages.push(complex.main_image);
  }
  
  if (Array.isArray(complex.images)) {
    complex.images.forEach((item) => {
      const url = extractImageUrl(item);
      if (url) parsedImages.push(url);
    });
  }

  const cards = defaultCards.map((card, index) => ({
    ...card,
    image: parsedImages[index] || card.image,
  }));

  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden group cursor-pointer"
          >
            {/* Background Image with fallback */}
            <ConceptCardImage src={card.image} alt={card.title} fallback={defaultCards[index].image} />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
              {/* Accent Line */}
              <div className="w-12 h-0.5 bg-primary mb-4" />
              
              {/* Title */}
              <h3 className="font-serif font-normal text-[20px] md:text-[24px] lg:text-[28px] leading-[1.2] text-white">
                {card.title}
              </h3>
              
              {/* Bottom Accent Line */}
              <div className="w-12 h-0.5 bg-primary mt-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
