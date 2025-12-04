import { Layout } from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ServicePage = () => {
  const { slug } = useParams();

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 capitalize">
            {slug?.replace(/-/g, " ")}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground text-lg">
                  Подробное описание услуги будет добавлено из базы данных.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-serif font-semibold mb-4">
                  Заказать услугу
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Оставьте заявку и мы свяжемся с вами в ближайшее время
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Оставить заявку
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicePage;
