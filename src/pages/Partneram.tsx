import { Layout } from "@/components/layout/Layout";
import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";
import { PartneramHero } from "@/components/partneram/PartneramHero";
import top3Badge from "@/assets/top3-badge.png";
import geoPattern1 from "@/assets/geo-pattern-1.png";
import geoPattern2 from "@/assets/geo-pattern-2.png";
import logoIconLight from "@/assets/logo-icon-light.png";

const pillars = [
  {
    num: "01",
    title: "ОПЫТ В НЕДВИЖИМОСТИ",
    text: "Компания основана в феврале 2016 года. В команде сотрудники с 13-летним опытом работы на рынке недвижимости.",
  },
  {
    num: "02",
    title: "АМБИЦИОЗНОСТЬ",
    text: "Наша ближайшая цель — стать лидером на рынке агентств недвижимости Санкт-Петербурга, Москвы и Дубая.",
  },
  {
    num: "03",
    title: "ПОСТОЯННЫЙ РОСТ",
    text: "Ежемесячно обрабатываем около 2 500 новых заявок, проводим десятки сделок в месяц и постоянно растем.",
  },
];

const bulletPoints = [
  <>Ежемесячно обрабатываем около <strong>2 500 новых заявок</strong>, проводим десятки сделок в месяц и постоянно растем.</>,
  <>Art Estate входит в <strong>ТОП-3 ведущих агентств</strong> по продажам элитных и респектабельных клубных домов крупнейших застройщиков.</>,
  <>В Московском портфеле Art Estate <em>более 160 объектов Business, Premium и DeLuxe</em> классов.</>,
  <>Ежемесячно брокеры агентства получают более <strong>800 новых целевых клиентов</strong>.</>,
  <>Средний <strong>чек сделок</strong> на уровне <strong>80 000 000 ₽</strong>.</>,
  <>Благодаря отличной репутации и высоким результатам, Art Estate включено в список партнеров на закрытых продажах.</>,
];

const partners = [
  { name: "Группа ЛСР", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop&auto=format" },
  { name: "Setl Group", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&auto=format" },
  { name: "ПИК", logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200&h=100&fit=crop&auto=format" },
  { name: "Группа ЦДС", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=100&fit=crop&auto=format" },
  { name: "ЮИТ", logo: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=100&fit=crop&auto=format" },
  { name: "Эталон", logo: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=200&h=100&fit=crop&auto=format" },
];

const Partneram = () => {
  return (
    <Layout>
      <PartneramHero />

      {/* Three Pillars */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {pillars.map((p) => (
              <div key={p.num} className="flex gap-3">
                <span className="font-serif text-[3rem] lg:text-[4rem] leading-none text-[#00C9CE]">
                  {p.num}<span className="text-primary">/</span>
                </span>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground italic text-[15px] leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bullet Points + Badge */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
          <div className="border border-border rounded-sm p-8 lg:p-12 flex flex-col lg:flex-row items-start gap-8 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.08)]">
            <ul className="flex-1 space-y-4">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground">
                  <span className="mt-1.5 w-2.5 h-2.5 bg-primary/60 rotate-45 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex-shrink-0 self-center">
              <img src={top3Badge} alt="ТОП 3 ведущих агентств" className="w-[120px] lg:w-[150px] h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Кому подойдет программа */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-12">
            Кому подойдет программа?
          </h2>

          <div className="border border-border">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-b border-r border-border p-6 lg:p-8 flex items-center">
                <p className="text-[15px] italic leading-relaxed text-foreground">
                  Частным брокерам или агентствам недвижимости из любого региона России, если Ваш клиент ищет элитную недвижимость в Москве, Санкт-Петербурге или в ОАЭ
                </p>
              </div>
              <div className="border-b border-r border-border bg-[#BA846E] p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
                <img src={geoPattern1} alt="" className="w-16 lg:w-20 h-auto opacity-60 relative z-10" />
              </div>
              <div className="border-b border-border p-6 lg:p-8 flex items-center">
                <p className="text-[15px] italic leading-relaxed text-foreground">
                  Маркетологам, блогерам, коучам
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-b border-r border-border p-6 lg:p-8 flex items-center">
                <p className="text-[15px] italic leading-relaxed text-foreground">
                  Ипотечным<br />или страховым агентам/брокерам
                </p>
              </div>
              <div className="border-b border-r border-border bg-[#BA846E] p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
                <img src={logoIconLight} alt="" className="w-12 lg:w-16 h-auto opacity-80 relative z-10" />
              </div>
              <div className="border-b border-border bg-[#BA846E] p-6 lg:p-8 flex items-center">
                <p className="text-[15px] italic leading-relaxed text-white">
                  Владельцам и сотрудникам автосалонов, яхт-клубов, авиа-парков, гольф-клубов, консьерж-сервиса и прочего сервиса для VIP-клиентов
                </p>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-b border-r border-border bg-[#BA846E] p-6 lg:p-8 flex items-center col-span-1 md:col-span-2">
                <p className="text-[15px] italic leading-relaxed text-white">
                  Владельцам и сотрудникам финансового рынка, Private Banking, Multi-Family-Office, Investment companies
                </p>
              </div>
              <div className="border-b border-border p-6 lg:p-8 flex items-center">
                <p className="text-[15px] italic leading-relaxed text-foreground">
                  Персональным ассистентам, которые помогают руководителям с поиском недвижимости
                </p>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-r border-border p-6 lg:p-8 flex items-center col-span-1 md:col-span-2">
                <p className="text-[15px] italic leading-relaxed text-foreground">
                  Любому желающему, который планирует<br />купить элитную недвижимость в России и ОАЭ
                </p>
              </div>
              <div className="bg-[#BA846E] p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
                <img src={geoPattern2} alt="" className="w-16 lg:w-20 h-auto opacity-60 relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <UnifiedConsultationForm
        title="Стать партнёром"
        subtitle={"Заполните заявку и мы свяжемся\nдля обсуждения условий сотрудничества"}
        formSource="/partneram"
        formType="partner"
        buttonText="СТАТЬ ПАРТНЁРОМ"
      />
    </Layout>
  );
};

export default Partneram;
