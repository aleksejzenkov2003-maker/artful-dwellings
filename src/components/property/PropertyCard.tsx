import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: ResidentialComplex;
  variant?: "default" | "large";
}

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return null;
    const millions = price / 1000000;
    return `${millions.toFixed(1).replace(".", ",")} МЛН ₽`;
  };

  const formatPricePerSqm = (price: number | null, area: number | null) => {
    if (!price || !area) return null;
    const pricePerSqm = Math.round(price / area);
    return new Intl.NumberFormat("ru-RU").format(pricePerSqm) + " за м²";
  };

  const isLarge = variant === "large";

  return (
    <Link
      to={`/novostroyki/${property.slug}`}
      className={cn(
        "group block relative overflow-hidden rounded-lg",
        isLarge ? "aspect-[4/5]" : "aspect-square"
      )}
    >
      {/* Background Image */}
      <img
        src={property.main_image || "/placeholder.svg"}
        alt={property.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top Tags */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        {property.district && (
          <Badge variant="secondary" className="bg-white/90 text-foreground text-xs">
            {property.district}
          </Badge>
        )}
        {property.address && (
          <Badge className="bg-primary/90 text-primary-foreground text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {property.address.split(",")[0]}
          </Badge>
        )}
      </div>

      {/* Featured Badge */}
      {property.is_featured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-[hsl(var(--coral))] text-white text-xs">
            Новое предложение
          </Badge>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl md:text-2xl font-display text-white mb-2">
          {property.address?.split(",")[0] || property.name}
        </h3>
        
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/70 mb-3">
          {property.area_from && (
            <span>{property.area_from} м²</span>
          )}
          <span className="text-white/40">·</span>
          <span>3 комнаты</span>
          {(property.features as string[] | null)?.includes("Балкон") && (
            <>
              <span className="text-white/40">·</span>
              <span className="text-primary">Балкон</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-semibold text-primary">
            {formatPrice(property.price_from)}
          </span>
          <span className="text-sm text-white/60">
            / {formatPricePerSqm(property.price_from, property.area_from)}
          </span>
        </div>
      </div>

      {/* Teal corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-full border-r-2 border-b-2 border-primary opacity-50" />
      </div>
    </Link>
  );
}
