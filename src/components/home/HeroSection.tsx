import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Квартиры",
    subtitle: "от застройщиков",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    link: "/novostroyki",
  },
  {
    title: "Квартиры",
    subtitle: "по переуступке",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    link: "/novostroyki",
  },
  {
    title: "Квартиры",
    subtitle: "на вторичном рынке",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=400&fit=crop",
    link: "/novostroyki",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-4 pt-20">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
            Мы продаем квартиры<br />и апартаменты
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light tracking-wide mb-8">
            комфорт и бизнес-класса
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-wider text-sm px-8 py-6"
          >
            Заказать бесплатную консультацию
          </Button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="relative z-10 container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative h-48 md:h-56 overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/80 text-sm mb-1">{category.title}</p>
                <p className="text-white text-xl font-serif">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
