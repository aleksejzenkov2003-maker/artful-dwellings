import { Plus, Home, BarChart3, Flame, FileText, Bus, Percent, Calculator } from "lucide-react";

const services = [
  {
    title: "Подбор недвижимости",
    description: "Подбор недвижимости из всех жилых комплексов на рынке, в одном месте. Без комиссии.",
    Icon: Home,
  },
  {
    title: "Расчет инвестиционной привлекательности",
    description: "По каждому из проектов. Профессионально, на высоком уровне",
    Icon: BarChart3,
  },
  {
    title: "Спецпредложения и акции в одном месте",
    description: "Скидки, подарки для клиентов, розыгрыши призов и другое",
    Icon: Flame,
  },
  {
    title: "Объективная информация по каждому из застройщиков",
    description: "Опыт компании, построенные дома, точность в исполнении обязательств, возможные риски",
    Icon: FileText,
  },
  {
    title: "Организация экскурсии",
    description: "Организация экскурсии по готовым и строящимся жилым комплексам",
    Icon: Bus,
  },
  {
    title: "Одобрение ипотеки – от 1 часа",
    description: "Благодаря нашему сотрудничеству с банками и ипотечными брокерами",
    Icon: Percent,
  },
  {
    title: "Расчет вариантов платежей",
    description: "Рассрочка, ипотека, зачет и др.",
    Icon: Calculator,
  },
];

export function AboutServices() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-[36px] leading-[48px] font-montserrat font-medium text-foreground mb-12">Услуги</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const { Icon } = service;
            return (
              <div
                key={index}
                className="bg-white border border-[#e5e0db] rounded-xl p-6 flex flex-col justify-between min-h-[240px]"
              >
                {/* Top: title + icon */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-[15px] leading-tight text-foreground max-w-[75%]">
                    {service.title}
                  </h3>
                  <Icon
                    className="w-7 h-7 flex-shrink-0"
                    style={{ color: '#BA846E' }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Bottom: description */}
                <p className="text-[13px] text-muted-foreground leading-relaxed mt-auto pt-6">
                  {service.description}
                </p>
              </div>
            );
          })}

          {/* CTA card */}
          <div
            className="rounded-xl p-6 flex flex-col justify-between min-h-[240px] text-white"
            style={{ backgroundColor: '#BA846E' }}
          >
            <h3 className="font-serif italic text-xl lg:text-2xl">Заинтересовали?</h3>
            <div className="flex items-end justify-between gap-3 mt-auto">
              <p className="text-white/80 text-[13px] leading-relaxed max-w-[75%]">
                Оставьте заявку, мы с&nbsp;вами свяжемся и&nbsp;расскажем подробнее
              </p>
              <button className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
