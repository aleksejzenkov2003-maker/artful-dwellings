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
        {/* Header with short line (matching reference) */}
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif whitespace-nowrap">Услуги</h2>
          <div className="w-24 h-px bg-foreground" />
        </div>

        {/* Services grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14">
            {items.map((service, index) => (
              <div key={service.id} className="group">
                {/* Number - Large serif italic in teal */}
                <span className="text-primary font-serif italic text-4xl lg:text-5xl mb-4 block leading-none">
                  {String(index + 1).padStart(2, '0')}/
                </span>
                
                {/* Title - uppercase, regular weight, tracking */}
                <h3 className="text-sm font-medium uppercase tracking-[0.15em] mb-4 text-foreground">
                  {service.title}
                </h3>
                
                {/* Description - italic style */}
                <p className="text-muted-foreground italic leading-relaxed text-[15px]">
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
