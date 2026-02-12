import { useServices } from "@/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Home, BarChart3, Gift, Building2, MapPin, Percent, Receipt } from "lucide-react";

const fallbackServices = [
  { id: "1", title: "Подбор недвижимости", short_description: "Подбор недвижимости из всех жилых комплексов на рынке, в одном месте. Без комиссии.", icon_name: "Home" },
  { id: "2", title: "Расчет инвестиционной привлекательности", short_description: "По каждому из проектов. Профессионально, на высоком уровне", icon_name: "BarChart3" },
  { id: "3", title: "Спецпредложения и акции в одном месте", short_description: "Скидки, подарки для клиентов, розыгрыши призов и другое", icon_name: "Gift" },
  { id: "4", title: "Объективная информация по каждому из застройщиков", short_description: "Опыт компании, построенные дома, точность в исполнении обязательств, возможные риски", icon_name: "Building2" },
  { id: "5", title: "Организация экскурсии", short_description: "Организация экскурсии по готовым и строящимся жилым комплексам", icon_name: "MapPin" },
  { id: "6", title: "Одобрение ипотеки – от 1 часа", short_description: "Благодаря нашему сотрудничеству с банками и ипотечными брокерами", icon_name: "Percent" },
  { id: "7", title: "Расчет вариантов платежей", short_description: "Рассрочка, ипотека, зачет и др.", icon_name: "Receipt" },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  Home, BarChart3, Gift, Building2, MapPin, Percent, Receipt,
};

export function AboutServices() {
  const { data: services, isLoading } = useServices();
  const displayServices = services?.slice(0, 7) || [];
  const items = displayServices.length > 0 ? displayServices : fallbackServices;

  return (
    <section className="py-16 lg:py-24 bg-accent">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <h2 className="text-4xl lg:text-5xl font-serif text-white mb-12">Услуги</h2>

        {/* 4-column grid of white cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-48 bg-white/20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((service, index) => {
              const fb = fallbackServices[index];
              const IconComp = fb ? iconMap[fb.icon_name] : null;
              
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg p-6 flex flex-col justify-between min-h-[200px]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-foreground font-medium text-sm leading-tight max-w-[70%]">
                        {service.title}
                      </h3>
                      {IconComp && (
                        <IconComp className="w-6 h-6 text-accent flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                    {'short_description' in service ? service.short_description : ''}
                  </p>
                </div>
              );
            })}

            {/* Last card - CTA */}
            <div className="bg-accent/80 rounded-lg p-6 flex flex-col justify-between min-h-[200px] text-white">
              <h3 className="font-medium text-lg">Заинтересовали?</h3>
              <div className="flex items-end justify-between mt-auto">
                <p className="text-white/70 text-xs leading-relaxed max-w-[70%]">
                  Оставьте заявку, мы с вами свяжемся и расскажем подробнее
                </p>
                <button className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
