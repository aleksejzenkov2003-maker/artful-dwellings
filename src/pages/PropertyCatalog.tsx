import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertyPromoBanner } from "@/components/property/PropertyPromoBanner";
import {
  useResidentialComplexesFiltered,
  useDistrictsList,
} from "@/hooks/useResidentialComplexesFiltered";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Building2, Map, List, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCity } from "@/contexts/CityContext";
import { ConsultationBlock } from "@/components/shared/ConsultationBlock";

// City center coordinates for map initialization
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Санкт-Петербург": { lat: 59.9343, lng: 30.3351 },
  "Москва": { lat: 55.7558, lng: 37.6173 },
  "Дубай": { lat: 25.2048, lng: 55.2708 },
};

export interface PropertyFiltersState {
  search: string;
  district: string;
  metro: string;
  areaFrom: string;
  areaTo: string;
  rooms: string[];
  priceFrom: string;
  hasBalcony: boolean;
  hasTerrace: boolean;
}

interface PropertyCatalogProps {
  pageType: "all" | "novostroyki" | "secondary" | "exclusive";
  initialStatus?: string;
}

const pageTitles: Record<string, string> = {
  all: "Вся недвижимость",
  novostroyki: "Новостройки",
  secondary: "Вторичная недвижимость",
  exclusive: "Эксклюзив",
};

const ITEMS_PER_PAGE = 10;

const PropertyCatalog = ({ pageType, initialStatus }: PropertyCatalogProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentCity } = useCity();
  
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<"default" | "address" | "price">("default");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  
  const [filters, setFilters] = useState<PropertyFiltersState>({
    search: "",
    district: "all",
    metro: "all",
    areaFrom: "",
    areaTo: "",
    rooms: [],
    priceFrom: "",
    hasBalcony: false,
    hasTerrace: false,
  });

  const { data: districts = [] } = useDistrictsList();

  // Map pageType to status for filtering
  const getStatusFilter = () => {
    if (pageType === "novostroyki") return "building";
    if (pageType === "secondary") return "completed";
    return initialStatus || "all";
  };

  const { data, isLoading, error } = useResidentialComplexesFiltered({
    district: filters.district,
    status: getStatusFilter(),
    priceFrom: filters.priceFrom ? Number(filters.priceFrom) : undefined,
    page: 1,
    limit: 100, // Get all for client-side pagination
  });

  // Reset when city changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, district: "all", metro: "all" }));
    setVisibleCount(ITEMS_PER_PAGE);
  }, [currentCity?.id]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const handleFiltersChange = (newFilters: PropertyFiltersState) => {
    setFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const displayedItems = data?.data.slice(0, visibleCount) || [];
  const totalCount = data?.total || 0;
  const hasMore = visibleCount < totalCount;

  const cityName = currentCity?.name || "Санкт-Петербург";

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container-wide py-3">
          <nav className="text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate("/")}>
              Главная
            </span>
          </nav>
        </div>
      </div>

      <section className="py-8 lg:py-12">
        <div className="container-wide">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display mb-8">
            {pageTitles[pageType] || "Недвижимость"}
          </h1>

          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="w-80 shrink-0 hidden lg:block">
              <PropertyFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                districts={districts}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Stats & Controls Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display">{totalCount}</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    {totalCount === 1 ? "квартира" : totalCount < 5 ? "квартиры" : "квартир"} в продаже
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
                    className="gap-2"
                  >
                    <Map className="h-4 w-4" />
                    На карте
                  </Button>
                </div>
              </div>

              {/* Sorting */}
              <div className="flex gap-4 mb-8 text-sm">
                <button
                  onClick={() => setSortBy("default")}
                  className={cn(
                    "uppercase tracking-wider transition-colors",
                    sortBy === "default" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Все сортировки
                </button>
                <button
                  onClick={() => setSortBy("address")}
                  className={cn(
                    "uppercase tracking-wider transition-colors",
                    sortBy === "address" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  По адресу
                </button>
                <button
                  onClick={() => setSortBy("price")}
                  className={cn(
                    "uppercase tracking-wider transition-colors",
                    sortBy === "price" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  По цене
                </button>
              </div>

              {/* Map View */}
              {viewMode === "map" && (
                <div className="mb-8 h-[500px] bg-muted rounded-lg overflow-hidden">
                  {(() => {
                    // Get properties with coordinates
                    const propertiesWithCoords = (data?.data || []).filter(
                      (p) => p.coordinates && typeof p.coordinates === 'object' && 'lat' in p.coordinates && 'lng' in p.coordinates
                    );
                    
                    // Build markers string for Yandex Map
                    const cityCenter = cityCoordinates[cityName] || cityCoordinates["Санкт-Петербург"];
                    
                    if (propertiesWithCoords.length === 0) {
                      // Show map centered on city without markers
                      return (
                        <iframe
                          src={`https://yandex.ru/map-widget/v1/?ll=${cityCenter.lng},${cityCenter.lat}&z=11`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allowFullScreen
                        />
                      );
                    }
                    
                    // Build markers for all properties with coordinates
                    const markers = propertiesWithCoords.map((p) => {
                      const coords = p.coordinates as { lat: number; lng: number };
                      return `${coords.lng},${coords.lat},pm2rdm`;
                    }).join('~');
                    
                    // Center on first property or city center
                    const firstCoords = propertiesWithCoords[0].coordinates as { lat: number; lng: number };
                    
                    return (
                      <iframe
                        src={`https://yandex.ru/map-widget/v1/?ll=${firstCoords.lng},${firstCoords.lat}&z=12&pt=${markers}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                      />
                    );
                  })()}
                </div>
              )}

              {/* Property Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-5 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-destructive">Ошибка загрузки данных</p>
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="text-center py-20">
                  <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Объектов не найдено</h3>
                  <p className="text-muted-foreground">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {displayedItems.map((item, index) => (
                      <div key={item.id}>
                        <PropertyCard 
                          property={item} 
                          variant={index % 2 === 0 ? "image-top" : "image-bottom"}
                        />
                        
                        {/* Insert promo banner after every 4 items */}
                        {index === 3 && (
                          <div className="md:col-span-2 mt-6">
                            <PropertyPromoBanner />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="text-center mt-12">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleLoadMore}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
                      >
                        Показать ещё 10 квартир
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-sm text-muted-foreground mt-3">
                        Показано {Math.min(visibleCount, totalCount)} из {totalCount}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <ConsultationBlock
        title="Консультация"
        subtitle="по квартирам"
        topic="получить бесплатную консультацию по квартирам"
        variant="dark"
        formSource="property_catalog_page"
      />
    </Layout>
  );
};

export default PropertyCatalog;
