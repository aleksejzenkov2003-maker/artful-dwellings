import { Link } from "react-router-dom";
import award1 from "@/assets/award-1.png";
import award2 from "@/assets/award-2.png";
import award3 from "@/assets/award-3.png";
import award4 from "@/assets/award-4.png";

export function AboutCertificates() {
  return (
    <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Label + Link row */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            ◆ СЕРТИФИКАТЫ
          </p>
          <Link
            to="/partneram"
            className="text-accent text-sm uppercase tracking-wider hover:underline"
          >
            СМОТРЕТЬ ВСЕ +
          </Link>
        </div>

        {/* Main title */}
        <h2 className="text-2xl md:text-3xl lg:text-[38px] font-serif leading-tight mb-16">
          Являемся <span className="text-accent">официальным партнером</span> ведущих застройщиков
          и банков, что подтверждается <span className="text-accent">наградами и сертификатами</span>
        </h2>

        {/* Award images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-end">
          <div className="flex items-end justify-center">
            <img src={award1} alt="1 место" className="max-h-[450px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer" />
          </div>
          <div className="flex items-end justify-center">
            <img src={award2} alt="Legenda Best Agency" className="max-h-[450px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer" />
          </div>
          <div className="flex items-end justify-center">
            <img src={award3} alt="Renaissance Development" className="max-h-[450px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer" />
          </div>
          <div className="flex items-end justify-center">
            <img src={award4} alt="RBI партнер года" className="max-h-[450px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer" />
          </div>
        </div>
      </div>
    </section>
  );
}
