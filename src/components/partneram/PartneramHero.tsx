import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import consultationHouse from "@/assets/consultation-house.png";

export function PartneramHero() {
  return (
    <section className="pt-6 pb-0">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 group"
        >
          <span className="w-10 h-10 rounded-sm bg-[#BA846E] flex items-center justify-center group-hover:bg-[#a0725d] transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
            ГЛАВНАЯ
          </span>
        </Link>

        {/* Label */}
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          ПАРТНЕРАМ
        </p>

        {/* Title + Building in one row */}
        <div className="relative">
          <h1 className="font-serif text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] leading-[1] tracking-[-0.02em]">
            Партнёрам
          </h1>

          {/* Building image - positioned absolutely on the right */}
          <div className="hidden lg:block absolute right-0 bottom-0 translate-y-[30%]">
            <img
              src={consultationHouse}
              alt="Жилой комплекс"
              className="h-[360px] xl:h-[440px] object-contain"
            />
          </div>
        </div>

        {/* Copper banner - overlaps title bottom */}
        <div className="relative z-10 mt-4 lg:mt-6">
          <div className="bg-[#BA846E] p-8 lg:p-10 xl:p-12 max-w-[650px]">
            <h2 className="font-serif text-white text-[1.5rem] lg:text-[1.75rem] xl:text-[2rem] leading-tight mb-3">
              Зарабатывайте с Art Estate
            </h2>
            <p className="text-white font-bold text-[15px] lg:text-base mb-2">
              Приведите клиента и получите до 30% комиссии!
            </p>
            <p className="text-white/80 text-[14px] lg:text-[15px] leading-relaxed">
              Мы продаем недвижимость от лучших застройщиков<br className="hidden md:inline" />{" "}
              Санкт-Петербурга, Москвы и Дубая.
            </p>
          </div>
        </div>

        {/* Vertical line divider */}
        <div className="flex justify-center mt-12 mb-4">
          <div className="w-px h-16 bg-border" />
        </div>
      </div>
    </section>
  );
}
