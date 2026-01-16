import { useState } from "react";
import { Link } from "react-router-dom";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface PropertyCardProps {
  property: ResidentialComplex;
  variant?: "image-top" | "image-bottom";
}

export function PropertyCard({ property, variant = "image-top" }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageBlock = (
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={imageError ? "/placeholder.svg" : (property.main_image || "/placeholder.svg")}
        alt={property.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImageError(true)}
      />
    </div>
  );

  const captionBlock = (
    <div className="py-5">
      {/* District - UPPERCASE, Montserrat Medium, 12-13px, tracking wide */}
      <div className="flex flex-wrap items-center gap-x-4 mb-3">
        {property.district && (
          <span 
            className="font-sans font-medium text-[13px] uppercase tracking-[0.1em] text-[#8A8A8A]"
          >
            РАЙОН {property.district.toUpperCase()}
          </span>
        )}
        
        {/* Metro info - Montserrat Regular, 13-14px */}
        {property.address && (
          <span className="flex items-center gap-2 font-sans font-normal text-[13px] text-[#5F6368]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#E53935] shrink-0"></span>
            {property.address.split(",")[0]} — 10 минут пешком
          </span>
        )}
      </div>
      
      {/* Complex name - Playfair Display, 36-48px, Regular */}
      <h3 
        className="font-serif font-normal text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] mb-2 text-foreground group-hover:text-primary transition-colors"
      >
        {property.name}
      </h3>
      
      {/* Address - Montserrat Regular, 14-16px */}
      {property.address && (
        <p className="font-sans font-normal text-[14px] leading-[1.4] text-[#666666]">
          {property.address}
        </p>
      )}
    </div>
  );

  return (
    <Link
      to={`/novostroyki/${property.slug}`}
      className="group block"
    >
      {variant === "image-top" ? (
        <>
          {imageBlock}
          {captionBlock}
        </>
      ) : (
        <>
          {captionBlock}
          {imageBlock}
        </>
      )}
    </Link>
  );
}
