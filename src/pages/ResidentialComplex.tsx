import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { ComplexGallery } from "@/components/complex/ComplexGallery";
import { ComplexContactForm } from "@/components/complex/ComplexContactForm";
import { ComplexPdfGenerator } from "@/components/complex/ComplexPdfGenerator";
import { 
  MapPin, 
  Building2, 
  Calendar, 
  Ruler, 
  Home, 
  Layers, 
  CheckCircle2,
  ArrowLeft,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ResidentialComplex = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: complex, isLoading, error } = useResidentialComplex(slug || "");

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "building":
        return <Badge variant="secondary">Строится</Badge>;
      case "ready":
        return <Badge className="bg-primary">Сдан</Badge>;
      case "soon":
        return <Badge variant="outline">Скоро старт</Badge>;
      default:
        return null;
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `ЖК «${complex?.name}»`,
        text: complex?.description || "",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована в буфер обмена");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="aspect-[16/9] w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="h-[400px] rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !complex) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">ЖК не найден</h1>
            <p className="text-muted-foreground mb-8">
              К сожалению, запрашиваемый жилой комплекс не существует или был удалён
            </p>
            <Button asChild>
              <Link to="/novostroyki">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к каталогу
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const images = Array.isArray(complex.images) ? (complex.images as string[]) : [];
  const features = Array.isArray(complex.features) ? (complex.features as string[]) : [];
  const infrastructure = Array.isArray(complex.infrastructure) ? (complex.infrastructure as string[]) : [];

  return (
    <Layout>
      {/* SEO */}
      {complex.seo_title && <title>{complex.seo_title}</title>}
      
      {/* Breadcrumb */}
      <section className="py-4 border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
            <span>/</span>
            <Link to="/novostroyki" className="hover:text-primary transition-colors">Новостройки</Link>
            <span>/</span>
            <span className="text-foreground">{complex.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold">
                  ЖК «{complex.name}»
                </h1>
                {getStatusBadge(complex.status)}
              </div>
              {(complex.address || complex.district) && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {complex.address || complex.district}, {complex.city || "Санкт-Петербург"}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <ComplexPdfGenerator complex={complex} />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <ComplexGallery 
                images={images} 
                mainImage={complex.main_image} 
                complexName={complex.name} 
              />

              {/* Price Block */}
              <div className="bg-secondary rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Цена от</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(complex.price_from) ? `${formatPrice(complex.price_from)} ₽` : "—"}
                    </p>
                  </div>
                  {complex.price_to && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Цена до</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(complex.price_to)} ₽
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Площадь</p>
                    <p className="text-2xl font-bold">
                      {complex.area_from && complex.area_to 
                        ? `${complex.area_from}–${complex.area_to} м²`
                        : complex.area_from 
                          ? `от ${complex.area_from} м²`
                          : "—"
                      }
                    </p>
                  </div>
                  {complex.completion_date && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Срок сдачи</p>
                      <p className="text-2xl font-bold">
                        {new Date(complex.completion_date).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {complex.description && (
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-4">О комплексе</h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>{complex.description}</p>
                  </div>
                </div>
              )}

              {/* Characteristics */}
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-4">Характеристики</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {complex.developer && (
                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                      <Building2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Застройщик</p>
                        <p className="font-medium">{complex.developer}</p>
                      </div>
                    </div>
                  )}
                  {complex.floors_count && (
                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                      <Layers className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Этажность</p>
                        <p className="font-medium">{complex.floors_count} этажей</p>
                      </div>
                    </div>
                  )}
                  {complex.apartments_count && (
                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                      <Home className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Квартир</p>
                        <p className="font-medium">{complex.apartments_count}</p>
                      </div>
                    </div>
                  )}
                  {complex.district && (
                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Район</p>
                        <p className="font-medium">{complex.district}</p>
                      </div>
                    </div>
                  )}
                  {complex.completion_date && (
                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Сдача</p>
                        <p className="font-medium">
                          {new Date(complex.completion_date).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {(complex.area_from || complex.area_to) && (
                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                      <Ruler className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Площади</p>
                        <p className="font-medium">
                          {complex.area_from}–{complex.area_to} м²
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-4">Особенности</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Infrastructure */}
              {infrastructure.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-4">Инфраструктура</h2>
                  <div className="flex flex-wrap gap-2">
                    {infrastructure.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <ComplexContactForm 
                  complexName={complex.name} 
                  complexSlug={complex.slug} 
                />
                
                {/* Back to Catalog */}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/novostroyki">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Все новостройки
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResidentialComplex;
