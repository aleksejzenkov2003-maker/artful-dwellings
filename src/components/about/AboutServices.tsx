import { useServices } from "@/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutServices() {
  const { data: services, isLoading } = useServices();

  // Use first 8 services or fallback data
  const displayServices = services?.slice(0, 8) || [];

  const fallbackServices = [
    { id: "1", title: "Подбор недвижимости", short_description: "Персональный подбор квартир и апартаментов под ваши требования" },
    { id: "2", title: "Ипотечный брокеридж", short_description: "Помощь в получении ипотеки на лучших условиях" },
    { id: "3", title: "Юридическое сопровождение", short_description: "Полное юридическое сопровождение сделки" },
    { id: "4", title: "Trade-in недвижимости", short_description: "Обмен старой квартиры на новую с доплатой" },
    { id: "5", title: "Инвестиционный консалтинг", short_description: "Консультации по инвестициям в недвижимость" },
    { id: "6", title: "Продажа недвижимости", short_description: "Продажа вашей недвижимости по лучшей цене" },
    { id: "7", title: "Зарубежная недвижимость", short_description: "Подбор и покупка недвижимости в ОАЭ" },
    { id: "8", title: "Военная ипотека", short_description: "Помощь военнослужащим в приобретении жилья" },
  ];

  const items = displayServices.length > 0 ? displayServices : fallbackServices;

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header with line */}
        <div className="flex items-center gap-8 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif whitespace-nowrap">Услуги</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Services grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {items.map((service, index) => (
              <div key={service.id} className="group">
                {/* Number */}
                <span className="text-primary font-medium text-lg mb-3 block">
                  {String(index + 1).padStart(2, '0')}/
                </span>
                
                {/* Title */}
                <h3 className="text-lg font-semibold uppercase tracking-wide mb-3">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground italic leading-relaxed">
                  {'short_description' in service ? service.short_description : (service as any).description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
