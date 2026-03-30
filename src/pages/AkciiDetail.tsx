import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePromotion, usePromotions } from "@/hooks/usePromotions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ConsultationBlock } from "@/components/shared/ConsultationBlock";

const AkciiDetail = () => {
  const { slug } = useParams();
  const { data: promo, isLoading, error } = usePromotion(slug || "");
  const { data: allPromotions } = usePromotions();
  const [visibleComplexes, setVisibleComplexes] = useState(3);
  const [showMap, setShowMap] = useState(false);

  // Get other promotions for sidebar (excluding current)
  const otherPromotions = allPromotions?.filter(p => p.slug !== slug)?.slice(0, 3) || [];

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return null;
    
    const start = startDate ? format(new Date(startDate), "dd.MM.yy", { locale: ru }) : "";
    const end = endDate ? format(new Date(endDate), "dd.MM.yy", { locale: ru }) : "";
    
    if (start && end) return `${start} — ${end}`;
    if (end) return `до ${end}`;
    if (start) return `с ${start}`;
    return null;
  };

  // Mock complexes data with coordinates (in real app would come from promo.complexes)
  const complexes = [
    { id: 1, name: "Полянка 44", address: "г. Санкт-Петербург, Фрунзенский район, Литовский проспект, 2/1", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop", lat: 59.8684, lng: 30.3879 },
    { id: 2, name: "Mistola Hills", address: "г. Санкт-Петербург, Фрунзенский район, Литовский проспект, 2/1", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop", lat: 59.8750, lng: 30.3920 },
    { id: 3, name: "Адамант", address: "г. Санкт-Петербург, Фрунзенский район, Литовский проспект, 2/1", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop", lat: 59.8620, lng: 30.3800 },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <article className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <div className="flex gap-8">
              <Skeleton className="w-64 h-96 flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (error || !promo) {
    return (
      <Layout>
        <article className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Акция не найдена</h1>
            <p className="text-muted-foreground mb-8">
              Возможно, она завершилась или была удалена
            </p>
            <Link to="/akcii">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                К списку акций
              </Button>
            </Link>
          </div>
        </article>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Link to="/akcii" className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            К списку акций
          </Link>
        </div>
      </div>

      {/* Title */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif">
            {promo.title}
          </h1>
        </div>
      </section>

      <article className="pb-16 lg:pb-24">
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

              {/* Other promotions */}
              <div>
                <h3 className="text-sm font-medium mb-4 uppercase">Текущие акции</h3>
                <div className="space-y-4">
                  {otherPromotions.map((otherPromo) => (
                    <Link 
                      key={otherPromo.id}
                      to={`/akcii/${otherPromo.slug}`}
                      className="block group"
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {formatDateRange(otherPromo.start_date, otherPromo.end_date)}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        {otherPromo.category && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 uppercase">
                            {otherPromo.category}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {otherPromo.title}
                      </h4>
                      {otherPromo.short_description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                          {otherPromo.short_description}
                        </p>
                      )}
                      <Button variant="outline" size="sm" className="mt-2">
                        Подробнее
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Hero card */}
              <div className="flex flex-col md:flex-row bg-muted rounded-lg overflow-hidden mb-8">
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 uppercase">
                      Акция
                    </span>
                    <span className="text-xs text-muted-foreground">
                      и еще объекты
                    </span>
                  </div>
                  {formatDateRange(promo.start_date, promo.end_date) && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {formatDateRange(promo.start_date, promo.end_date)}
                    </p>
                  )}
                  <h2 className="text-xl md:text-2xl font-serif mb-4">
                    {promo.title}
                  </h2>
                </div>
                {promo.cover_image && (
                  <div className="flex-1 min-h-[200px] md:min-h-[240px]">
                    <img 
                      src={promo.cover_image} 
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              {promo.short_description && (
                <div className="mb-8">
                  <p className="text-lg md:text-xl font-serif italic text-foreground/90 leading-relaxed">
                    {promo.short_description}
                  </p>
                </div>
              )}

              {promo.description && (
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-muted-foreground prose-a:text-primary mb-8"
                  dangerouslySetInnerHTML={{ __html: promo.description }}
                />
              )}

              {/* Promotion period */}
              {formatDateRange(promo.start_date, promo.end_date) && (
                <div className="mb-12">
                  <p className="text-sm text-muted-foreground">
                    Срок действия акции: {formatDateRange(promo.start_date, promo.end_date)}
                  </p>
                </div>
              )}

              {/* Complexes section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-serif">
                    Акция действует в {complexes.length} объектах
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? (
                      <>
                        <List className="h-4 w-4 mr-2" />
                        Списком
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        На карте
                      </>
                    )}
                  </Button>
                </div>

                {showMap ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <div className="aspect-[16/9] bg-muted relative">
                      {/* Map placeholder with markers */}
                      <iframe 
                        src={`https://yandex.ru/map-widget/v1/?ll=${complexes[0].lng}%2C${complexes[0].lat}&z=13&pt=${complexes.map(c => `${c.lng},${c.lat},pm2rdm`).join('~')}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        className="absolute inset-0"
                        allowFullScreen
                      />
                    </div>
                    {/* Complex cards overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-3 overflow-x-auto pb-2">
                      {complexes.map((complex) => (
                        <Link 
                          key={complex.id}
                          to={`/novostroyki/${complex.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex-shrink-0 bg-background rounded-lg shadow-lg overflow-hidden w-64 hover:shadow-xl transition-shadow"
                        >
                          <div className="h-24">
                            <img 
                              src={complex.image} 
                              alt={complex.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-serif font-medium text-sm mb-1">{complex.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{complex.address}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {complexes.slice(0, visibleComplexes).map((complex) => (
                        <div 
                          key={complex.id}
                          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-border rounded-lg overflow-hidden"
                        >
                          <div className="w-full sm:w-48 h-32 flex-shrink-0">
                            <img 
                              src={complex.image} 
                              alt={complex.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 sm:p-0">
                            <h3 className="text-lg font-serif font-medium mb-1">{complex.name}</h3>
                            <p className="text-sm text-muted-foreground">{complex.address}</p>
                          </div>
                          <div className="p-4 sm:pr-4">
                            <Button asChild>
                              <Link to={`/novostroyki/${complex.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                В деталях
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {complexes.length > visibleComplexes && (
                      <div className="text-center mt-6">
                        <Button 
                          variant="outline"
                          onClick={() => setVisibleComplexes(prev => prev + 3)}
                        >
                          Показать ещё
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Показано {visibleComplexes} из {complexes.length}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Consultation Section */}
      <ConsultationBlock
        title="Консультация"
        subtitle="по акциям"
        topic="получить консультацию по акциям"
        variant="primary"
        formSource="akcii_detail_page"
      />
    </Layout>
  );
};

export default AkciiDetail;
