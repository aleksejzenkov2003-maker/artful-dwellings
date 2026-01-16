import { useState } from "react";
import { TealButton } from "@/components/ui/teal-button";
import { Link } from "react-router-dom";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { useCity } from "@/contexts/CityContext";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

const defaultServices: ServiceCard[] = [
  {
    id: "1",
    title: "Квартиры по переуступке и от подрядчиков",
    description: "Периодически на рынке возникает возможность купить квартиру по выгодной цене. Происходит это по разным причинам: иногда покупатели, приобретая квартиру на раннем этапе, продают ее позднее. Иногда выгодную цену предлагают подрядчики, с которыми Застройщик рассчитался квартирами.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
  },
  {
    id: "2",
    title: "Разные формы оплаты",
    description: "Мы предлагаем различные финансовые схемы: ипотека, рассрочка, trade-in, материнский капитал. Подберём оптимальный вариант под ваш бюджет и потребности.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop"
  },
  {
    id: "3",
    title: "Юридическое сопровождение",
    description: "Полная проверка юридической чистоты объекта. Сопровождение сделки от начала до конца. Гарантия безопасности ваших инвестиций.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
  },
  {
    id: "4",
    title: "Мы на вашей стороне",
    description: "Наша команда профессионалов всегда защищает интересы клиента. Мы работаем открыто и честно, предоставляя полную информацию о каждом объекте.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
  },
  {
    id: "5",
    title: "Тотальная экономия времени",
    description: "Мы берем на себя все заботы по подбору, проверке и оформлению недвижимости. Вы экономите сотни часов своего времени, получая готовое решение.",
    image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&h=400&fit=crop"
  },
  {
    id: "6",
    title: "Профессиональная команда",
    description: "Наши специалисты имеют многолетний опыт работы на рынке недвижимости. Мы знаем все нюансы и подводные камни каждой сделки.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
  }
];

interface FlipCardProps {
  title: string;
  description: string;
  image: string;
  className?: string;
}

function FlipCard({ title, description, image, className = "" }: FlipCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className={`group relative overflow-hidden rounded-sm ${className}`}>
      {/* Front - Image with title */}
      <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
        <img 
          src={imageError ? "/placeholder.svg" : image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-navy/60" />
        {/* Teal accent line top */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1CBCB4]" />
        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h3 className="text-white text-xl md:text-2xl font-serif text-center leading-snug">
            {title}
          </h3>
        </div>
        {/* Teal accent line bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1CBCB4]" />
      </div>
      
      {/* Back - Description text */}
      <div className="absolute inset-0 bg-white p-6 md:p-8 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100 shadow-lg">
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-center">
          {description}
        </p>
      </div>
    </div>
  );
}

// Geometric pattern with Art Estate logo
function LogoPattern() {
  return (
    <div className="absolute top-8 right-8 w-40 h-40 md:w-52 md:h-52">
      {/* Background hexagon lines */}
      <svg className="absolute inset-0 w-full h-full text-muted-foreground/10" viewBox="0 0 200 200" fill="none">
        <path d="M100 10L170 50V130L100 170L30 130V50L100 10Z" stroke="currentColor" strokeWidth="1" />
        <path d="M100 30L150 60V120L100 150L50 120V60L100 30Z" stroke="currentColor" strokeWidth="1" />
        <line x1="100" y1="10" x2="100" y2="30" stroke="currentColor" strokeWidth="1" />
        <line x1="170" y1="50" x2="150" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="170" y1="130" x2="150" y2="120" stroke="currentColor" strokeWidth="1" />
        <line x1="100" y1="170" x2="100" y2="150" stroke="currentColor" strokeWidth="1" />
        <line x1="30" y1="130" x2="50" y2="120" stroke="currentColor" strokeWidth="1" />
        <line x1="30" y1="50" x2="50" y2="60" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function RealEstateAsArtSection() {
  const { currentCity } = useCity();
  const { data: sectionContent } = useHomepageContent("real_estate_art", currentCity?.id);
  
  const title = sectionContent?.content?.title || "Недвижимость как искусство";
  const services: ServiceCard[] = sectionContent?.content?.services?.length 
    ? sectionContent.content.services 
    : defaultServices;

  return (
    <section className="py-16 lg:py-24 bg-[#F5F5F7] relative overflow-hidden">
      {/* Geometric pattern */}
      <LogoPattern />
      
      <div className="container-wide">
        {/* Mobile title */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-0.5 bg-[#1CBCB4]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            {title}
          </h2>
        </div>
        
        <div className="flex">
          {/* Vertical text on the left - desktop only */}
          <div className="hidden lg:flex items-start pr-12 flex-shrink-0">
            <div className="flex flex-col items-center sticky top-32">
              {/* Teal accent line */}
              <div className="w-0.5 h-20 bg-[#1CBCB4] mb-8" />
              {/* Single vertical text block */}
              <div 
                className="font-serif text-foreground tracking-tight leading-none" 
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)"
                }}
              >
                <span className="text-5xl xl:text-6xl 2xl:text-7xl font-normal">{title.charAt(0)}</span>
                <span className="text-4xl xl:text-5xl 2xl:text-6xl font-light">{title.slice(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Content grid */}
          <div className="flex-1 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1 */}
              <FlipCard 
                title={services[0]?.title || ""} 
                description={services[0]?.description || ""} 
                image={services[0]?.image || defaultServices[0].image} 
                className="h-72 md:h-80" 
              />
              <FlipCard 
                title={services[1]?.title || ""} 
                description={services[1]?.description || ""} 
                image={services[1]?.image || defaultServices[1].image} 
                className="h-72 md:h-80" 
              />
              
              {/* Row 2 */}
              <div className="flex flex-col gap-4">
                <Link to="/uslugi">
                  <TealButton variant="outline" size="lg" className="w-full">
                    Узнать больше
                  </TealButton>
                </Link>
                <FlipCard 
                  title={services[2]?.title || ""} 
                  description={services[2]?.description || ""} 
                  image={services[2]?.image || defaultServices[2].image} 
                  className="h-48 md:h-56 flex-1" 
                />
              </div>
              <FlipCard 
                title={services[3]?.title || ""} 
                description={services[3]?.description || ""} 
                image={services[3]?.image || defaultServices[3].image} 
                className="h-64 md:h-72" 
              />
              
              {/* Row 3 - Additional cards */}
              <FlipCard 
                title={services[4]?.title || defaultServices[4].title} 
                description={services[4]?.description || defaultServices[4].description} 
                image={services[4]?.image || defaultServices[4].image} 
                className="h-72 md:h-80" 
              />
              <FlipCard 
                title={services[5]?.title || defaultServices[5].title} 
                description={services[5]?.description || defaultServices[5].description} 
                image={services[5]?.image || defaultServices[5].image} 
                className="h-72 md:h-80" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
