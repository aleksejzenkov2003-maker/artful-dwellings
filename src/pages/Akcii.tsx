import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { usePromotions } from "@/hooks/usePromotions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCity } from "@/contexts/CityContext";
import { ConsultationBlock } from "@/components/shared/ConsultationBlock";

const ITEMS_PER_PAGE = 5;

const Akcii = () => {
  const { data: promotions, isLoading } = usePromotions();
  const { currentCity } = useCity();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"current" | "archive">("current");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [complexName, setComplexName] = useState("");

  const activePromo = promotions?.[currentSlide] || promotions?.[0];

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return null;
    
    const start = startDate ? format(new Date(startDate), "dd.MM.yy", { locale: ru }) : "";
    const end = endDate ? format(new Date(endDate), "dd.MM.yy", { locale: ru }) : "";
    
    if (start && end) return `${start} — ${end}`;
    if (end) return `до ${end}`;
    return null;
  };

  const nextSlide = () => {
    if (promotions && promotions.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }
  };

  const prevSlide = () => {
    if (promotions && promotions.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
    }
  };

  // Get unique categories
  const categories = [...new Set(promotions?.map(p => p.category).filter(Boolean) || [])];

  // Filter promotions
  const filteredPromotions = promotions?.filter(promo => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(promo.category || "")) {
      return false;
    }
    if (complexName && !promo.title.toLowerCase().includes(complexName.toLowerCase())) {
      return false;
    }
    return true;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setComplexName("");
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Главная
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
            Акции — {currentCity?.name || "Санкт-Петербург"}
          </h1>
        </div>
      </section>

      {/* Hero Slider */}
      {!isLoading && promotions && promotions.length > 0 && (
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row bg-muted rounded-lg overflow-hidden min-h-[280px]">
              {/* Left content */}
              <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center">
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 uppercase">
                    Акция
                  </span>
                  {activePromo?.category && (
                    <span className="text-muted-foreground text-xs">
                      «{activePromo.category}», и еще объекты
                    </span>
                  )}
                </div>
                
                {formatDateRange(activePromo?.start_date || null, activePromo?.end_date || null) && (
                  <p className="text-muted-foreground text-sm mb-2">
                    {formatDateRange(activePromo?.start_date || null, activePromo?.end_date || null)}
                  </p>
                )}
                
                <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-6 leading-tight max-w-md">
                  {activePromo?.title}
                </h2>
                
                <div className="flex items-center gap-4">
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm" 
                    className="uppercase text-xs tracking-wider px-6"
                  >
                    <Link to={activePromo?.slug ? `/akcii/${activePromo.slug}` : '/akcii'}>Подробнее</Link>
                  </Button>
                </div>

                {/* Slider dots */}
                <div className="flex gap-2 mt-6">
                  {promotions.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Right image */}
              <div className="flex-1 relative min-h-[200px] md:min-h-full">
                {activePromo?.cover_image ? (
                  <img 
                    key={activePromo.id}
                    src={activePromo.cover_image}
                    alt={activePromo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-6xl">🎁</span>
                  </div>
                )}
                {/* Navigation arrows */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={prevSlide}
                    className="w-10 h-10 bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors rounded"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-10 h-10 bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors rounded"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0 space-y-8">
              {/* Consultation form */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-medium mb-1">ПОЛУЧИТЕ</h3>
                <h4 className="text-sm font-medium mb-4">КОНСУЛЬТАЦИЮ</h4>
                <Input placeholder="Ваш телефон" className="mb-3" />
                <Button className="w-full">Заказать</Button>
              </div>

              {/* Filters */}
              <div>
                <h3 className="text-sm font-medium mb-4 uppercase">Тип акции</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox 
                      checked={selectedCategories.length === 0}
                      onCheckedChange={() => setSelectedCategories([])}
                    />
                    Все
                  </label>
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox 
                        checked={selectedCategories.includes(category || "")}
                        onCheckedChange={() => toggleCategory(category || "")}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              {/* Complex name filter */}
              <div>
                <h3 className="text-sm font-medium mb-4 uppercase">Название ЖК</h3>
                <Input 
                  placeholder="Введите название" 
                  value={complexName}
                  onChange={(e) => {
                    setComplexName(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Reset filters */}
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Сбросить фильтр
              </button>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex gap-8 border-b border-border mb-8">
                <button
                  onClick={() => setActiveTab("current")}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "current" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Текущие
                </button>
                <button
                  onClick={() => setActiveTab("archive")}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "archive" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Архивные
                </button>
              </div>

              {/* Promotions list */}
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-6 p-4 border border-border rounded-lg">
                      <Skeleton className="w-48 h-32 flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedPromotions.length > 0 ? (
                <div className="space-y-4">
                  {paginatedPromotions.map((promo) => (
                    <div 
                      key={promo.id}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-full sm:w-48 h-32 flex-shrink-0 bg-muted rounded overflow-hidden">
                        {promo.cover_image ? (
                          <img 
                            src={promo.cover_image} 
                            alt={promo.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-3xl">🎁</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="mb-2">
                          {formatDateRange(promo.start_date, promo.end_date) && (
                            <span className="text-xs text-muted-foreground">
                              {formatDateRange(promo.start_date, promo.end_date)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {promo.category && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 uppercase">
                              {promo.category}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            и еще объекты
                          </span>
                        </div>
                        <h3 className="text-lg font-serif font-medium mb-2">
                          {promo.title}
                        </h3>
                        {promo.short_description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {promo.short_description}
                          </p>
                        )}
                      </div>

                      {/* Action */}
                      <div className="flex items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/akcii/${promo.slug}`}>Подробнее</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/50 rounded-lg">
                  <span className="text-5xl mb-4 block">📋</span>
                  <p className="text-muted-foreground text-lg">
                    Акций не найдено
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center border rounded text-sm ${
                          currentPage === page 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 flex items-center justify-center border rounded text-sm ${
                          currentPage === totalPages 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <ConsultationBlock
        title="Консультация"
        subtitle="по акциям"
        topic="получить консультацию по акциям"
        variant="primary"
        formSource="akcii_page"
      />
    </Layout>
  );
};

export default Akcii;
