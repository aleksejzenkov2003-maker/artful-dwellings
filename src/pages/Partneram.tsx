import { Layout } from "@/components/layout/Layout";
import { 
  Building2, 
  Users, 
  Handshake, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
} from "lucide-react";
import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";
import { PartneramHero } from "@/components/partneram/PartneramHero";

const partners = [
  { name: "Группа ЛСР", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop&auto=format" },
  { name: "Setl Group", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&auto=format" },
  { name: "ПИК", logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200&h=100&fit=crop&auto=format" },
  { name: "Группа ЦДС", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=100&fit=crop&auto=format" },
  { name: "ЮИТ", logo: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=100&fit=crop&auto=format" },
  { name: "Эталон", logo: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=200&h=100&fit=crop&auto=format" },
];

const advantages = [
  {
    icon: Users,
    title: "Доступ к базе клиентов",
    description: "Более 5000 активных покупателей в нашей базе с подтверждённой платёжеспособностью",
  },
  {
    icon: TrendingUp,
    title: "Высокая конверсия",
    description: "Конверсия в сделку до 15% благодаря качественной квалификации клиентов",
  },
  {
    icon: Shield,
    title: "Прозрачные условия",
    description: "Чёткие договорённости и своевременные выплаты партнёрского вознаграждения",
  },
  {
    icon: Clock,
    title: "Оперативность",
    description: "Быстрое согласование условий и оформление документов в течение 1-2 дней",
  },
  {
    icon: Handshake,
    title: "Индивидуальный подход",
    description: "Персональный менеджер для каждого партнёра и гибкие условия сотрудничества",
  },
  {
    icon: Building2,
    title: "Опыт 8+ лет",
    description: "Профессиональная команда с глубоким знанием рынка недвижимости Санкт-Петербурга",
  },
];

const partnerTypes = [
  {
    title: "Застройщикам",
    description: "Эффективные продажи ваших объектов через нашу сеть агентов и маркетинговые каналы",
    features: ["Продвижение объектов", "Квалифицированные лиды", "Отчётность по продажам"],
  },
  {
    title: "Риелторам",
    description: "Совместные сделки и доступ к эксклюзивным объектам нашего портфеля",
    features: ["Доступ к базе объектов", "Совместные сделки", "Обучение и поддержка"],
  },
  {
    title: "Банкам и страховым",
    description: "Направление клиентов на ипотеку и страхование недвижимости",
    features: ["Клиентский поток", "Интеграция процессов", "Партнёрские программы"],
  },
];

const Partneram = () => {

  return (
    <Layout>
      {/* Hero Section */}
      <PartneramHero />

      {/* Partner Types */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Кого мы приглашаем
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div
                key={index}
                className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-2xl font-serif font-semibold mb-4 group-hover:text-primary transition-colors">
                  {type.title}
                </h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
            Преимущества сотрудничества
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Мы предлагаем выгодные условия и комплексную поддержку для наших партнёров
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div
                  key={index}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Logos */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
            Наши партнёры
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Мы сотрудничаем с ведущими застройщиками и компаниями рынка недвижимости
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="group bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center aspect-[3/2] hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-full h-12 mb-3 overflow-hidden rounded-lg">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <span className="text-xs text-muted-foreground text-center font-medium">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
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
