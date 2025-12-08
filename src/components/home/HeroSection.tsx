import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Квартиры",
    subtitle: "от застройщиков",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
    link: "/novostroyki",
  },
  {
    title: "Квартиры",
    subtitle: "по переуступке",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop",
    link: "/novostroyki",
  },
  {
    title: "Квартиры",
    subtitle: "на вторичном рынке",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&h=500&fit=crop",
    link: "/novostroyki",
  },
];

export function HeroSection() {
  return (
    <section className="relative -mt-[108px]">
      {/* Main Hero Area */}
      <div className="relative min-h-[85vh] flex flex-col justify-center">
        {/* Background Image - SPb classical architecture */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1548834925-e48f8a27ae6f?w=1920&h=1200&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy-dark))]/60 via-[hsl(var(--navy-dark))]/40 to-[hsl(var(--navy-dark))]/70" />
        </div>

        {/* Content - centered */}
        <div className="relative z-10 pt-[108px] pb-20">
          <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Мы продаем квартиры<br />и апартаменты
              </h1>
              <p className="text-white/60 text-lg md:text-xl lg:text-2xl font-light tracking-wide mb-10 italic font-serif">
                комфорт и бизнес-класса
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-[0.15em] text-xs font-medium px-8 py-6 h-auto"
              >
                Заказать бесплатную консультацию
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards - Full width, edge-to-edge */}
      <div className="relative z-10 flex flex-col md:flex-row">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="group relative flex-1 h-[200px] md:h-[240px] lg:h-[280px] overflow-hidden"
          >
            {/* Card Image */}
            <img
              src={category.image}
              alt={`${category.title} ${category.subtitle}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-dark))]/90 via-[hsl(var(--navy-dark))]/50 to-[hsl(var(--navy-dark))]/20" />
            
            {/* Diagonal separator - left side (not for first card) */}
            {index > 0 && (
              <div 
                className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[hsl(var(--navy-dark))]/60 to-transparent hidden md:block"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }}
              />
            )}
            
            {/* Turquoise corner accent - top left */}
            <div className="absolute top-5 left-5 z-10">
              <div className="w-8 h-8 relative">
                <div className="absolute top-0 left-0 w-6 h-[2px] bg-primary" />
                <div className="absolute top-0 left-0 w-[2px] h-6 bg-primary" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <p className="text-white text-xl md:text-2xl lg:text-3xl font-serif leading-snug">
                <span className="block">{category.title}</span>
                <span className="block">{category.subtitle}</span>
              </p>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
          </Link>
        ))}
      </div>
    </section>
  );
}