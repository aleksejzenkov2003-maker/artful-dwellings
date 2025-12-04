import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-dark">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075')] bg-cover bg-center opacity-30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 animate-fade-in">
            Недвижимость как <span className="text-primary">искусство</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in">
            Премиальные новостройки Москвы и эксклюзивные предложения от ведущих застройщиков
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Получить консультацию
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Смотреть каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Выберите тип недвижимости
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Новостройки", href: "/novostroyki", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400" },
              { title: "Вторичная", href: "/vtorichnaya", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" },
              { title: "Переуступки", href: "/pereustupki", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400" },
              { title: "Эксклюзив", href: "/exclusive", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400" },
            ].map((category) => (
              <Link
                key={category.title}
                to={category.href}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-serif font-semibold text-white group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Готовы найти идеальный дом?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Оставьте заявку и наши эксперты подберут лучшие варианты под ваши требования
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Получить подборку
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
