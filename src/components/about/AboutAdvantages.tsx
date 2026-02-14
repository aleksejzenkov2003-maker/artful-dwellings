import advantageIcon1 from "@/assets/advantage-icon-1.png";
import advantageIcon2 from "@/assets/advantage-icon-2.png";
import advantageIcon3 from "@/assets/advantage-icon-3.png";

const advantages = [
  {
    title: "Внушительный\nопыт работы",
    description: "В нашей команде более 50 сотрудников с опытом работы на рынке недвижимости с 2005 года",
    icon: advantageIcon1,
  },
  {
    title: "Амбициозность\nкомпании",
    description: "Наша цель – быть лидерами на рынке агентств недвижимости в Санкт-Петербурге, Москве и ОАЭ",
    icon: advantageIcon2,
  },
  {
    title: "Непрерывное\nразвитие",
    description: "Ежемесячно обрабатываем ~600 новых заявок, проводим десятки сделок в месяц и постоянно растем",
    icon: advantageIcon3,
  },
];

export function AboutAdvantages() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <h2 className="text-3xl lg:text-4xl font-serif mb-12">
          Art Estate — это
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="border border-border rounded-2xl p-8 lg:p-10 flex flex-col min-h-[420px]"
            >
              <h3 className="text-xl lg:text-2xl font-serif whitespace-pre-line mb-8 leading-tight">
                {item.title}
              </h3>

              <div className="flex-1 flex items-center justify-center mb-8">
                <img src={item.icon} alt="" className="h-[180px] object-contain" />
              </div>

              <p className="text-foreground text-sm leading-relaxed font-semibold">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
