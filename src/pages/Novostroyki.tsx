import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ComplexCard } from "@/components/novostroyki/ComplexCard";
import { ComplexFilters, FiltersState } from "@/components/novostroyki/ComplexFilters";
import {
  useResidentialComplexesFiltered,
  useDistrictsList,
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
import { Building2, Hammer, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NovostroykiProps {
  initialStatus?: string;
}

type TabType = "all" | "building" | "completed";

const tabs: { value: TabType; label: string; icon: React.ElementType; description: string }[] = [
  { value: "all", label: "Все объекты", icon: Building2, description: "Полный каталог" },
  { value: "building", label: "Строящиеся", icon: Hammer, description: "В процессе строительства" },
  { value: "completed", label: "Готовые", icon: CheckCircle2, description: "Сданы в эксплуатацию" },
];

const Novostroyki = ({ initialStatus }: NovostroykiProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on route or initialStatus
  const getInitialTab = (): TabType => {
    if (location.pathname === "/gotovaya-nedvizhimost" || initialStatus === "completed") {
      return "completed";
    }
    return "all";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [filters, setFilters] = useState<FiltersState>({
    district: "all",
    status: initialStatus || "all",
    priceFrom: "",
    priceTo: "",
  });
  const [page, setPage] = useState(1);

  const { data: districts = [] } = useDistrictsList();

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
    limit: 9,
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

  const pageTitle = activeTab === "completed" 
    ? "Готовая недвижимость" 
    : activeTab === "building"
      ? "Строящиеся новостройки"
      : "Новостройки Санкт-Петербурга";

  const pageDescription = activeTab === "completed"
    ? "Квартиры в сданных домах с ключами — заселяйтесь сразу"
    : activeTab === "building"
      ? "Квартиры в строящихся домах по выгодным ценам от застройщиков"
      : "Каталог новостроек от проверенных застройщиков с актуальными ценами и планировками";

  return (
    <Layout>
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {pageDescription}
            </p>
          </div>

          {/* Status Tabs */}
          <div className="mb-8">
            <div className="inline-flex bg-muted/50 rounded-xl p-1.5 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      "relative flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-primary" : ""
                    )} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
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

          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">Ошибка загрузки данных</p>
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры фильтрации
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Найдено: <span className="font-medium text-foreground">{data?.total}</span>{" "}
                    {data?.total === 1
                      ? "объект"
                      : data?.total && data.total < 5
                        ? "объекта"
                        : "объектов"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.data.map((complex) => (
                    <ComplexCard key={complex.id} complex={complex} />
                  ))}
                </div>

                {data && data.totalPages > 1 && (
                  <Pagination className="mt-10">
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
    </Layout>
  );
};

export default Novostroyki;
