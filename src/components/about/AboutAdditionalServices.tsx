import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const additionalServices = [
  {
    title: "Дизайн интерьера",
    description: "Разработка дизайн-проекта квартиры или апартаментов под ключ. Работаем с лучшими дизайнерами и архитекторами города, помогаем создать пространство вашей мечты.",
  },
  {
    title: "Меблировка",
    description: "Полная комплектация квартиры мебелью и техникой. Подбираем и доставляем всё необходимое для комфортной жизни или сдачи в аренду.",
  },
  {
    title: "Управление недвижимостью",
    description: "Полное управление вашей инвестиционной недвижимостью: поиск арендаторов, контроль оплаты, решение бытовых вопросов.",
  },
  {
    title: "Юридическое сопровождение",
    description: "Проверка юридической чистоты объекта, сопровождение сделки, оформление документов. Защитим ваши интересы на каждом этапе.",
  },
];

export function AboutAdditionalServices() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif whitespace-nowrap">
            Дополнительные услуги
          </h2>
          <div className="w-24 h-px bg-foreground" />
        </div>

        {/* 2x2 grid of accordion items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {additionalServices.map((service, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-border bg-card p-6 lg:p-8 cursor-pointer transition-all hover:border-primary/50"
                onClick={() => toggle(index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-primary font-serif italic text-2xl lg:text-3xl mb-2 block leading-none">
                      {String(index + 1).padStart(2, "0")}/
                    </span>
                    <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground mt-3">
                      {service.title}
                    </h3>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0 transition-colors hover:border-primary">
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-muted-foreground italic leading-relaxed text-[15px]">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
