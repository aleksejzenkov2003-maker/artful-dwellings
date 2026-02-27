import logoIcon from "@/assets/logo-icon-light.png";

const text = "Мы продаем недвижимость от лучших застройщиков Санкт-Петербурга, Москвы и Дубая";

export function PartneramMarquee() {
  const items = Array.from({ length: 8 });

  return (
    <section className="bg-[#BA846E] py-3 overflow-hidden">
      <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {items.map((_, i) => (
          <span key={i} className="flex items-center gap-4 mx-6 text-white text-sm tracking-wide shrink-0">
            <span>{text}</span>
            <img src={logoIcon} alt="" className="w-5 h-5 opacity-80" />
          </span>
        ))}
      </div>
    </section>
  );
}
