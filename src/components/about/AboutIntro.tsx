import heroTeam from "@/assets/hero-team.jpg";

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
      </div>
    </section>
  );
}
