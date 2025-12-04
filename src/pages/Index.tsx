import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Quiz } from "@/components/home/Quiz";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ComplexCatalog } from "@/components/home/ComplexCatalog";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { TeamSection } from "@/components/home/TeamSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-navy">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075')] bg-cover bg-center opacity-20" />
        
        {/* Geometric pattern overlay */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-10 hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M100 10L180 55V145L100 190L20 145V55L100 10Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
            <path
              d="M100 30L160 65V135L100 170L40 135V65L100 30Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
            <path
              d="M100 50L140 75V125L100 150L60 125V75L100 50Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span>Главная</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white max-w-3xl leading-tight mb-8">
            Art Estate — команда, созданная профессионалами рынка недвижимости.
          </h1>
          
          <p className="text-white/70 max-w-xl text-lg mb-8">
            Уникальные партнёрские взаимоотношения компании с ведущими застройщиками северной столицы позволяют предлагать клиентам выгодные условия сотрудничества.
          </p>

          <Button className="bg-primary hover:bg-primary/90 text-white">
            Получить консультацию
          </Button>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <CategoryCards />
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="flex flex-col justify-center">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Подберём идеальное предложение
              </p>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                Ответьте на 5 вопросов и получите персональную подборку
              </h2>
              <p className="text-muted-foreground">
                Наши эксперты проанализируют ваши предпочтения и подберут лучшие варианты 
                недвижимости, соответствующие вашим требованиям и бюджету.
              </p>
            </div>
            <Quiz />
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Каталог
              </p>
              <h2 className="text-3xl md:text-4xl font-serif">
                Строящаяся недвижимость
              </h2>
            </div>
            <Link 
              to="/novostroyki" 
              className="text-primary hover:underline text-sm font-medium"
            >
              Смотреть все объекты →
            </Link>
          </div>
          <ComplexCatalog />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Преимущества
            </p>
            <h2 className="text-3xl md:text-4xl font-serif">
              Недвижимость как искусство
            </h2>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Art Estate — официальный партнер ведущих застройщиков и банков, что подтверждается 
            сертификатами о партнерстве, представленными на сайте и в офисе компании.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
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
                icon: "📈", 
                title: "Постоянный рост", 
                desc: "Развиваем отношения с клиентами и партнерами для совместного долгосрочного развития" 
              },
            ].map((stat, index) => (
              <div key={index} className="bg-background text-center p-8 lg:p-12">
                <div className="mb-4">
                  {stat.year ? (
                    <span className="text-5xl font-serif text-primary">{stat.year}</span>
                  ) : (
                    <span className="text-4xl">{stat.icon}</span>
                  )}
                </div>
                <h3 className="text-lg font-medium mb-3">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <TestimonialsSlider />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-background">
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
          <p className="text-sm text-white/50 uppercase tracking-wider mb-4">
            Свободная консультация
          </p>
          
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-serif mb-8">
              Здравствуйте, меня зовут{" "}
              <span className="border-b border-primary text-primary">ваше имя</span>,<br />
              хочу получить консультацию по теме<br />
              в премиальной недвижимости, свяжитесь со мной<br />
              по номеру телефона —{" "}
              <span className="border-b border-primary text-primary">+7-987-654-32-10</span>
            </h2>
            
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="checkbox" 
                id="consent" 
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="consent" className="text-xs text-white/60">
                Я согласен на обработку персональных данных
              </label>
            </div>
            
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Отправить заявку
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
