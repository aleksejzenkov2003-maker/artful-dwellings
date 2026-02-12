const advantages = [
  {
    title: "Внушительный\nопыт работы",
    description: "В нашей команде более 50 сотрудников с опытом работы на рынке недвижимости с 2005 года",
    emoji: "🏆",
  },
  {
    title: "Амбициозность\nкомпании",
    description: "Наша цель – быть лидерами на рынке агентств недвижимости в Санкт-Петербурге, Москве и ОАЭ",
    emoji: "🎯",
  },
  {
    title: "Непрерывное\nразвитие",
    description: "Ежемесячно обрабатываем ~600 новых заявок, проводим десятки сделок в месяц и постоянно растем",
    emoji: "📈",
  },
];

export function AboutAdvantages() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-serif mb-12">
          Art Estate — это
        </h2>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="border border-border rounded-lg p-8 lg:p-10"
            >
              {/* Title */}
              <h3 className="text-xl lg:text-2xl font-serif whitespace-pre-line mb-6 leading-tight">
                {item.title}
              </h3>

              {/* Icon/emoji placeholder */}
              <div className="text-6xl mb-6">
                {item.emoji}
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
