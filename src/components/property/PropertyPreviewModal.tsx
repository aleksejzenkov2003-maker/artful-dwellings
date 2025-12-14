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

  // Mock property details for secondary market
  const propertyDetails = [
    { label: "Этаж", value: "3 / 10" },
    { label: "Количество комнат", value: "1" },
    { label: "Количество уровней", value: "2" },
    { label: "Количество санузлов", value: "2" },
    { label: "Общая площадь", value: `${property.area_from || 40} м²` },
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
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {property.district || "Фрунзенский район"} · {property.developer || "Премиум проект"}
            </p>
            <h2 className="text-xl md:text-2xl font-serif">
              {property.address || property.name}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl font-semibold text-primary">
                {formatPrice(property.price_from)}
              </div>
              <div className="text-xs text-muted-foreground">
                / {formatPricePerSqm(property.price_from, property.area_from)}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to={`/novostroyki/${property.slug}`}>В деталях</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left side - Gallery */}
          <div className="flex-1 lg:w-3/5">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 text-xs uppercase tracking-wider transition-colors rounded",
                    activeTab === tab.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
              <Button size="sm" className="ml-auto">
                Оставить заявку на квартиру
              </Button>
            </div>

            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-muted">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-20 h-14 flex-shrink-0 rounded overflow-hidden border-2 transition-colors",
                      currentImageIndex === idx ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {images.length > 5 && (
                  <div className="w-20 h-14 flex-shrink-0 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="lg:w-2/5 border-l border-border">
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  {propertyDetails.map((detail, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0">
                      <td className="py-2 text-muted-foreground">{detail.label}</td>
                      <td className="py-2 text-right font-medium">{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Consultation form */}
        <div className="p-6 border-t border-border bg-muted/30">
          <h3 className="text-lg font-serif mb-4">Получить консультацию</h3>
          <div className="flex gap-4">
            <Input placeholder="Ваш телефон" className="flex-1" />
            <Button>Заказать</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
