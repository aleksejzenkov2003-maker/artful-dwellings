import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-navy">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075')] bg-cover bg-center opacity-20" />
        
        {/* Geometric pattern overlay */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M100 10L180 55V145L100 190L20 145V55L100 10Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
            <path
              d="M100 30L160 65V135L100 170L40 135V65L100 30Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
            <path
              d="M100 50L140 75V125L100 150L60 125V75L100 50Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span>Главная</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white max-w-3xl leading-tight mb-8">
            Art Estate — команда, созданная профессионалами рынка недвижимости.
          </h1>
          
          <p className="text-white/70 max-w-xl text-lg mb-8">
            Уникальные партнёрские взаимоотношения компании с ведущими застройщиками северной столицы позволяют предлагать клиентам выгодные условия сотрудничества.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif mb-12">Услуги</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {[
              { num: "01", title: "Подбор недвижимости", desc: "Комфортный подбор квартир под ваши параметры" },
              { num: "02", title: "Проверка объектов", desc: "Юридическая проверка и сопровождение" },
              { num: "03", title: "HELP Система Бухгалтерии", desc: "Налоговое планирование" },
              { num: "04", title: "Услуги по приобретению", desc: "Полное сопровождение сделки" },
              { num: "05", title: "Trade In", desc: "Обмен старой недвижимости на новую" },
              { num: "06", title: "Страхование объектов", desc: "Защита вашей недвижимости" },
              { num: "07", title: "Курс инвестора", desc: "Обучение инвестированию" },
              { num: "08", title: "Авторские туры", desc: "Экскурсии по объектам" },
            ].map((service) => (
              <div key={service.num} className="group cursor-pointer">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-serif text-primary">{service.num}/</span>
                </div>
                <h3 className="text-sm font-medium text-primary mb-1 group-hover:underline">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="border-foreground/20">
              Все услуги
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Art Estate — официальный партнер ведущих застройщиков и банков, что подтверждается сертификатами о партнерстве, представленными на сайте и в офисе компании.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                year: "2009", 
                title: "Большой опыт работы", 
                desc: "С нами работают покупатели и партнеры с 2009 года, мы выстроили отношения на доверии и честности" 
              },
              { 
                icon: "◇", 
                title: "Амбициозность компании", 
                desc: "Занимаемся недвижимостью — владеем информацией: каждый день получаем информацию о новых предложениях от застройщиков" 
              },
              { 
                icon: "📈", 
                title: "Постоянный рост", 
                desc: "Развиваем отношения с клиентами и партнерами для совместного долгосрочного развития бизнеса" 
              },
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 border border-border">
                <div className="mb-4">
                  {stat.year ? (
                    <span className="text-4xl font-serif text-primary">{stat.year}</span>
                  ) : (
                    <span className="text-4xl">{stat.icon}</span>
                  )}
                </div>
                <h3 className="text-lg font-medium mb-3">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section className="py-16 lg:py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-4">
            Заинтересовались? Свяжитесь с нами.
          </p>
          
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-serif mb-8">
              Здравствуйте, меня зовут{" "}
              <span className="border-b border-primary text-primary">ваше имя</span>,<br />
              хочу получить консультацию по теме<br />
              в премиальной недвижимости, свяжитесь со мной<br />
              по номеру телефона —{" "}
              <span className="border-b border-primary text-primary">+7-987-654-32-10</span>
            </h2>
            
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Отправить заявку
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
            Команда экспертов
          </h2>
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12">
            Опытный переговорщик на вашей стороне — не повредит. Мы сделаем все возможное, 
            чтобы вы купили квартиру на самых выгодных условиях.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Елена Максимова", role: "Ведущий специалист агентства Art Estate" },
              { name: "Виктор Борисов", role: "Брокер агентства Art Estate" },
              { name: "Илья Кириллов", role: "Ведущий специалист агентства Art Estate" },
            ].map((member) => (
              <div key={member.name} className="text-center group">
                <div className="aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-black/20 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300" />
                </div>
                <h3 className="font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
