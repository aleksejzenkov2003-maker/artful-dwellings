import { Play } from "lucide-react";
import heroTeam from "@/assets/hero-team.jpg";
import maskPattern from "@/assets/mask-pattern.svg";

const stats = [
  { value: "15+", label: "лет на рынке" },
  { value: "850+", label: "объектов в базе" },
  { value: "50", label: "специалистов" },
  { value: "4200+", label: "успешных сделок" },
  { value: "3500", label: "довольных клиентов" },
];

export function AboutHero() {
  return (
    <section className="pt-8 pb-0 lg:pt-12 xl:pt-16 lg:pb-0">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Main content: title + photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left - Title and text */}
          <div className="pt-4">
            <h1 className="font-serif text-[2.5rem] md:text-[3rem] lg:text-[2.75rem] xl:text-[3.75rem] leading-[1.1] tracking-[-0.01em] mb-8">
              ART ESTATE —<br />
              ваш надежный партнёр<br />
              в сфере недвижимости
            </h1>
            <p className="text-muted-foreground text-[15px] leading-[1.7] mb-5 max-w-[520px]">
              Наша цель — помочь вам приобрести недвижимость мечты
              от застройщиков в Москве, Санкт-Петербурге и ОАЭ на
              самых выгодных условиях.
            </p>
            <p className="text-muted-foreground text-[15px] leading-[1.7] max-w-[520px]">
              В компании работают специалисты с опытом работы от 15
              лет, готовые подобрать недвижимость, соответствующую
              вашим требованиям на все 100%. Мы гарантируем для своих
              клиентов качественный сервис, безопасное сопровождение
              и максимальный комфорт на каждом этапе сделки.
            </p>
          </div>

          {/* Right - Team photo with pattern and play button */}
          <div className="relative">
            {/* Geometric pattern top-right — large, flush in corner */}
            <img
              src={maskPattern}
              alt=""
              className="absolute -top-16 -right-16 w-[360px] lg:w-[440px] xl:w-[500px] opacity-100 pointer-events-none select-none z-0"
            />
            <div className="relative z-10 aspect-[16/10] overflow-hidden rounded-sm">
              <img
                src={heroTeam}
                alt="Команда Art Estate"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Play button overlay */}
            <button className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: '#00C9CE' }}>
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-14 lg:mt-14 xl:mt-20 border-t border-border pt-10 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`${index !== 0 ? 'md:border-l md:border-border' : ''} md:px-6 first:pl-0 last:pr-0`}
              >
                <span
                  className="block font-serif text-[2.75rem] lg:text-[3.25rem] xl:text-[3.5rem] leading-none mb-2"
                  style={{ color: '#00C9CE' }}
                >
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-[13px] lg:text-[14px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
