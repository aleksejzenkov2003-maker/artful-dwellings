import { Layout } from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useCityContacts } from "@/hooks/useCityContacts";
import { useCity } from "@/contexts/CityContext";
import { Skeleton } from "@/components/ui/skeleton";
import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

const Kontakty = () => {
  const { currentCity } = useCity();
  const { data: contacts, isLoading } = useCityContacts();

  const phoneHref = contacts?.phone ? `tel:${contacts.phone.replace(/[^\d+]/g, "")}` : "#";
  const whatsappHref = contacts?.whatsapp ? `https://wa.me/${contacts.whatsapp.replace(/[^\d]/g, "")}` : null;
  const telegramHref = contacts?.telegram ? `https://t.me/${contacts.telegram.replace("@", "")}` : null;

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Контакты
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Свяжитесь с нами любым удобным способом
              {currentCity && <span className="text-primary"> — офис в г. {currentCity.name}</span>}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <a href={phoneHref} className="text-muted-foreground hover:text-primary block">
                        {contacts?.phone || "—"}
                      </a>
                      {contacts?.phone_secondary && (
                        <a 
                          href={`tel:${contacts.phone_secondary.replace(/[^\d+]/g, "")}`} 
                          className="text-muted-foreground hover:text-primary block text-sm"
                        >
                          {contacts.phone_secondary}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a 
                        href={contacts?.email ? `mailto:${contacts.email}` : "#"} 
                        className="text-muted-foreground hover:text-primary"
                      >
                        {contacts?.email || "—"}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-muted-foreground">
                        {contacts?.address || "—"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Режим работы</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {contacts?.working_hours || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Messengers */}
                  {(whatsappHref || telegramHref) && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Мессенджеры</h3>
                        <div className="flex gap-3">
                          {whatsappHref && (
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-green-500/10 text-green-600 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors"
                            >
                              WhatsApp
                            </a>
                          )}
                          {telegramHref && (
                            <a
                              href={telegramHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
                            >
                              Telegram
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Contact Form */}
            <UnifiedConsultationForm
              variant="compact"
              title="Напишите нам"
              subtitle="Оставьте заявку и мы свяжемся с вами"
              formSource="/kontakty"
              formType="contact"
            />
          </div>
          
          {/* Map */}
          <div className="mt-12 bg-muted rounded-xl aspect-[2/1] flex items-center justify-center overflow-hidden">
            {contacts?.coordinates ? (
              <iframe
                src={`https://yandex.ru/map-widget/v1/?ll=${contacts.coordinates.lng},${contacts.coordinates.lat}&z=16&pt=${contacts.coordinates.lng},${contacts.coordinates.lat},pm2rdm`}
                width="100%"
                height="100%"
                frameBorder="0"
                className="w-full h-full"
                title="Карта офиса"
              />
            ) : (
              <p className="text-muted-foreground">Карта загружается...</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kontakty;
