import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";

// Static numbered services data for the first section
const numberedServices = [
  {
    number: "01",
    title: "ПОДБОР НЕДВИЖИМОСТИ",
    description: "Подбор недвижимости из всех жилых комплексов на рынке, в одном месте. Без комиссии"
  },
  {
    number: "02",
    title: "АКЦИИ И СПЕЦПРЕДЛОЖЕНИЯ ЗАСТРОЙЩИКОВ В ОДНОМ МЕСТЕ",
    description: "Скидки, подарки для клиентов, розыгрыши призов и др."
  },
  {
    number: "03",
    title: "РАСЧЕТ ИНВЕСТИЦИОННОЙ ПРИВЛЕКАТЕЛЬНОСТИ",
    description: "По каждому из проектов. Профессионально, на высоком уровне"
  },
  {
    number: "04",
    title: "ОРГАНИЗАЦИЯ ЭКСКУРСИИ",
    description: "Организация экскурсии по готовым и строящимся жилым комплексам."
  },
  {
    number: "05",
    title: "РАСЧЕТ ВАРИАНТОВ ПЛАТЕЖЕЙ",
    description: "Рассрочка, ипотека, зачет и др."
  },
  {
    number: "06",
    title: "ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ",
    description: "Приемка квартиры, дизайн-проект, отделка, сдача в аренду, зачет и продажа недвижимости"
  },
  {
    number: "07",
    title: "ОБЪЕКТИВНАЯ ИНФОРМАЦИЯ ПО КАЖДОМУ ИЗ ЗАСТРОЙЩИКОВ",
    description: "Опыт компании, построенные дома, точность в исполнении обязательств, возможные риски"
  },
  {
    number: "08",
    title: "ОДОБРЕНИЕ ИПОТЕКИ – ОТ 1 ЧАСА",
    description: "Благодаря нашему сотрудничеству с банками и ипотечными брокерами"
  }
];

const Uslugi = () => {
  const { data: services, isLoading, error } = useServices();

  return (
    <Layout>
      {/* Numbered Services Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif mb-16">
            Услуги
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {numberedServices.map((service) => (
              <div key={service.number} className="flex gap-2">
                <span className="text-4xl md:text-5xl font-serif italic text-primary shrink-0">
                  {service.number}/
                </span>
                <div>
                  <h3 className="text-sm font-medium tracking-wide mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground italic text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">
              Не удалось загрузить услуги
            </div>
          ) : !services?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              Услуги пока не добавлены
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/uslugi/${service.slug}`}
                  className="group block"
                >
                  {/* Image Card with Hover Overlay */}
                  <div className="relative aspect-[4/3] overflow-hidden mb-4">
                    <img
                      src={service.main_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#C4A484]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-foreground mb-6 text-sm md:text-base">
                        {service.short_description || `${service.title} — одна из популярных услуг компании «Арт Истейт».`}
                      </p>
                      <span className="inline-block border border-foreground px-6 py-2 text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors">
                        Перейти к услуге
                      </span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-serif mb-2">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">
                    {service.short_description?.toUpperCase() || "ПОДРОБНЕЕ ОБ УСЛУГЕ"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Uslugi;
