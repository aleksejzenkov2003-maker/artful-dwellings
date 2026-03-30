import statsImage from "@/assets/partneram-stats.svg";

export function PartneramStats() {
  return (
    <section className="py-16 lg:py-16 xl:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <img
          src={statsImage}
          alt="Статистика партнёрской программы"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
