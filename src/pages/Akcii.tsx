import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { usePromotions } from "@/hooks/usePromotions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays, ArrowRight } from "lucide-react";

const Akcii = () => {
  const { data: promotions, isLoading } = usePromotions();

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return null;
    
    const start = startDate ? format(new Date(startDate), "d MMM", { locale: ru }) : "";
    const end = endDate ? format(new Date(endDate), "d MMM yyyy", { locale: ru }) : "";
    
    if (start && end) return `${start} — ${end}`;
    if (end) return `до ${end}`;
    return null;
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Акции и спецпредложения
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Выгодные условия покупки недвижимости от застройщиков и партнёров
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[16/10]" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : promotions && promotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <Link
                  key={promo.id}
                  to={`/akcii/${promo.slug}`}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                >
                  <div className="aspect-[16/10] bg-secondary overflow-hidden relative">
                    {promo.cover_image ? (
                      <img 
                        src={promo.cover_image} 
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-4xl">🎁</span>
                      </div>
                    )}
                    {promo.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {promo.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {formatDateRange(promo.start_date, promo.end_date) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateRange(promo.start_date, promo.end_date)}
                      </div>
                    )}
                    <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                      {promo.title}
                    </h3>
                    {promo.short_description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {promo.short_description}
                      </p>
                    )}
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Подробнее
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-secondary/50 rounded-lg">
              <span className="text-5xl mb-4 block">📋</span>
              <p className="text-muted-foreground text-lg">
                Актуальных акций пока нет
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Следите за обновлениями — скоро появятся новые предложения
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Akcii;
