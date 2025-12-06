import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Quiz } from "@/components/home/Quiz";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ComplexCatalog } from "@/components/home/ComplexCatalog";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { TeamSection } from "@/components/home/TeamSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { HexagonPattern } from "@/components/ui/HexagonPattern";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ConsultationForm } from "@/components/home/ConsultationForm";
import { useCity } from "@/contexts/CityContext";

// Helper function to get genitive case for city names
function getCityGenitive(cityName: string): string {
  const genitiveMap: Record<string, string> = {
    "Санкт-Петербург": "северной столицы",
    "Москва": "столицы",
    "Дубай": "Дубая",
  };
  return genitiveMap[cityName] || cityName;
}

const Index = () => {
  const { currentCity } = useCity();
  const cityGenitive = getCityGenitive(currentCity?.name || "Санкт-Петербург");

  return (
    <Layout>
      {/* Hero Section - Light background */}
      <section className="relative min-h-[80vh] flex flex-col bg-background overflow-hidden">
        {/* Hexagon patterns */}
        <HexagonPattern className="right-0 top-0 w-80 h-full" />
        
        <div className="container mx-auto px-4 flex-1 flex flex-col justify-center relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <button className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="uppercase tracking-wider text-xs">Главная</span>
          </div>

          {/* Section label */}
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-6">
            О компании
          </p>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground max-w-4xl leading-[1.1] mb-8">
            Art Estate — команда, созданная профессионалами рынка недвижимости.
          </h1>

          {/* Decorative line */}
          <div className="w-12 h-0.5 bg-primary mb-8" />
        </div>

        {/* Team photo strip */}
        <div className="container mx-auto px-4 pb-8">
          <div className="flex justify-end">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-24 h-24 md:w-32 md:h-32 bg-secondary grayscale overflow-hidden"
                  style={{ marginLeft: i > 1 ? '-1px' : 0 }}
                >
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      i === 1 ? '1560250097-0b93528c311a' :
                      i === 2 ? '1573496359142-b8d87734a5a2' :
                      i === 3 ? '1472099645785-5658abf4ff4e' :
                      i === 4 ? '1519085360753-af0119f7cbe7' :
                      '1438761681033-6461ffad8d80'
                    }?w=200&h=200&fit=crop`}
                    alt="Team member"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description section */}
      <section className="py-12 lg:py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Уникальные партнёрские взаимоотношения компании с ведущими застройщиками 
            {cityGenitive} позволяют предлагать клиентам выгодные условия сотрудничества 
            и возможность приобрести квартиру в новостройке по ценам ниже, чем у застройщика.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <ServicesSection />
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Art Estate — официальный партнер ведущих застройщиков и банков, что подтверждается 
            сертификатами о партнерстве, представленными на сайте и в офисе компании.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection variant="secondary" />

      {/* Company Values Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                year: "2009", 
                title: "Большой опыт работы", 
                desc: "С нами работают покупатели и партнеры с 2009 года, мы выстроили отношения на доверии и честности" 
              },
              { 
                icon: "◇", 
                title: "Амбициозность компании", 
                desc: "Занимаемся недвижимостью — владеем информацией: каждый день получаем информацию о новых предложениях" 
              },
              { 
                icon: "↗", 
                title: "Постоянный рост", 
                desc: "Развиваем отношения с клиентами и партнерами для совместного долгосрочного развития" 
              },
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 border border-border">
                <div className="mb-4">
                  {stat.year ? (
                    <span className="text-4xl md:text-5xl font-serif text-primary">{stat.year}</span>
                  ) : (
                    <span className="text-3xl md:text-4xl">{stat.icon}</span>
                  )}
                </div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Заинтересовались? Свяжитесь с нами.</p>
          <Link to="/kontakty">
            <Button variant="outline" className="border-foreground/20 uppercase text-xs tracking-wider">
              Связаться
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <TestimonialsSlider />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <TeamSection />
        </div>
      </section>

      {/* CTA Form Section */}
      <section className="py-16 lg:py-20 bg-navy text-white relative overflow-hidden">
        {/* Geometric pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 hidden lg:block">
          <svg viewBox="0 0 200 400" className="w-full h-full">
            <path
              d="M100 50L180 95V185L100 230L20 185V95L100 50Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
            <path
              d="M100 170L180 215V305L100 350L20 305V215L100 170Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ConsultationForm />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
