import { Link } from "react-router-dom";
import { TealButton } from "@/components/ui/teal-button";
import foundersDuo from "@/assets/founders-duo.png";

export function PartneramHero() {
  return (
    <section className="pt-6 pb-0">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs uppercase tracking-[0.15em]">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Главная
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-[#BA846E] font-medium">Партнерам</span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-start">
          {/* Left column */}
          <div className="space-y-6">
            <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.05] tracking-[-0.01em] uppercase">
              Зарабатывайте<br />с Art Estate
            </h1>

            <p className="text-lg lg:text-xl italic text-muted-foreground">
              Приведите клиента и получите до 30% комиссии!
            </p>

            <div className="space-y-3 text-[15px] lg:text-base leading-relaxed text-muted-foreground">
              <p>
                Мы продаем недвижимость от лучших застройщиков Санкт-Петербурга, Москвы и Дубая.
                Art Estate входит в <strong className="text-foreground">ТОП-3 ведущих агентств</strong> по продажам
                элитных и респектабельных клубных домов крупнейших застройщиков.
              </p>
              <p>
                Благодаря отличной репутации и высоким результатам, Art Estate включено
                в список партнеров на <strong className="text-foreground">закрытых продажах</strong>.
                В Московском портфеле Art Estate — <strong className="text-foreground">более 160 объектов</strong> Business,
                Premium и DeLuxe классов.
              </p>
              <p>
                Ежемесячно брокеры агентства получают более{" "}
                <strong className="text-foreground">800 новых целевых клиентов</strong>.
                Средний чек сделок на уровне{" "}
                <strong className="text-foreground">80 000 000 ₽</strong>.
              </p>
            </div>

            <div className="pt-2">
              <a href="#partner-form">
                <TealButton size="lg">СТАТЬ ПАРТНЁРОМ</TealButton>
              </a>
            </div>
          </div>

          {/* Right column — founders photo */}
          <div className="relative">
            <img
              src={foundersDuo}
              alt="Основатели Art Estate"
              className="w-full h-auto object-cover"
            />
            {/* Name labels */}
            <div className="absolute bottom-0 left-0 right-0 flex">
              <div className="flex-1 bg-foreground/70 backdrop-blur-sm px-4 py-3">
                <p className="text-white text-xs lg:text-sm font-bold uppercase tracking-wider">
                  Константин Назаров
                </p>
                <p className="text-white/70 text-[11px] lg:text-xs">
                  Основатель Art Estate
                </p>
              </div>
              <div className="flex-1 bg-foreground/70 backdrop-blur-sm px-4 py-3 border-l border-white/10">
                <p className="text-white text-xs lg:text-sm font-bold uppercase tracking-wider">
                  Сергей Чурганов
                </p>
                <p className="text-white/70 text-[11px] lg:text-xs">
                  Основатель Art Estate
                </p>
              </div>
            </div>
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
