import { useState } from "react";
import { ImageIcon } from "lucide-react";

const timelineData = [
  {
    year: "2016",
    title: "Основание компании",
    description:
      "Art Estate была основана в Санкт-Петербурге с целью создать агентство недвижимости нового формата — с индивидуальным подходом и экспертизой на рынке новостроек.",
  },
  {
    year: "2017",
    title: "Расширение направлений",
    description:
      "Компания расширила спектр услуг: добавлены направления по подбору коммерческой недвижимости и инвестиционному консалтингу.",
  },
  {
    year: "2018",
    title: "Запуск ипотечного центра",
    description:
      "Открыт собственный ипотечный центр с партнёрскими программами ведущих банков, что позволило клиентам получать лучшие условия кредитования.",
  },
  {
    year: "2019",
    title: "Рост команды",
    description:
      "Команда выросла до 30+ специалистов. Компания вошла в ТОП-3 агентств недвижимости Санкт-Петербурга по версии отраслевых рейтингов.",
  },
  {
    year: "2020",
    title: "Онлайн-сервис",
    description:
      "Запущена платформа онлайн-подбора недвижимости с виртуальными турами и дистанционным оформлением сделок.",
  },
  {
    year: "2023",
    title: "Выход на рынок ОАЭ",
    description:
      "Art Estate открыла представительство в Дубае, предлагая клиентам инвестиционную недвижимость в ОАЭ.",
  },
  {
    year: "2024",
    title: "Открытие в Москве",
    description:
      "Запущен офис в Москве. Компания стала федеральным игроком с присутствием в трёх ключевых локациях.",
  },
  {
    year: "2026",
    title: "Новые горизонты",
    description:
      "Продолжаем расти: 50+ сотрудников, сотни успешных сделок ежемесячно и новые рынки на горизонте.",
  },
];

export function AboutTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = timelineData[activeIndex];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-serif mb-12 lg:mb-16">
          История компании
        </h2>

        {/* Desktop */}
        <div className="hidden md:block">
          {/* Year row + line */}
          <div className="relative mb-12">
            {/* Background dashed line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-muted-foreground/30" />
            {/* Accent solid line */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-accent transition-all duration-300 ease-out"
              style={{
                width: `${(activeIndex / (timelineData.length - 1)) * 100}%`,
              }}
            />

            {/* Year labels */}
            <div className="relative flex justify-between">
              {timelineData.map((item, i) => {
                const isActive = i <= activeIndex;
                return (
                  <button
                    key={item.year}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                    className="flex flex-col items-center gap-3 group cursor-pointer bg-transparent border-none p-0"
                  >
                    <span
                      className={`text-sm lg:text-base font-serif transition-colors duration-200 ${
                        isActive
                          ? "text-accent"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.year}
                    </span>
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-colors duration-200 ${
                        isActive
                          ? "bg-accent border-accent"
                          : "bg-background border-muted-foreground/40"
                      }`}
                    />
                  </button>
                );
              })}
              {/* Ellipsis */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm lg:text-base font-serif text-muted-foreground">
                  ...
                </span>
                <div className="w-3 h-3 rounded-full border-2 bg-background border-muted-foreground/40" />
              </div>
            </div>
          </div>

          {/* Detail card */}
          <div className="grid grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h3 className="text-2xl lg:text-3xl font-serif mb-4">
                {active.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {active.description}
              </p>
            </div>
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
            </div>
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden">
          <div className="relative pl-8">
            <div className="absolute left-[5px] top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/30" />

            {timelineData.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={item.year}
                  onClick={() => setActiveIndex(i)}
                  className="relative mb-8 last:mb-0 text-left w-full bg-transparent border-none p-0 cursor-pointer"
                >
                  <div
                    className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 -translate-x-1/2 transition-colors ${
                      isActive
                        ? "bg-accent border-accent"
                        : "bg-background border-muted-foreground/40"
                    }`}
                  />
                  <div className="pl-4">
                    <span
                      className={`text-lg font-serif block mb-1 transition-colors ${
                        isActive ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {item.year} — {item.title}
                    </span>
                    {isActive && (
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
