import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";

const fallbackData = [
  { year: "2016", title: "Основание компании", description: "Art Estate была основана в Санкт-Петербурге.", image_url: null },
  { year: "2017", title: "Расширение направлений", description: "Добавлены направления по подбору коммерческой недвижимости.", image_url: null },
  { year: "2018", title: "Запуск ипотечного центра", description: "Открыт собственный ипотечный центр.", image_url: null },
  { year: "2019", title: "Рост команды", description: "Команда выросла до 30+ специалистов.", image_url: null },
  { year: "2020", title: "Онлайн-сервис", description: "Запущена платформа онлайн-подбора недвижимости.", image_url: null },
  { year: "2023", title: "Выход на рынок ОАЭ", description: "Открыто представительство в Дубае.", image_url: null },
  { year: "2024", title: "Открытие в Москве", description: "Запущен офис в Москве.", image_url: null },
  { year: "2026", title: "Новые горизонты", description: "50+ сотрудников и новые рынки.", image_url: null },
];

export function AboutTimeline() {
  const { data: dbEvents } = useTimelineEvents();
  const timelineData = dbEvents && dbEvents.length > 0 ? dbEvents : fallbackData;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = timelineData[activeIndex] || timelineData[0];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-3xl lg:text-4xl font-serif mb-12 lg:mb-16">
          История компании
        </h2>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="relative mb-12">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-muted-foreground/30" />
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-accent transition-all duration-300 ease-out"
              style={{
                width: `${(activeIndex / (timelineData.length - 1)) * 100}%`,
              }}
            />
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
                        isActive ? "text-accent" : "text-muted-foreground"
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
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm lg:text-base font-serif text-muted-foreground">...</span>
                <div className="w-3 h-3 rounded-full border-2 bg-background border-muted-foreground/40" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h3 className="text-2xl lg:text-3xl font-serif mb-4">{active.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{active.description}</p>
            </div>
            <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center overflow-hidden max-h-[280px]">
              {active.image_url ? (
                <img src={active.image_url} alt={active.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile */}
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
                      isActive ? "bg-accent border-accent" : "bg-background border-muted-foreground/40"
                    }`}
                  />
                  <div className="pl-4">
                    <span className={`text-lg font-serif block mb-1 transition-colors ${isActive ? "text-accent" : "text-foreground"}`}>
                      {item.year} — {item.title}
                    </span>
                    {isActive && (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{item.description}</p>
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="mt-3 rounded-lg w-full aspect-[4/3] object-cover" />
                        )}
                      </>
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
