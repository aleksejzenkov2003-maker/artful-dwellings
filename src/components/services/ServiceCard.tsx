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
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  if (service.is_featured) {
    return (
      <Link to={`/uslugi/${service.slug}`} className="group block">
        {/* Featured card with terracotta overlay */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={service.main_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          {/* Terracotta overlay */}
          <div className="absolute inset-0 bg-[#c4a77d]/90 flex flex-col justify-center items-center p-8 text-center">
            <p className="text-white text-sm md:text-base leading-relaxed mb-6 max-w-xs">
              {service.featured_text || `${service.title} - одна из популярных услуг компании Art Estate`}
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#c4a77d] uppercase tracking-wider text-xs"
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
        <p className="text-xs tracking-wider uppercase text-[#C4785A] leading-relaxed">
          {service.short_description?.toUpperCase() || "ПОДРОБНЕЕ ОБ УСЛУГЕ"}
        </p>
      </Link>
    );
  }

  return (
    <Link to={`/uslugi/${service.slug}`} className="group block">
      {/* Image Card */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={service.main_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* Title - Large serif */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mt-6 mb-3 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      
      {/* Description - Orange/red uppercase */}
      <p className="text-xs tracking-wider uppercase text-[#C4785A] leading-relaxed">
        {service.short_description?.toUpperCase() || "ПОДРОБНЕЕ ОБ УСЛУГЕ"}
      </p>
    </Link>
  );
}
