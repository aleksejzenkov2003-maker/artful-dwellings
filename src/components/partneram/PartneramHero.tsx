import { Link } from "react-router-dom";
import { TealButton } from "@/components/ui/teal-button";
import foundersDuo from "@/assets/founders-duo.png";
import labelKonstantin from "@/assets/label-konstantin.png";
import labelSergey from "@/assets/label-sergey.png";

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
        <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-8 lg:gap-12 items-end">
          {/* Left column */}
          <div>
            <h1 className="font-serif text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] leading-[1] tracking-[-0.02em] uppercase mb-6">
              Зарабатывайте с Art Estate
            </h1>

            <p className="text-base md:text-lg italic text-muted-foreground mb-6">
              Приведите клиента и получите до 30% комиссии
            </p>

            <div className="space-y-4 text-[14px] lg:text-[15px] leading-[1.7] text-muted-foreground mb-8">
              <p>
                Art Estate входит в{" "}
                <strong className="text-foreground">ТОП-3 ведущих агентств</strong> по продажам
                элитных и респектабельных клубных домов крупнейших застройщиков.
              </p>
              <p>
                Благодаря отличной репутации и высоким результатам, Art Estate включено
                в список партнеров на <strong className="text-foreground">закрытых продажах</strong>.
                В Московском портфеле Art Estate — <strong className="text-foreground">более 160 объектов</strong>{" "}
                Business, Premium и DeLuxe классов.
              </p>
              <p>
                Ежемесячно брокеры агентства получают более{" "}
                <strong className="text-foreground">800 новых целевых клиентов</strong>.
                Средний чек сделок на уровне{" "}
                <strong className="text-foreground">80 000 000 ₽</strong>.
              </p>
            </div>

            <a href="#partner-form">
              <TealButton size="lg">СТАТЬ ПАРТНЁРОМ</TealButton>
            </a>
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
              <img src={labelKonstantin} alt="Константин Назаров — Основатель Art Estate" className="flex-1 w-1/2 object-contain object-bottom" />
              <img src={labelSergey} alt="Сергей Чурганов — Основатель Art Estate" className="flex-1 w-1/2 object-contain object-bottom" />
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
