import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { icons } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import type { LucideProps } from "lucide-react";

function LucideIcon({ name, ...props }: { name: string } & LucideProps) {
  const IconComponent = icons[name as keyof typeof icons];
  if (!IconComponent || typeof IconComponent !== "function") {
    return null;
  }
  return <IconComponent {...props} />;
}

export function AboutServices() {
  const { data: services } = useServices();

  const publishedServices = (services || []).filter((s) => s.is_published);
  const featured = publishedServices.filter((s) => s.is_featured);
  const regular = publishedServices.filter((s) => !s.is_featured);

  const renderCard = (service: typeof publishedServices[number], isFeatured: boolean) => (
    <Link
      key={service.id}
      to={`/uslugi/${service.slug}`}
      className={`p-6 flex flex-col justify-between min-h-[200px] xl:min-h-[240px] transition-shadow duration-300 hover:shadow-lg cursor-pointer ${
        isFeatured
          ? "bg-[#BA846E] text-white"
          : "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-bold text-[18px] leading-snug max-w-[70%] ${
          isFeatured ? "text-white" : "text-foreground"
        }`}>
          {service.title}
        </h3>
        {service.icon && (
          <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${
            isFeatured ? "text-white" : "text-[#BA846E]"
          }`}>
            <LucideIcon name={service.icon} className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <p className={`text-[13px] leading-relaxed ${
          isFeatured ? "text-white/80" : "text-muted-foreground"
        }`}>
          {service.short_description || service.description}
        </p>
      </div>
    </Link>
  );

  return (
    <section className="py-16 lg:py-16 xl:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-[36px] leading-[48px] font-montserrat font-medium text-foreground mb-12">
          Услуги
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((s) => renderCard(s, true))}
          {regular.map((s) => renderCard(s, false))}

          {/* CTA card */}
          <div
            className="p-6 flex flex-col justify-between min-h-[200px] xl:min-h-[240px] text-white"
            style={{ backgroundColor: "#BA846E" }}
          >
            <h3 className="font-aeroport font-normal text-[24px] leading-[26px]">
              Заинтересовали?
            </h3>
            <div className="flex items-end justify-between gap-3 mt-auto">
              <p className="text-white/80 text-[13px] leading-relaxed max-w-[75%]">
                Оставьте заявку, мы с&nbsp;вами свяжемся и&nbsp;расскажем
                подробнее
              </p>
              <button className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
