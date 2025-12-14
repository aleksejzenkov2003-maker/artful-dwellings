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

  // Get gallery images
  const images = Array.isArray(property.images) 
    ? (property.images as string[])
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
      <DialogContent className="max-w-6xl w-[95vw] p-0 gap-0 overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4 border-b border-border bg-background">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {property.district || "Приморский район"} · {property.developer || "Setl Group"}
            </p>
            <h2 className="text-lg md:text-xl font-serif truncate">
              {property.address || `Санкт-Петербург, ${property.district || "Приморский район"}`}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-lg md:text-xl font-semibold text-primary whitespace-nowrap">
                {formatPrice(property.price_from)}
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                / {formatPricePerSqm(property.price_from, property.area_from)}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
              <Link to={`/novostroyki/${property.slug}`}>В деталях</Link>
            </Button>
          </div>
        </div>

        {/* Tabs row */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-border bg-background">
          <div className="flex items-center gap-1 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-xs uppercase tracking-wider transition-colors rounded whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button size="sm" className="flex-shrink-0">
            Оставить заявку на квартиру
          </Button>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Gallery */}
          <div className="lg:w-3/5 flex-shrink-0">
            {/* Main Image */}
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
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 p-4 bg-background border-t border-border overflow-x-auto">
              {(images.length > 0 ? images : [property.main_image || "/placeholder.svg"]).slice(0, 6).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-24 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all",
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

          {/* Right side - Details */}
          <div className="lg:w-2/5 border-l border-border bg-background overflow-y-auto max-h-[60vh] lg:max-h-none">
            <div className="p-5">
              <table className="w-full text-sm">
                <tbody>
                  {propertyDetails.map((detail, idx) => (
                    <tr 
                      key={idx} 
                      className={cn(
                        "border-b border-border/50",
                        idx === propertyDetails.length - 1 && "border-b-0"
                      )}
                    >
                      <td className="py-3 text-muted-foreground pr-4">{detail.label}</td>
                      <td className="py-3 text-right font-medium text-foreground">{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Consultation form */}
        <div className="p-5 border-t border-border bg-muted/30">
          <h3 className="text-base font-serif mb-3">Получить консультацию</h3>
          <div className="flex gap-3">
            <Input placeholder="Ваш телефон" className="flex-1 bg-background" />
            <Button className="flex-shrink-0">Заказать</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
