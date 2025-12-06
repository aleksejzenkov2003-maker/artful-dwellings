import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePromotion } from "@/hooks/usePromotions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const AkciiDetail = () => {
  const { slug } = useParams();
  const { data: promo, isLoading, error } = usePromotion(slug || "");

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return null;
    
    const start = startDate ? format(new Date(startDate), "d MMMM yyyy", { locale: ru }) : "";
    const end = endDate ? format(new Date(endDate), "d MMMM yyyy", { locale: ru }) : "";
    
    if (start && end) return `${start} — ${end}`;
    if (end) return `Действует до ${end}`;
    if (start) return `Начало: ${start}`;
    return null;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <article className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="space-y-3 pt-8">
                <Skeleton className="h-4 w-full" />
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
                Все акции
              </Button>
            </Link>
          </div>
        </article>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Link
            to="/akcii"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Все акции
          </Link>
          
          <div className="max-w-3xl mx-auto">
            {promo.category && (
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                {promo.category}
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
              {promo.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-8">
              {formatDateRange(promo.start_date, promo.end_date) && (
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDateRange(promo.start_date, promo.end_date)}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </Button>
            </div>
            
            {promo.cover_image && (
              <div className="aspect-video bg-secondary rounded-lg mb-8 overflow-hidden">
                <img 
                  src={promo.cover_image} 
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {promo.description ? (
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: promo.description }}
              />
            ) : promo.short_description ? (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {promo.short_description}
              </p>
            ) : null}

            {/* CTA */}
            <div className="mt-12 p-8 bg-secondary rounded-lg text-center">
              <h3 className="text-xl font-serif font-bold mb-2">
                Хотите воспользоваться акцией?
              </h3>
              <p className="text-muted-foreground mb-6">
                Оставьте заявку, и наш менеджер свяжется с вами
              </p>
              <Link to="/kontakty">
                <Button size="lg">
                  Оставить заявку
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default AkciiDetail;
