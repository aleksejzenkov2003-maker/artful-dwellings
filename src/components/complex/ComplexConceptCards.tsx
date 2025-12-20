import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexConceptCardsProps {
  complex: ResidentialComplex;
}

const defaultCards = [
  { title: "Концепция", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" },
  { title: "Материалы, фасад, остекление", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" },
  { title: "Паркинг", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
];

export function ComplexConceptCards({ complex }: ComplexConceptCardsProps) {
  const images = complex.main_image 
    ? [complex.main_image, ...(Array.isArray(complex.images) ? complex.images as string[] : [])]
    : (Array.isArray(complex.images) ? complex.images as string[] : []);

  const cards = defaultCards.map((card, index) => ({
    ...card,
    image: images[index] || card.image,
  }));

  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden group cursor-pointer"
          >
            {/* Background Image */}
            <img 
              src={card.image} 
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
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
