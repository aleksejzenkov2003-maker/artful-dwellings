import { Plus } from "lucide-react";
import iconHome from "@/assets/service-icon-home.png";
import iconChart from "@/assets/service-icon-chart.png";
import iconPromo from "@/assets/service-icon-promo.png";
import iconDocs from "@/assets/service-icon-docs.png";
import iconBus from "@/assets/service-icon-bus.png";
import iconMortgage from "@/assets/service-icon-mortgage.png";
import iconCalc from "@/assets/service-icon-calc.png";

const services = [
  {
    title: "Подбор недвижимости",
    description: "Подбор недвижимости из всех жилых комплексов на рынке, в одном месте. Без комиссии.",
    icon: iconHome,
  },
  {
    title: "Расчет инвестиционной привлекательности",
    description: "По каждому из проектов. Профессионально, на высоком уровне",
    icon: iconChart,
  },
  {
    title: "Спецпредложения и акции в одном месте",
    description: "Скидки, подарки для клиентов, розыгрыши призов и другое",
    icon: iconPromo,
  },
  {
    title: "Объективная информация по каждому из застройщиков",
    description: "Опыт компании, построенные дома, точность в исполнении обязательств, возможные риски",
    icon: iconDocs,
  },
  {
    title: "Организация экскурсии",
    description: "Организация экскурсии по готовым и строящимся жилым комплексам",
    icon: iconBus,
  },
  {
    title: "Одобрение ипотеки – от 1 часа",
    description: "Благодаря нашему сотрудничеству с банками и ипотечными брокерами",
    icon: iconMortgage,
  },
  {
    title: "Расчет вариантов платежей",
    description: "Рассрочка, ипотека, зачет и др.",
    icon: iconCalc,
  },
];

export function AboutServices() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-[36px] leading-[48px] font-montserrat font-medium text-foreground mb-12">Услуги</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between min-h-[240px]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-[18px] leading-snug text-foreground max-w-[70%]">
                  {service.title}
                </h3>
                <img src={service.icon} alt="" className="w-10 h-10 flex-shrink-0 object-contain" />
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed italic mt-auto pt-4">
                {service.description}
              </p>
            </div>
          ))}

          {/* CTA card */}
          <div
            className="p-6 flex flex-col justify-between min-h-[240px] text-white"
            style={{ backgroundColor: '#BA846E' }}
          >
            <h3 className="font-aeroport font-normal text-[24px] leading-[26px]">Заинтересовали?</h3>
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
