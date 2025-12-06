import { Layout } from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCityContacts } from "@/hooks/useCityContacts";
import { useCity } from "@/contexts/CityContext";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { useState } from "react";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа").max(100),
  phone: z.string().trim().min(10, "Введите корректный номер").max(20),
  message: z.string().trim().max(1000).optional(),
});

const Kontakty = () => {
  const { currentCity } = useCity();
  const { data: contacts, isLoading } = useCityContacts();
  const { mutate: submitLead, isPending } = useSubmitLead();
  
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    submitLead({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      message: formData.message?.trim() || null,
      form_type: "contact",
      form_source: "/kontakty",
    }, {
      onSuccess: () => {
        setFormData({ name: "", phone: "", message: "" });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">
                Напишите нам
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Иван Иванов"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 999-99-99"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ваш вопрос или сообщение..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Отправка..." : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить сообщение
                    </>
                  )}
                </Button>
                
                <p className="text-muted-foreground text-xs text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </div>
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
