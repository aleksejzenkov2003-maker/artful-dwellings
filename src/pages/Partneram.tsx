import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Users, 
  Handshake, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  Send
} from "lucide-react";
import { useState } from "react";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { z } from "zod";

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа").max(100, "Максимум 100 символов"),
  phone: z.string().trim().min(10, "Введите корректный номер").max(20, "Максимум 20 символов"),
  email: z.string().trim().email("Введите корректный email").max(255, "Максимум 255 символов"),
  company: z.string().trim().max(200, "Максимум 200 символов").optional(),
  message: z.string().trim().max(1000, "Максимум 1000 символов").optional(),
});

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: submitLead, isPending } = useSubmitLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = partnerSchema.safeParse(formData);
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
      email: formData.email.trim(),
      message: formData.company ? `Компания: ${formData.company.trim()}\n${formData.message?.trim() || ""}` : formData.message?.trim() || null,
      form_type: "partner",
      form_source: "/partneram",
    }, {
      onSuccess: () => {
        setFormData({ name: "", phone: "", email: "", company: "", message: "" });
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Партнёрская программа
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Приглашаем к сотрудничеству застройщиков, риелторов и финансовые организации. 
              Вместе мы создаём успешные сделки и развиваем рынок недвижимости.
            </p>
          </div>
        </div>
      </section>

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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Стать партнёром
              </h2>
              <p className="text-muted-foreground">
                Заполните форму и мы свяжемся с вами для обсуждения условий сотрудничества
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name}</p>
                  )}
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
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="partner@company.ru"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Название компании"
                    className={errors.company ? "border-destructive" : ""}
                  />
                  {errors.company && (
                    <p className="text-destructive text-sm">{errors.company}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Расскажите о себе и ваших предложениях..."
                  rows={4}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-destructive text-sm">{errors.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  "Отправка..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Отправить заявку
                  </>
                )}
              </Button>
              
              <p className="text-muted-foreground text-xs text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partneram;
