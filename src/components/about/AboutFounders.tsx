const founders = [
  {
    name: "Сергей Чурганов",
    description: "Сооснователь компании Art Estate. Опыт работы в сфере недвижимости с 2005 года. За это время прошел путь от рядового агента до руководителя крупного агентства. Эксперт в области элитной недвижимости Санкт-Петербурга."
  },
  {
    name: "Константин Назаров",
    description: "Сооснователь компании Art Estate. Опыт работы в сфере недвижимости с 2005 года. Специализируется на инвестиционных проектах и коммерческой недвижимости. Ведущий эксперт по рынку новостроек."
  }
];

export function AboutFounders() {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-serif text-center mb-12 uppercase tracking-wider text-primary">
          Основатели компании
        </h2>

        {/* Founders cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {founders.map((founder) => (
            <div 
              key={founder.name}
              className="bg-card p-8 border-l-4 border-accent"
            >
              <h3 className="text-2xl font-serif mb-4 text-primary">
                {founder.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {founder.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
