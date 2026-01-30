const timelineYears = [
  { year: "2016", label: "Основание" },
  { year: "2017", label: "Расширение" },
  { year: "2018", label: "Ипотека" },
  { year: "2019", label: "Рост команды" },
  { year: "2020", label: "Онлайн-сервис" },
  { year: "2023", label: "ОАЭ" },
  { year: "2024", label: "Москва" },
];

export function AboutTimeline() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-serif text-center mb-16">
          История Art Estate
        </h2>

        {/* Timeline - horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Desktop horizontal timeline */}
          <div className="hidden md:block">
            {/* Horizontal line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-border -translate-y-1/2" />
            
            {/* Years */}
            <div className="flex justify-between items-center relative">
              {timelineYears.map((item, index) => (
                <div key={item.year} className="flex flex-col items-center">
                  {/* Year label */}
                  <span className="text-lg font-serif mb-4">{item.year}</span>
                  
                  {/* Dot */}
                  <div className="w-3 h-3 rounded-full bg-primary border-4 border-background relative z-10" />
                  
                  {/* Description (hidden, shown on hover) */}
                  <span className="text-xs text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="md:hidden">
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-1 top-0 bottom-0 w-px bg-border" />
              
              {timelineYears.map((item, index) => (
                <div key={item.year} className="relative mb-8 last:mb-0">
                  {/* Dot */}
                  <div className="absolute left-0 w-3 h-3 rounded-full bg-primary border-4 border-background -translate-x-1/2" />
                  
                  {/* Content */}
                  <div className="pl-4">
                    <span className="text-lg font-serif">{item.year}</span>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
