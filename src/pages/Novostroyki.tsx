import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ComplexCard } from "@/components/novostroyki/ComplexCard";
import { ComplexFilters, FiltersState } from "@/components/novostroyki/ComplexFilters";
import { ComplexesMap } from "@/components/novostroyki/ComplexesMap";
import {
  useResidentialComplexesFiltered,
  useDistrictsList,
  SortOption,
} from "@/hooks/useResidentialComplexesFiltered";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Hammer, CheckCircle2, List, Map, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCity } from "@/contexts/CityContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConsultationBlock } from "@/components/shared/ConsultationBlock";

interface NovostroykiProps {
  initialStatus?: string;
}

type TabType = "all" | "building" | "completed";
type ViewMode = "list" | "map";

const tabs: { value: TabType; label: string; icon: React.ElementType; description: string }[] = [
  { value: "all", label: "Все объекты", icon: Building2, description: "Полный каталог" },
  { value: "building", label: "Строящиеся", icon: Hammer, description: "В процессе строительства" },
  { value: "completed", label: "Готовые", icon: CheckCircle2, description: "Сданы в эксплуатацию" },
];

const sortOptions = [
  { value: "default", label: "По умолчанию" },
  { value: "price_asc", label: "Цена: по возрастанию" },
  { value: "price_desc", label: "Цена: по убыванию" },
  { value: "address_asc", label: "Адрес: А-Я" },
  { value: "address_desc", label: "Адрес: Я-А" },
];

const Novostroyki = ({ initialStatus }: NovostroykiProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentCity } = useCity();
  
  // Determine active tab based on route or initialStatus
  const getInitialTab = (): TabType => {
    if (location.pathname === "/gotovaya-nedvizhimost" || initialStatus === "completed") {
      return "completed";
    }
    return "all";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sort, setSort] = useState<SortOption>("default");
  const [filters, setFilters] = useState<FiltersState>({
    district: "all",
    status: initialStatus || "all",
    priceFrom: "",
    priceTo: "",
  });
  const [page, setPage] = useState(1);

  const { data: districts = [], isLoading: districtsLoading } = useDistrictsList();

  // Reset filters when city changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      district: "all",
    }));
    setPage(1);
  }, [currentCity?.id]);

  // Sync status filter with active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilters(prev => ({ ...prev, status: "all" }));
    } else {
      setFilters(prev => ({ ...prev, status: activeTab }));
    }
    setPage(1);
  }, [activeTab]);

  // Sync tab with route
  useEffect(() => {
    if (location.pathname === "/gotovaya-nedvizhimost") {
      setActiveTab("completed");
    } else if (location.pathname === "/novostroyki" && activeTab !== "all" && activeTab !== "building") {
      // Reset to all when navigating to /novostroyki
    }
  }, [location.pathname]);

  const { data, isLoading, error } = useResidentialComplexesFiltered({
    district: filters.district,
    status: filters.status,
    priceFrom: filters.priceFrom ? Number(filters.priceFrom) : undefined,
    priceTo: filters.priceTo ? Number(filters.priceTo) : undefined,
    page,
    limit: viewMode === "map" ? 100 : 9,
    sort,
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL based on tab
    if (tab === "completed") {
      navigate("/gotovaya-nedvizhimost");
    } else {
      navigate("/novostroyki");
    }
  };

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic city name in titles
  const cityName = currentCity?.name || "Санкт-Петербург";
  const cityNameGenitive = getCityGenitive(cityName);

  const pageTitle = activeTab === "completed" 
    ? `Готовая недвижимость ${cityNameGenitive}` 
    : activeTab === "building"
      ? `Строящиеся новостройки ${cityNameGenitive}`
      : `Новостройки ${cityNameGenitive}`;

  const pageDescription = activeTab === "completed"
    ? `Квартиры в сданных домах ${cityNameGenitive} с ключами — заселяйтесь сразу`
    : activeTab === "building"
      ? `Квартиры в строящихся домах ${cityNameGenitive} по выгодным ценам от застройщиков`
      : `Каталог новостроек ${cityNameGenitive} от проверенных застройщиков с актуальными ценами и планировками`;

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl">
              {pageDescription}
            </p>
          </div>

          {/* Status Tabs - Minimalistic */}
          <div className="mb-12">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      "relative flex items-center gap-3 px-6 py-4 font-medium transition-all duration-200 border-b-2",
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : ""
                    )} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ComplexFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            districts={districts}
            hideStatusFilter={activeTab !== "all"}
          />

          {/* View Mode Toggle + Sort */}
          <div className="flex items-center justify-between mt-8 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                Список
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Карта
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            {isLoading || districtsLoading ? (
              viewMode === "map" ? (
                <Skeleton className="w-full h-[600px] rounded-xl" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive">Ошибка загрузки данных</p>
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-20 h-20 mx-auto text-muted-foreground/50 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Объектов пока нет</h3>
                <p className="text-muted-foreground text-lg">
                  В городе {cityName} пока нет объектов. Выберите другой город или измените фильтры.
                </p>
              </div>
            ) : viewMode === "map" ? (
              <>
                <p className="text-muted-foreground text-lg mb-4">
                  Найдено: <span className="font-medium text-foreground">{data?.total}</span>{" "}
                  {data?.total === 1 ? "объект" : data?.total && data.total < 5 ? "объекта" : "объектов"}
                </p>
                <ComplexesMap
                  complexes={data?.data || []}
                  onComplexClick={(slug) => navigate(`/novostroyki/${slug}`)}
                />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-muted-foreground text-lg">
                    Найдено: <span className="font-medium text-foreground">{data?.total}</span>{" "}
                    {data?.total === 1
                      ? "объект"
                      : data?.total && data.total < 5
                        ? "объекта"
                        : "объектов"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {data?.data.map((complex, index) => (
                    <ComplexCard 
                      key={complex.id} 
                      complex={complex} 
                      variant={index % 2 === 0 ? "image-top" : "image-bottom"}
                    />
                  ))}
                </div>

                {data && data.totalPages > 1 && (
                  <Pagination className="mt-16">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, page - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={pageNum === page}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(data.totalPages, page + 1))}
                          className={
                            page === data.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Consultation Section */}
      <ConsultationBlock
        title="Консультация"
        subtitle="по новостройкам"
        topic="получить бесплатную консультацию по новостройкам"
        variant="dark"
        formSource="novostroyki_page"
      />
    </Layout>
  );
};

// Helper function to get genitive case for city names
function getCityGenitive(cityName: string): string {
  const genitiveMap: Record<string, string> = {
    "Санкт-Петербург": "Санкт-Петербурга",
    "Москва": "Москвы",
    "Дубай": "Дубая",
  };
  return genitiveMap[cityName] || cityName;
}

export default Novostroyki;