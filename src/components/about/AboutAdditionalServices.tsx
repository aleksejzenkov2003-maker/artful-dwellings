import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const additionalServices = [
  {
    title: "Дизайн",
    description: "Дизайн-проект и ремонт высшего класса",
  },
  {
    title: "Отделка",
    description: "С нашей помощью вы получаете квартиру готовую к заселению",
  },
  {
    title: "Перепланировка",
    description: "Согласуем и узаконим любую перепланировку",
  },
  {
    title: "Приемка квартир",
    description: "Экспертная помощь во время приема объекта у застройщика",
  },
];

export function AboutAdditionalServices() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 lg:py-16 bg-accent">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <h2 className="text-3xl lg:text-4xl font-serif text-white mb-8">
          Дополнительные услуги
        </h2>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices.map((service, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white/90 rounded-lg p-5 lg:p-6 cursor-pointer transition-all hover:bg-white"
                onClick={() => toggle(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-foreground font-medium text-base mb-1">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>
                  <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-foreground" />
                    ) : (
                      <Plus className="w-4 h-4 text-foreground" />
                    )}
                  </button>
                </div>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Подробная информация о услуге «{service.title}». Свяжитесь с нами для консультации.
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
