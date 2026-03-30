import { Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentStats } from "@/hooks/useApartments";
import { toast } from "sonner";
import { ComplexPresentationButton } from "./ComplexPresentationButton";

interface ComplexHeroProps {
  complex: ResidentialComplex;
}

export function ComplexHero({ complex }: ComplexHeroProps) {
  const { data: apartmentStats } = useApartmentStats(complex.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ЖК «${complex.name}»`,
          text: complex.description || "",
          url,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "ready":
      case "completed":
        return "СДАН";
      case "building":
        return "СТРОИТСЯ";
      case "soon":
        return "СКОРО";
      default:
        return "В ПРОДАЖЕ";
    }
  };

  const shortDescription = complex.description
    ? complex.description.length > 200
      ? complex.description.substring(0, 200) + "..."
      : complex.description
    : "";

  return (
    <section className="relative min-h-[100vh] flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${complex.main_image || "/placeholder.svg"})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a3a]/90 via-[#1a2a3a]/40 to-[#1a2a3a]/20" />

      {/* Top bar */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 lg:px-12 pt-6 flex items-center justify-between">
        <Link
          to="/novostroyki"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[12px] uppercase tracking-[0.15em]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад в каталог
        </Link>
        <button
          onClick={handleShare}
          className="text-white/50 hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main content — pushed to bottom */}
      <div className="relative z-10 mt-auto w-full max-w-[1800px] mx-auto px-6 lg:px-12 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left */}
          <div className="lg:col-span-7 text-white">
            {/* Status */}
            <span className="inline-block px-5 py-2 border border-white/30 text-[11px] uppercase tracking-[0.2em] text-white/80 mb-8">
              {getStatusLabel(complex.status)}
            </span>

            {/* Label */}
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-3 font-medium">
              ЖИЛОЙ КОМПЛЕКС
            </p>

            {/* Name */}
            <h1 className="font-display text-[44px] md:text-[56px] lg:text-[72px] xl:text-[84px] font-light leading-[1] tracking-[-0.01em] mb-6">
              {complex.name}
            </h1>

            {/* Description */}
            {shortDescription && (
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-white/60 max-w-[520px] mb-10">
                {shortDescription}
              </p>
            )}

            {/* Download button */}
            <ComplexPresentationButton complex={complex} />
          </div>

          {/* Right — info grid */}
          <div className="lg:col-span-5 text-white">
            <div className="grid grid-cols-[auto_1fr] gap-x-12 gap-y-4">
              <p className="text-[14px] text-white/50">Сдача</p>
              <p className="text-[14px] font-medium text-white">
                {complex.completion_date
                  ? (() => {
                      const d = new Date(complex.completion_date);
                      const q = Math.ceil((d.getMonth() + 1) / 3);
                      const roman = q === 1 ? 'I' : q === 2 ? 'II' : q === 3 ? 'III' : 'IV';
                      return `${roman} квартал ${d.getFullYear()}`;
                    })()
                  : "Уточняйте"}
              </p>
              <p className="text-[14px] text-white/50">Город</p>
              <p className="text-[14px] font-medium text-white">{complex.city || "Санкт-Петербург"}</p>
              <p className="text-[14px] text-white/50">Адрес</p>
              <p className="text-[14px] font-medium text-white">{complex.address || "Уточняйте"}</p>
              {complex.district && (
                <>
                  <p className="text-[14px] text-white/50">Метро</p>
                  <p className="text-[14px] font-medium text-white">{complex.district}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
