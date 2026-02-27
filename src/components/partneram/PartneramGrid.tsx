import { Plus, Users } from "lucide-react";

const cards = [
  {
    title: "Частным брокерам или агентствам недвижимости",
    description: "из любого региона России, если Ваш клиент ищет элитную недвижимость в Москве, Санкт-Петербурге или в ОАЭ",
  },
  {
    title: "Владельцам финансового рынка",
    description: "Владельцам и сотрудникам финансового рынка, Private Banking, Multi-Family-Office, Investment companies",
  },
  {
    title: "Ипотечным или страховым агентам/брокерам",
    description: "Ипотечным или страховым агентам/брокерам",
  },
  {
    title: "Владельцам и сотрудникам",
    description: "автосалонов, яхт-клубов, авиа-парков, гольф-клубов, консьерж-сервисов и прочего сервиса для VIP-клиентов",
  },
  {
    title: "Маркетологам, блогерам, коучам",
    description: "Маркетологам, блогерам, коучам",
  },
  {
    title: "Персональным ассистентам",
    description: "Персональным ассистентам, которые помогают руководителям с поиском недвижимости",
  },
  {
    title: "Любому желающему",
    description: "Любому желающему, который планирует купить элитную недвижимость в России и ОАЭ",
  },
];

export function PartneramGrid() {
  return (
    <section className="py-16 lg:py-16 xl:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-[36px] leading-[48px] font-montserrat font-medium text-foreground mb-12">
          Кому подойдет программа?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-border p-8 flex flex-col justify-between aspect-square"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-[18px] leading-snug text-foreground max-w-[70%]">
                  {card.title}
                </h3>
                <div className="w-10 h-10 rounded-full bg-[#BA846E] flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed italic mt-auto pt-4">
                {card.description}
              </p>
            </div>
          ))}

          {/* CTA card */}
          <a
            href="#partner-form"
            className="p-8 flex flex-col justify-between aspect-square text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#BA846E' }}
          >
            <h3 className="font-serif font-normal text-[24px] leading-[26px]">Заинтересовали?</h3>
            <div className="flex items-end justify-between gap-3 mt-auto">
              <p className="text-white/80 text-[13px] leading-relaxed max-w-[75%]">
                Оставьте заявку, мы с&nbsp;вами свяжемся и&nbsp;расскажем подробнее
              </p>
              <span className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
