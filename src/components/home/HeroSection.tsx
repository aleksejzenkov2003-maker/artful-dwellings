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
    <section className="relative min-h-screen flex flex-col -mt-[108px] pt-[108px]">
      {/* Background Image - SPb classical architecture */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556610961-2fecc5927173?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-4">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
            Мы продаем квартиры<br />и апартаменты
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-light tracking-wide mb-10 italic font-serif">
            комфорт и бизнес-класса
          </p>
          <Button 
            size="lg" 
            className="bg-navy/80 backdrop-blur-sm border border-primary text-white hover:bg-navy uppercase tracking-wider text-xs px-8 py-6"
          >
            Заказать бесплатную консультацию
          </Button>
        </div>
      </div>

      {/* Category Cards - full width with turquoise corner accents */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Turquoise corner accent - top left */}
              <div className="absolute top-0 left-0 w-8 h-8">
                <div className="absolute top-3 left-3 w-4 h-[2px] bg-primary" />
                <div className="absolute top-3 left-3 w-[2px] h-4 bg-primary" />
              </div>
              
              {/* Turquoise corner accent - bottom right */}
              <div className="absolute bottom-0 right-0 w-8 h-8">
                <div className="absolute bottom-3 right-3 w-4 h-[2px] bg-primary" />
                <div className="absolute bottom-3 right-3 w-[2px] h-4 bg-primary" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">{category.title}</p>
                <p className="text-white text-xl font-serif">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
