import top3Badge from "@/assets/top3-badge.png";

const highlights = [
  <>Ежемесячно обрабатываем около <strong className="font-semibold">2 500 новых заявок</strong>, проводим десятки сделок в месяц и постоянно растем.</>,
  <>Art Estate входит в <strong className="font-semibold">ТОП-3 ведущих агентств</strong> по продажам элитных и респектабельных клубных домов крупнейших застройщиков.</>,
  <>В Московском портфеле Art Estate <strong className="font-semibold">более 160 объектов Business, Premium и DeLuxe</strong> классов.</>,
  <>Ежемесячно брокеры агентства получают более <strong className="font-semibold">800 новых целевых клиентов</strong>.</>,
  <>Средний <strong className="font-semibold">чек сделок</strong> на уровне <strong className="font-semibold">80 000 000 ₽</strong>.</>,
  <>Благодаря отличной репутации и высоким результатам, Art Estate включено в список партнеров на закрытых продажах.</>,
];

export function PartneramHighlights() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
        <div className="relative border border-border p-8 lg:p-12 xl:p-16 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            {/* Bullet list */}
            <ul className="space-y-3 text-sm lg:text-base text-foreground/90 leading-relaxed">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[7px] min-w-[8px] min-h-[8px] w-2 h-2 rotate-45 bg-[#BA846E] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* TOP 3 badge */}
            <div className="hidden lg:flex items-center justify-center">
              <img
                src={top3Badge}
                alt="ТОП 3 ведущих агентств"
                className="w-36 xl:w-44 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
