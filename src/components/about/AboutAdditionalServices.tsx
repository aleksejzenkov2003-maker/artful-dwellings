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
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-[36px] leading-[48px] font-montserrat font-medium text-foreground mb-12">
          Дополнительные услуги
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices.map((service, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 lg:p-8 cursor-pointer transition-colors"
                onClick={() => toggle(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-foreground font-bold text-[18px] leading-snug mb-1">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-[13px]">
                      {service.description}
                    </p>
                  </div>
                  <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                    {isOpen ? (
                      <Minus className="w-5 h-5" style={{ color: '#00C9CE' }} />
                    ) : (
                      <Plus className="w-5 h-5" style={{ color: '#00C9CE' }} />
                    )}
                  </button>
                </div>

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
