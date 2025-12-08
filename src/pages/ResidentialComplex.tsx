import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { ComplexContactForm } from "@/components/complex/ComplexContactForm";
import { ComplexPdfGenerator } from "@/components/complex/ComplexPdfGenerator";
import { ComplexImageGallery } from "@/components/complex/ComplexImageGallery";
import { 
  MapPin, 
  Building2, 
  Calendar, 
  Ruler, 
  Home, 
  Layers, 
  CheckCircle2,
  ArrowLeft,
  Share2,
  Hexagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSubmitLead } from "@/hooks/useSubmitLead";

const roomTypes = [
  { label: "СТ", value: "studio" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5+" },
];

const ResidentialComplex = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: complex, isLoading, error } = useResidentialComplex(slug || "");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const { mutate: submitLead, isPending } = useSubmitLead();

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("ru-RU").format(price);
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

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Введите номер телефона");
      return;
    }
    submitLead({
      name: "Консультация по ЖК",
      phone,
      form_type: "complex_consultation",
      form_source: `ЖК ${complex?.name}`,
    });
    setPhone("");
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[600px] flex items-center justify-center">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-48" />
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

  const features = Array.isArray(complex.features) ? (complex.features as string[]) : [];
  const infrastructure = Array.isArray(complex.infrastructure) ? (complex.infrastructure as string[]) : [];

  return (
    <Layout>
      {/* SEO */}
      {complex.seo_title && <title>{complex.seo_title}</title>}
      
      {/* Hero Section with Dark Sidebar */}
      <section className="relative min-h-[600px] lg:min-h-[700px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${complex.main_image || '/placeholder.svg'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a3a]/95 via-[#1a2a3a]/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-[600px] lg:min-h-[700px]">
          {/* Left Dark Sidebar */}
          <div className="w-full max-w-[400px] lg:max-w-[450px] bg-[#1a2a3a]/95 p-8 lg:p-10 flex flex-col">
            {/* Tab */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-4 py-2">
                <span className="text-white/60 text-sm uppercase tracking-wider">О комплексе</span>
              </div>
            </div>

            {/* Complex Name */}
            <div className="mb-8">
              <p className="text-white/50 text-sm uppercase tracking-wider mb-2">Жилой комплекс</p>
              <h1 className="text-4xl lg:text-5xl font-serif text-white font-bold">
                {complex.name}
              </h1>
            </div>

            {/* Hexagon Icon */}
            <div className="mb-8 flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <Hexagon className="w-10 h-10 text-primary" strokeWidth={1} />
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                НАВЕДИТЕ УКАЗАТЕЛЬ<br />
                НА ИНТЕРЕСУЮЩИЙ КОРПУС
              </p>
            </div>

            {/* Building Info */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-baseline gap-4">
                {complex.apartments_count && (
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary text-2xl font-bold">S</span>
                    <span className="text-white/80">_{complex.apartments_count}</span>
                  </div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-primary text-2xl font-bold">К</span>
                  <span className="text-white/80">_2</span>
                </div>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Корпусов</p>
            </div>

            {/* Apartments in Sale */}
            <div className="mb-6">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Квартир в продаже</p>
              
              {/* Room Type Selector */}
              <div className="flex gap-1 mb-6">
                {roomTypes.map((room) => (
                  <button
                    key={room.value}
                    onClick={() => setSelectedRoom(room.value === selectedRoom ? null : room.value)}
                    className={`
                      w-10 h-10 flex items-center justify-center text-sm font-medium transition-all
                      ${selectedRoom === room.value 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                      }
                    `}
                    style={{
                      clipPath: room.value === "studio" 
                        ? "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" 
                        : room.value === "5+" 
                          ? "polygon(0 0, 80% 0, 100% 100%, 0 100%)"
                          : "none"
                    }}
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area & Floors */}
            <div className="flex gap-8 mb-8">
              <div>
                <p className="text-white text-2xl font-bold">
                  {complex.area_from && complex.area_to 
                    ? `${complex.area_from}-${complex.area_to}`
                    : complex.area_from || "—"
                  }
                  <span className="text-sm ml-1">м²</span>
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider">Площадь квартир</p>
              </div>
              {complex.floors_count && (
                <div>
                  <p className="text-white text-2xl font-bold">{complex.floors_count}</p>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Этажей</p>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Цена от</p>
              <p className="text-primary text-3xl font-bold">
                {formatPrice(complex.price_from) ? `${formatPrice(complex.price_from)} ₽` : "По запросу"}
              </p>
            </div>
          </div>

          {/* Right Side - Image Area with Button */}
          <div className="flex-1 relative hidden lg:flex flex-col">
            {/* Top Right Button */}
            <div className="absolute top-8 right-8 z-20 flex gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <ComplexPdfGenerator complex={complex} />
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/novostroyki">
                  К списку квартир
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <h2 className="text-2xl lg:text-3xl font-serif">
              Нужна консультация? <span className="text-primary">Мы вам перезвоним!</span>
            </h2>
            <form onSubmit={handleConsultationSubmit} className="flex gap-4 w-full lg:w-auto">
              <Input
                type="tel"
                placeholder="Ваш телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full lg:w-64"
              />
              <Button type="submit" disabled={isPending} className="whitespace-nowrap">
                {isPending ? "Отправка..." : "Оставить заявку"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Gallery */}
              {(complex.images || complex.main_image) && (
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-6">Галерея</h2>
                  <ComplexImageGallery
                    images={Array.isArray(complex.images) ? (complex.images as string[]) : []}
                    mainImage={complex.main_image}
                    complexName={complex.name}
                  />
                </div>
              )}

              {/* Description */}
              {complex.description && (
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-6">О комплексе</h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>{complex.description}</p>
                  </div>
                </div>
              )}

              {/* Characteristics */}
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-6">Характеристики</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {complex.developer && (
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <Building2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Застройщик</p>
                        <p className="font-medium">{complex.developer}</p>
                      </div>
                    </div>
                  )}
                  {complex.floors_count && (
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <Layers className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Этажность</p>
                        <p className="font-medium">{complex.floors_count} этажей</p>
                      </div>
                    </div>
                  )}
                  {complex.apartments_count && (
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <Home className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Квартир</p>
                        <p className="font-medium">{complex.apartments_count}</p>
                      </div>
                    </div>
                  )}
                  {complex.district && (
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Район</p>
                        <p className="font-medium">{complex.district}</p>
                      </div>
                    </div>
                  )}
                  {complex.completion_date && (
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
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
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
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
                  <h2 className="text-2xl font-serif font-semibold mb-6">Особенности</h2>
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
                  <h2 className="text-2xl font-serif font-semibold mb-6">Инфраструктура</h2>
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
