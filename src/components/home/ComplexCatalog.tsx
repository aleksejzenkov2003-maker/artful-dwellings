import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useResidentialComplexes } from "@/hooks/useResidentialComplexes";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/CityContext";

function formatPrice(price: number | null): string {
  if (!price) return "";
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)} млн ₽`;
  }
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function ComplexCatalog() {
  const { data: complexes, isLoading } = useResidentialComplexes({ limit: 6 });
  const { currentCity } = useCity();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-border">
            <Skeleton className="aspect-[4/3]" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-28" />
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complexes?.map((complex) => (
          <Link
            key={complex.id}
            to={`/novostroyki/${complex.slug}`}
            className="group bg-card border border-border hover:border-primary transition-colors"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={complex.main_image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"}
                alt={complex.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  complex.status === "completed" ? "text-green-600" : "text-primary"
                }`}>
                  {complex.status === "completed" ? "Сдан" : 
                   complex.status === "building" ? "Строится" : "В продаже"}
                </span>
              </div>
              <h3 className="text-lg font-serif font-medium mb-1 group-hover:text-primary transition-colors">
                {complex.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{complex.district}</p>
              <p className="text-primary font-medium">
                от {formatPrice(complex.price_from)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background" asChild>
          <Link to="/novostroyki">Показать все объекты</Link>
        </Button>
      </div>
    </div>
  );
}
