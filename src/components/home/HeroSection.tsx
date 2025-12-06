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
      {/* Background Image - SPb classical architecture with light fog */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556610961-2fecc5927173?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-4 pt-20">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
            Мы продаем квартиры<br />и апартаменты
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light tracking-wide mb-8 italic">
            комфорт и бизнес-класса
          </p>
          <Button 
            variant="outline"
            size="lg" 
            className="border-white/40 bg-black/30 text-white hover:bg-white/10 backdrop-blur-sm uppercase tracking-wider text-sm px-8 py-6"
          >
            Заказать бесплатную консультацию
          </Button>
        </div>
      </div>

      {/* Category Cards - full width, no gaps, skewed borders between cards */}
      <div className="relative z-10 w-full">
        <div className="flex flex-col md:flex-row">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative flex-1 h-48 md:h-56 overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Skewed border overlay - right side */}
              {index < categories.length - 1 && (
                <div 
                  className="hidden md:block absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black/60 to-transparent"
                  style={{
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                  }}
                />
              )}
              
              {/* Skewed border overlay - left side */}
              {index > 0 && (
                <div 
                  className="hidden md:block absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-black/60 to-transparent"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 0 100%)",
                  }}
                />
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/70 text-sm mb-1 uppercase tracking-wider">{category.title}</p>
                <p className="text-white text-xl font-serif">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
