import heroTeam from "@/assets/hero-team.jpg";

const stats = [
  { value: "15+", label: "лет на рынке" },
  { value: "850+", label: "объектов в базе" },
  { value: "50", label: "специалистов" },
  { value: "4200+", label: "успешных сделок" },
  { value: "3500", label: "довольных клиентов" },
];

export function AboutIntro() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - text */}
          <div className="relative">
            {/* Teal accent line */}
            <div className="absolute left-0 top-0 w-1 h-24 bg-primary" />
            
            <div className="pl-8">
              <p className="text-lg lg:text-xl text-foreground leading-relaxed mb-6">
                Компания Art Estate присутствует на рынке уже более 8 лет, за это время нами было продано более 
                3500 объектов недвижимости в Москве, Санкт-Петербурге и ОАЭ.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Мы специализируемся на продаже квартир и апартаментов комфорт и бизнес-класса от застройщиков, 
                помогая нашим клиентам находить идеальные решения для жизни и инвестиций. Каждый член нашей команды — 
                эксперт с многолетним опытом в сфере недвижимости.
              </p>
            </div>
          </div>

          {/* Right column - photo */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={heroTeam} 
                alt="Команда Art Estate" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-3xl lg:text-4xl font-serif text-primary block mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          {/* Coral separator line */}
          <div className="w-full h-px bg-accent mt-12" />
        </div>
      </div>
    </section>
  );
}
