import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Partneram = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Партнёрам
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Приглашаем к сотрудничеству застройщиков, риелторов и финансовые организации
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">
                Преимущества сотрудничества
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Доступ к базе платёжеспособных клиентов
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Профессиональная команда с опытом более 8 лет
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Прозрачные условия партнёрства
                </li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-serif font-semibold mb-4">
                Стать партнёром
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Заполните форму и мы свяжемся с вами для обсуждения условий
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Отправить заявку
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partneram;
