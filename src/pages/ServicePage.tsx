import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useServiceBySlug } from "@/hooks/useServiceBySlug";
import { ServiceContactForm } from "@/components/services/ServiceContactForm";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

const ServicePage = () => {
  const { slug } = useParams();
  const { data: service, isLoading, error } = useServiceBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">
              Услуга не найдена
            </h1>
            <p className="text-muted-foreground mb-6">
              Запрашиваемая услуга не существует или была удалена
            </p>
            <Link
              to="/uslugi"
              className="inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к списку услуг
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const features = (service.features as string[]) || [];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Главная
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/uslugi" className="text-muted-foreground hover:text-foreground">
              Услуги
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {service.title}
            </h1>
            {service.short_description && (
              <p className="text-xl text-muted-foreground">
                {service.short_description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Main Image */}
              {service.main_image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={service.main_image}
                    alt={service.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {service.description && (
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-serif font-semibold mb-4">
                    Описание услуги
                  </h2>
                  <div 
                    className="text-muted-foreground leading-relaxed whitespace-pre-line"
                  >
                    {service.description}
                  </div>
                </div>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-6">
                    Что входит в услугу
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              <div className="bg-primary/5 rounded-lg p-8">
                <h2 className="text-2xl font-serif font-semibold mb-6">
                  Почему выбирают нас
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Опыт с 2013 года</h4>
                      <p className="text-sm text-muted-foreground">
                        Более 10 лет успешной работы на рынке недвижимости
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Бесплатная консультация</h4>
                      <p className="text-sm text-muted-foreground">
                        Первичная консультация без каких-либо обязательств
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Индивидуальный подход</h4>
                      <p className="text-sm text-muted-foreground">
                        Персональный менеджер для каждого клиента
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Гарантия результата</h4>
                      <p className="text-sm text-muted-foreground">
                        Сопровождаем до полного завершения сделки
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-1">
              <ServiceContactForm
                serviceTitle={service.title}
                serviceSlug={service.slug}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicePage;
