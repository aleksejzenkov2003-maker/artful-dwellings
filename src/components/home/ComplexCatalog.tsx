import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useResidentialComplexes } from "@/hooks/useResidentialComplexes";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/CityContext";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexCardProps {
  complex: ResidentialComplex;
  isLarge?: boolean;
}

function formatPrice(price: number | null): string {
  if (!price) return "";
  return `от ${price.toLocaleString("ru-RU")} ₽/м²`;
}

function ComplexCard({ complex, isLarge = false }: ComplexCardProps) {
  const [imageError, setImageError] = useState(false);
  const isNew = complex.status === "building" || complex.status === "pre-sale";
  const fallbackImage = "/placeholder.svg";

  return (
    <Link
      to={`/novostroyki/${complex.slug}`}
      className={`group block relative overflow-hidden ${isLarge ? "aspect-[3/4]" : "aspect-[4/3]"}`}
    >
      <img
        src={imageError ? fallbackImage : (complex.main_image || fallbackImage)}
        alt={complex.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      {/* New badge */}
      {isNew && (
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground font-sans font-medium text-[11px] uppercase tracking-wider px-3 py-1.5">
            Новый объект
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        {complex.developer && (
          <span className="font-sans font-medium text-[11px] uppercase tracking-[0.12em] text-white/70 mb-1.5 block">
            {complex.developer}
          </span>
        )}
        <h3 className="font-serif font-normal text-[22px] lg:text-[26px] leading-[1.15] text-white mb-1.5">
          {complex.name}
        </h3>
        {complex.price_from && (
          <p className="font-sans font-medium text-[14px] text-primary">
            {formatPrice(complex.price_from)}
          </p>
        )}
        {isLarge && complex.address && (
          <p className="font-sans font-normal text-[13px] text-white/60 mt-2">
            {complex.address}
          </p>
        )}
      </div>
    </Link>
  );
}

export function ComplexCatalog() {
  const { data: complexes, isLoading } = useResidentialComplexes({ limit: 6 });
  const { currentCity } = useCity();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="aspect-[3/4]" />
          <Skeleton className="aspect-[4/3]" />
        </div>
      </div>
    );
  }

  if (!complexes || complexes.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          В городе {currentCity?.name || "—"} пока нет объектов в каталоге.
        </p>
      </div>
    );
  }

  // Split complexes: first 4 for top row, next 2 for bottom row
  const topRow = complexes.slice(0, 4);
  const bottomRow = complexes.slice(4, 6);

  return (
    <div>
      {/* Top row: 4 equal cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {topRow.map((complex) => (
          <ComplexCard key={complex.id} complex={complex} />
        ))}
      </div>

      {/* Bottom row: 1 large + 1 regular */}
      {bottomRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bottomRow[0] && (
            <ComplexCard complex={bottomRow[0]} isLarge />
          )}
          {bottomRow[1] && (
            <ComplexCard complex={bottomRow[1]} />
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background" asChild>
          <Link to="/novostroyki">Показать все объекты</Link>
        </Button>
      </div>
    </div>
  );
}
