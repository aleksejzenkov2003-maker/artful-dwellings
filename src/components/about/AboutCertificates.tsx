import { Link } from "react-router-dom";
import awardBadge1 from "@/assets/award-badge-1.png";
import awardBadge2 from "@/assets/award-badge-2.png";

export function AboutCertificates() {
  return (
    <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Label */}
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-8">
          ◆ СЕРТИФИКАТЫ
        </p>

        {/* Main title with gold highlights */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight mb-16 max-w-4xl">
          Являемся <span className="text-accent">официальным партнером</span> ведущих застройщиков
          и банков, что подтверждается <span className="text-accent">наградами и сертификатами</span>
        </h2>

        {/* Award images row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-12">
          <div className="aspect-square flex items-center justify-center">
            <img
              src={awardBadge1}
              alt="Награда 1"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="aspect-square flex items-center justify-center">
            <img
              src={awardBadge2}
              alt="Награда 2"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="aspect-square flex items-center justify-center">
            <img
              src={awardBadge1}
              alt="Награда 3"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="aspect-square flex items-center justify-center">
            <img
              src={awardBadge2}
              alt="Награда 4"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Link */}
        <Link
          to="/partneram"
          className="text-primary text-sm uppercase tracking-wider hover:underline"
        >
          СМОТРЕТЬ ВСЕ +
        </Link>
      </div>
    </section>
  );
}
