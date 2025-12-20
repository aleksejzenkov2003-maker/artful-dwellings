import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useResidentialComplexes } from "@/hooks/useResidentialComplexes";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/CityContext";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexCardProps {
  complex: ResidentialComplex;
  variant: "overlay" | "text-top" | "text-bottom";
}

function ComplexCard({ complex, variant }: ComplexCardProps) {
  const imageBlock = (
    <div className={`relative overflow-hidden ${variant === "overlay" ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
      <img
        src={complex.main_image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}
        alt={complex.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {variant === "overlay" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      )}
      {variant === "overlay" && (
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          {complex.district && (
            <span className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-white/80 mb-3 block">
              РАЙОН {complex.district.toUpperCase()}
            </span>
          )}
          <h3 className="font-serif font-normal text-[32px] lg:text-[42px] leading-[1.1] text-white mb-2">
            {complex.name}
          </h3>
          {complex.address && (
            <p className="font-sans font-normal text-[14px] text-white/80">
              {complex.address}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const textBlock = variant !== "overlay" && (
    <div className="py-6">
      {complex.district && (
        <span className="font-sans font-medium text-[12px] uppercase tracking-[0.15em] text-muted-foreground mb-3 block">
          РАЙОН {complex.district.toUpperCase()}
        </span>
      )}
      <h3 className="font-serif font-normal text-[36px] lg:text-[48px] leading-[1.1] text-foreground group-hover:text-primary transition-colors mb-2">
        {complex.name}
      </h3>
      {complex.address && (
        <p className="font-sans font-normal text-[14px] text-muted-foreground">
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
      {variant === "text-top" && textBlock}
      {imageBlock}
      {variant === "text-bottom" && textBlock}
    </Link>
  );
}

export function ComplexCatalog() {
  const { data: complexes, isLoading } = useResidentialComplexes({ limit: 4 });
  const { currentCity } = useCity();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/3] mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))}
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

  // Pattern: overlay, text-top, text-bottom, overlay (repeating)
  const getVariant = (index: number): "overlay" | "text-top" | "text-bottom" => {
    const patterns: ("overlay" | "text-top" | "text-bottom")[] = ["overlay", "text-top", "text-bottom", "overlay"];
    return patterns[index % 4];
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {complexes?.map((complex, index) => (
          <ComplexCard
            key={complex.id}
            complex={complex}
            variant={getVariant(index)}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background" asChild>
          <Link to="/novostroyki">Показать все объекты</Link>
        </Button>
      </div>
    </div>
  );
}
