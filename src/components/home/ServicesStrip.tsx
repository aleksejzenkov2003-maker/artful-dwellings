import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { Key, Wrench, Handshake, PenTool } from "lucide-react";
import { toast } from "sonner";

const services = [
  {
    icon: Key,
    title: "Поможем",
    subtitle: "с приёмкой квартиры",
  },
  {
    icon: Wrench,
    title: "Создадим",
    subtitle: "дизайн-проект",
  },
  {
    icon: Handshake,
    title: "Согласуем",
    subtitle: "перепланировку",
  },
  {
    icon: PenTool,
    title: "Выполним",
    subtitle: "отделку",
  },
];

export function ServicesStrip() {
  const [phone, setPhone] = useState("");
  const mutation = useSubmitLead();

  const handleSubmit = () => {
    if (phone.length < 10) {
      toast.error("Введите корректный номер телефона");
      return;
    }
    
    mutation.mutate({
      name: "Быстрая заявка",
      phone,
      email: null,
      message: null,
      form_type: "quick_consultation",
      form_source: "Главная - быстрая консультация",
    }, {
      onSuccess: () => {
        setPhone("");
      }
    });
  };

  return (
    <>
      {/* Quick Consultation Strip */}
      <section className="py-6 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <h3 className="text-xl font-serif text-primary">
              Получите консультацию
            </h3>
            <div className="flex items-center gap-3">
              <Input
                type="tel"
                placeholder="Ваш телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-48"
              />
              <Button 
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="bg-zinc-900 hover:bg-zinc-800 uppercase text-xs tracking-wider"
              >
                {mutation.isPending ? "..." : "Заказать"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services After Sale */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-serif">
              Поможем и после продажи
            </h2>
            <div className="flex-1 h-px bg-border hidden md:block" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <service.icon className="w-10 h-10 text-muted-foreground" strokeWidth={1} />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {service.title}
                </p>
                <p className="text-sm font-medium">{service.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/uslugi">
              <Button variant="outline" className="border-foreground/20 uppercase text-xs tracking-wider">
                Все наши услуги
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
