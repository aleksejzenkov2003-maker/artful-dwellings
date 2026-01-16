import { Layout } from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { ServiceCard } from "@/components/services/ServiceCard";

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
          <h1 className="text-3xl md:text-4xl font-serif mb-16">
            Услуги
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-16">
            {numberedServices.map((service) => (
              <div key={service.number} className="flex items-start gap-1">
                <span className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-primary leading-none">
                  {service.number}/
                </span>
                <div className="pt-1">
                  <h3 className="text-xs font-medium tracking-wide mb-3 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground italic text-sm leading-relaxed">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={{
                    ...service,
                    is_featured: (service as any).is_featured,
                    featured_text: (service as any).featured_text,
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Uslugi;
