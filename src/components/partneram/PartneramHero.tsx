import { Link } from "react-router-dom";
import { TealButton } from "@/components/ui/teal-button";
import partneramHero from "@/assets/partneram-hero.svg";

export function PartneramHero() {
  return (
    <section className="pt-6 pb-0">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs uppercase tracking-[0.15em]">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Главная
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-[#BA846E] font-medium">Партнерам</span>
        </div>

        <div className="relative">
          <img
            src={partneramHero}
            alt="Зарабатывайте с Art Estate — партнёрская программа"
            className="w-full h-auto"
          />
          {/* Button overlaid on the SVG, bottom-left */}
          <div className="absolute bottom-[8%] left-0">
            <a href="#partner-form">
              <TealButton size="lg">СТАТЬ ПАРТНЁРОМ</TealButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
