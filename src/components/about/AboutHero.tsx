import { Link } from "react-router-dom";
import heroTeam from "@/assets/hero-team.jpg";
import { Play } from "lucide-react";

const stats = [
  { value: "15+", label: "лет на рынке" },
  { value: "850+", label: "объектов в базе" },
  { value: "50", label: "специалистов" },
  { value: "4200+", label: "успешных сделок" },
  { value: "3500", label: "довольных клиентов" },
];

export function AboutHero() {
  return (
    <section className="py-8 lg:py-16">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-10 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <span>/</span>
          <span>О компании</span>
        </div>

        {/* Main content: title + photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Title and text */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-serif leading-[1.1] mb-8">
              ART ESTATE —<br />
              ваш надежный партнёр<br />
              в сфере недвижимости
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg">
              Наша цель — помочь вам приобрести недвижимость мечты от застройщиков в Москве, 
              Санкт-Петербурге и ОАЭ на самых выгодных условиях. Мы гарантируем для своих 
              клиентов качественный сервис, безопасное сопровождение и максимальный комфорт 
              на каждом этапе сделки.
            </p>
          </div>

          {/* Right - Team photo with play button */}
          <div className="relative">
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
              <img
                src={heroTeam}
                alt="Команда Art Estate"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Play button overlay */}
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 lg:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="text-4xl lg:text-5xl xl:text-6xl font-serif text-primary block mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          {/* Coral separator */}
          <div className="w-full h-px bg-accent mt-12" />
        </div>
      </div>
    </section>
  );
}
