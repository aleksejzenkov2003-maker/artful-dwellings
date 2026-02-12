import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import awardBadge1 from "@/assets/award-badge-1.png";
import awardBadge2 from "@/assets/award-badge-2.png";

export function AboutCertificates() {
  return (
    <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Section label */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">
            ◆ СЕРТИФИКАТЫ ◆
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif mb-6">
            Сертификаты и награды
          </h2>
          <div className="w-20 h-0.5 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - text */}
          <div>
            <p className="text-white/70 leading-relaxed mb-6 text-lg">
              Art Estate — официальный партнёр ведущих застройщиков Санкт-Петербурга, 
              Москвы и ОАЭ. Мы регулярно подтверждаем свой профессионализм и получаем 
              награды за высокое качество работы.
            </p>
            <p className="text-white/50 leading-relaxed mb-8">
              Наши сертификаты — это подтверждение надёжности и экспертности команды 
              Art Estate. Мы гордимся доверием застройщиков и банков-партнёров.
            </p>
            <Button variant="teal" size="lg" asChild>
              <Link to="/partneram">
                СМОТРЕТЬ ВСЕ
              </Link>
            </Button>
          </div>

          {/* Right - award badges */}
          <div className="flex items-center justify-center gap-8 lg:gap-12">
            <img 
              src={awardBadge1} 
              alt="Сертификат партнёра" 
              className="w-40 h-auto lg:w-52 object-contain"
            />
            <img 
              src={awardBadge2} 
              alt="Награда Art Estate" 
              className="w-40 h-auto lg:w-52 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
