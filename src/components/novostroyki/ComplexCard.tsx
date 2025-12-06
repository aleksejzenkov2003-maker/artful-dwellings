import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Calendar } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexCardProps {
  complex: ResidentialComplex;
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

export function ComplexCard({ complex }: ComplexCardProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    const quarter = Math.ceil((d.getMonth() + 1) / 3);
    return `${quarter} кв. ${d.getFullYear()}`;
  };

  return (
    <Link
      to={`/novostroyki/${complex.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={complex.main_image || "/placeholder.svg"}
          alt={complex.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {complex.status && (
          <Badge
            variant="outline"
            className={`absolute top-3 left-3 ${statusColors[complex.status] || ""}`}
          >
            {statusLabels[complex.status] || complex.status}
          </Badge>
        )}
        {complex.is_featured && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            Рекомендуем
          </Badge>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          ЖК «{complex.name}»
        </h3>

        {complex.address && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{complex.address}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          {complex.developer && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{complex.developer}</span>
            </div>
          )}
          {complex.completion_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(complex.completion_date)}</span>
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-border/50">
          <div>
            {complex.price_from && (
              <div className="text-xs text-muted-foreground">от</div>
            )}
            <div className="font-semibold text-lg text-primary">
              {formatPrice(complex.price_from) || "Цена по запросу"}
            </div>
          </div>
          {complex.area_from && complex.area_to && (
            <div className="text-right text-sm text-muted-foreground">
              {complex.area_from}–{complex.area_to} м²
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
