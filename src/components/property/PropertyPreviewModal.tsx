import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { cn } from "@/lib/utils";

interface PropertyPreviewModalProps {
  property: ResidentialComplex;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyPreviewModal({ property, open, onOpenChange }: PropertyPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"photo" | "video" | "3d" | "plan" | "map">("photo");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get gallery images - check if images array has actual content
  const imagesArray = Array.isArray(property.images) ? (property.images as string[]) : [];
  const images = imagesArray.length > 0 
    ? imagesArray 
    : property.main_image 
      ? [property.main_image] 
      : [];

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

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Mock property details
  const propertyDetails = [
    { label: "Этаж", value: "3 / 10" },
    { label: "Количество комнат", value: "1" },
    { label: "Количество уровней", value: "2" },
    { label: "Количество санузлов", value: "2" },
    { label: "Общая площадь", value: `${property.area_from || 45} м²` },
    { label: "Жилая площадь", value: "25 м²" },
    { label: "Площадь кухни", value: "10 м²" },
    { label: "Высота потолков", value: "2,7 м" },
    { label: "Балкон", value: "7 м²" },
    { label: "Терраса", value: "-" },
    { label: "Отделка", value: "Чистовая" },
    { label: "Мебель", value: "Есть" },
    { label: "Тип дома", value: "Монолит" },
  ];

  const tabs = [
    { id: "photo", label: "Фото" },
    { id: "video", label: "Видео" },
    { id: "3d", label: "3D" },
    { id: "plan", label: "Планировка" },
    { id: "map", label: "Карта" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border bg-background flex-shrink-0">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {property.district || "Приморский район"} · {property.developer || "Setl Group"}
            </p>
            <h2 className="text-base md:text-lg font-serif truncate">
              {property.address || `Санкт-Петербург, ${property.district || "Приморский район"}`}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-base md:text-lg font-semibold text-primary whitespace-nowrap">
                {formatPrice(property.price_from)}
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                / {formatPricePerSqm(property.price_from, property.area_from)}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
              <Link to={`/novostroyki/${property.slug}`}>Подробнее</Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-background flex-shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs uppercase tracking-wider transition-colors rounded whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            {/* Left - Gallery */}
            <div className="md:w-1/2 flex-shrink-0">
              <div className="relative aspect-[4/3] bg-muted">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Нет изображений
                  </div>
                )}
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/90 rounded flex items-center justify-center hover:bg-background transition-colors shadow"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/90 rounded flex items-center justify-center hover:bg-background transition-colors shadow"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-1 p-2 bg-background border-t border-border overflow-x-auto">
                {(images.length > 0 ? images : [property.main_image || "/placeholder.svg"]).slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-14 h-10 flex-shrink-0 rounded overflow-hidden border transition-all",
                      currentImageIndex === idx 
                        ? "border-primary ring-1 ring-primary" 
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Details */}
            <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-border">
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    {propertyDetails.map((detail, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-border/50 last:border-b-0"
                      >
                        <td className="py-2 text-muted-foreground pr-2 text-xs">{detail.label}</td>
                        <td className="py-2 text-right font-medium text-foreground text-xs">{detail.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer form */}
        <div className="p-4 border-t border-border bg-muted/30 flex-shrink-0">
          <div className="flex gap-2">
            <Input placeholder="Ваш телефон" className="flex-1 bg-background h-9 text-sm" />
            <Button size="sm">Заказать</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
