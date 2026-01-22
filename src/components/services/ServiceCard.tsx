import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  slug: string;
  title: string;
  short_description?: string | null;
  main_image?: string | null;
  is_featured?: boolean;
  featured_text?: string | null;
  hover_text?: string | null;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  // Default hover text if not provided
  const hoverText = service.hover_text || 
    `С компанией «Art Estate» вы получите профессиональную помощь в ${service.title.toLowerCase()}`;

  if (service.is_featured) {
    return (
      <Link to={`/uslugi/${service.slug}`} className="group block">
        {/* Featured card with terracotta overlay always visible */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={service.main_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          {/* Terracotta overlay - always visible for featured */}
          <div className="absolute inset-0 bg-[#c4a77d]/90 flex flex-col justify-center items-center p-8 text-center">
            <p className="text-white text-sm md:text-base leading-relaxed italic font-serif mb-6 max-w-xs">
              {service.featured_text || hoverText}
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#c4a77d] uppercase tracking-wider text-xs px-6 py-2"
            >
              Перейти к услуге
            </Button>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mt-6 mb-3 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        
        {/* Description */}
      <p className="text-xs tracking-wider uppercase text-[#9a7b5c] leading-relaxed">
          {service.short_description?.toUpperCase() || "ПОДРОБНЕЕ ОБ УСЛУГЕ"}
        </p>
      </Link>
    );
  }

  return (
    <Link to={`/uslugi/${service.slug}`} className="group block">
      {/* Image Card with hover overlay */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={service.main_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover overlay - appears on hover */}
        <div className="absolute inset-0 bg-[#c4a77d]/90 flex flex-col justify-center items-center p-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm md:text-base leading-relaxed italic font-serif mb-6 max-w-xs">
            {hoverText}
          </p>
          <Button 
            variant="outline" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-[#c4a77d] uppercase tracking-wider text-xs px-6 py-2"
          >
            Перейти к услуге
          </Button>
        </div>
      </div>
      
      {/* Title - Large serif */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mt-6 mb-3 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      
      {/* Description - Orange/red uppercase */}
      <p className="text-xs tracking-wider uppercase text-[#9a7b5c] leading-relaxed">
        {service.short_description?.toUpperCase() || "ПОДРОБНЕЕ ОБ УСЛУГЕ"}
      </p>
    </Link>
  );
}
