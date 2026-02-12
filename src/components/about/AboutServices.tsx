import { useServices } from "@/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutServices() {
  const { data: services, isLoading } = useServices();

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
    <section className="py-16 lg:py-24 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif whitespace-nowrap text-white">Услуги</h2>
          <div className="w-24 h-px bg-white/40" />
        </div>

        {/* Services grid - 2 columns, 4 rows */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-10 w-16 bg-white/20" />
                <Skeleton className="h-6 w-48 bg-white/20" />
                <Skeleton className="h-20 w-full bg-white/20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
            {items.map((service, index) => (
              <div key={service.id} className="group">
                {/* Number */}
                <span className="text-white font-serif italic text-4xl lg:text-5xl mb-4 block leading-none">
                  {String(index + 1).padStart(2, '0')}/
                </span>
                
                {/* Title */}
                <h3 className="text-sm font-medium uppercase tracking-[0.15em] mb-4 text-white">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-white/70 italic leading-relaxed text-[15px]">
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
