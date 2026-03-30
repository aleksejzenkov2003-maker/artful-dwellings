import { useState } from "react";
import { Building2, Shield, TrendingUp, Users, Award, Briefcase } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Премиальные объекты",
    description: "Эксклюзивный доступ к лучшим новостройкам и элитной недвижимости от ведущих застройщиков",
  },
  {
    icon: Shield,
    title: "Юридическая защита",
    description: "Полная проверка документов и юридическое сопровождение каждой сделки",
  },
  {
    icon: TrendingUp,
    title: "Инвестиционный анализ",
    description: "Профессиональная оценка инвестиционного потенциала объектов недвижимости",
  },
  {
    icon: Users,
    title: "Персональный подход",
    description: "Индивидуальная работа с каждым клиентом и подбор оптимальных решений",
  },
  {
    icon: Award,
    title: "Партнёр застройщиков",
    description: "Официальный партнёр крупнейших застройщиков с эксклюзивными условиями",
  },
  {
    icon: Briefcase,
    title: "Полный цикл услуг",
    description: "От подбора до оформления сделки — все услуги в одном месте",
  },
];

export function FeaturesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isHovered = hoveredIndex === index;
        
        return (
          <div
            key={feature.title}
            className="bg-background p-8 cursor-pointer transition-all duration-300 hover:bg-secondary group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="mb-4">
              <Icon className={`h-8 w-8 transition-colors duration-300 ${
                isHovered ? "text-primary" : "text-muted-foreground"
              }`} />
            </div>
            <h3 className={`font-medium mb-2 transition-colors duration-300 ${
              isHovered ? "text-primary" : "text-foreground"
            }`}>
              {feature.title}
            </h3>
            <p className={`text-sm transition-all duration-300 ${
              isHovered ? "opacity-100 text-muted-foreground" : "opacity-0 lg:opacity-0"
            }`}>
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
