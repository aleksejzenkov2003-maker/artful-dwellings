import { Award, Rocket, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const advantages = [
  {
    icon: Award,
    title: "Внушительный опыт работы",
    description: "Более 8 лет на рынке недвижимости и свыше 3500 успешно закрытых сделок. Наши эксперты знают рынок изнутри."
  },
  {
    icon: Rocket,
    title: "Амбициозность компании",
    description: "Мы не останавливаемся на достигнутом и постоянно расширяем географию присутствия — Санкт-Петербург, Москва, ОАЭ."
  },
  {
    icon: TrendingUp,
    title: "Непрерывное развитие",
    description: "Регулярное обучение сотрудников, внедрение новых технологий и следование трендам рынка недвижимости."
  }
];

export function AboutAdvantages() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Advantages grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {advantages.map((advantage) => (
            <div key={advantage.title} className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <advantage.icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-serif mb-4">
                {advantage.title}
              </h3>
              
              {/* Divider */}
              <div className="w-16 h-px bg-primary mx-auto mb-4" />
              
              {/* Description */}
              <p className="text-muted-foreground italic leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="bg-secondary rounded-lg p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-serif mb-2">
              Заинтересовались?
            </h3>
            <p className="text-muted-foreground">
              Свяжитесь с нами для бесплатной консультации
            </p>
          </div>
          <Button variant="teal" size="lg" asChild>
            <Link to="/kontakty">
              КОНТАКТЫ
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
