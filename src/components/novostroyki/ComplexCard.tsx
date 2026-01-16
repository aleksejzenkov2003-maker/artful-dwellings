import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexCardProps {
  complex: ResidentialComplex;
  variant?: "image-top" | "image-bottom";
}

const statusLabels: Record<string, string> = {
  building: "Строится",
  completed: "Сдан",
  soon: "Скоро старт",
};

const statusColors: Record<string, string> = {
  building: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  soon: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export function ComplexCard({ complex, variant = "image-top" }: ComplexCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const imageBlock = (
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={imageError ? "/placeholder.svg" : (complex.main_image || "/placeholder.svg")}
        alt={complex.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={() => setImageError(true)}
      />
      {complex.status && (
        <Badge
          variant="outline"
          className={`absolute top-4 left-4 ${statusColors[complex.status] || ""}`}
        >
          {statusLabels[complex.status] || complex.status}
        </Badge>
      )}
      {complex.is_featured && (
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          Рекомендуем
        </Badge>
      )}
    </div>
  );

  const captionBlock = (
    <div className="py-6">
      {/* District and metro info */}
      <div className="flex flex-wrap items-center gap-x-4 text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {complex.district && <span>РАЙОН {complex.district.toUpperCase()}</span>}
        {complex.address && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {complex.address}
          </span>
        )}
      </div>
      
      {/* Complex name - Large serif */}
      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-2 group-hover:text-primary transition-colors">
        {complex.name}
      </h3>
      
      {/* Address */}
      {complex.address && (
        <p className="text-muted-foreground text-sm">
          {complex.address}
        </p>
      )}
    </div>
  );

  return (
    <Link
      to={`/novostroyki/${complex.slug}`}
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
