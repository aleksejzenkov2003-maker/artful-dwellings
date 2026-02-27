import partneramHero from "@/assets/partneram-hero.svg";

export function PartneramHero() {
  return (
    <section className="pt-6 pb-0">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <img
          src={partneramHero}
          alt="Зарабатывайте с Art Estate — партнёрская программа"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
