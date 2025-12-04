import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Подбор новостройки",
    description: "Поможем выбрать идеальную квартиру в новом доме",
    slug: "podbor-novostroyki",
  },
  {
    title: "Сопровождение сделки",
    description: "Полное юридическое сопровождение покупки",
    slug: "soprovozhdenie-sdelki",
  },
  {
    title: "Ипотечное кредитование",
    description: "Подберём лучшие условия от банков-партнёров",
    slug: "ipotechnoe-kreditovanie",
  },
  {
    title: "Инвестиции в недвижимость",
    description: "Консультации по выгодным вложениям",
    slug: "investicii",
  },
];

const Uslugi = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Наши услуги
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Комплексный подход к решению любых задач в сфере недвижимости
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/uslugi/${service.slug}`}
                className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <span className="inline-flex items-center text-primary text-sm font-medium">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Uslugi;
