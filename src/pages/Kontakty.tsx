import { Layout } from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Kontakty = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Контакты
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Свяжитесь с нами любым удобным способом
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Телефон</h3>
                  <a href="tel:+74952552000" className="text-muted-foreground hover:text-primary">
                    +7 (495) 255-20-00
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:info@art-estate.top" className="text-muted-foreground hover:text-primary">
                    info@art-estate.top
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Адрес</h3>
                  <a
                    href="https://yandex.ru/maps/-/CDUwrXMB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Москва, ул. Примерная, д. 1
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Режим работы</h3>
                  <p className="text-muted-foreground">
                    Пн-Пт: 9:00 - 20:00<br />
                    Сб-Вс: 10:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">
                Напишите нам
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Форма обратной связи будет добавлена
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Отправить сообщение
                </Button>
              </div>
            </div>
          </div>
          
          {/* Map placeholder */}
          <div className="mt-12 bg-secondary rounded-lg aspect-[2/1] flex items-center justify-center">
            <p className="text-muted-foreground">Яндекс Карта</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kontakty;
