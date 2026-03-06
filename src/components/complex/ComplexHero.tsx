import { Link } from "react-router-dom";
import { ArrowLeft, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="relative min-h-screen flex items-end">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${complex.main_image || "/placeholder.svg"})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a3a]/95 via-[#1a2a3a]/50 to-[#1a2a3a]/30" />

      {/* Back link */}
      <div className="absolute top-6 left-4 lg:left-8 z-20">
        <Link
          to="/novostroyki"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[12px] uppercase tracking-[0.15em]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад в каталог
        </Link>
      </div>

      {/* Share */}
      <div className="absolute top-6 right-4 lg:right-8 z-20">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            {/* Left */}
            <div className="lg:col-span-7 text-white">
              {/* Status */}
              <span className="inline-block px-4 py-1.5 border border-white/30 text-[11px] uppercase tracking-[0.2em] text-white/80 mb-6">
                {getStatusLabel(complex.status)}
              </span>

              {/* Label */}
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">
                ЖИЛОЙ КОМПЛЕКС
              </p>

              {/* Name */}
              <h1 className="font-serif text-[48px] md:text-[64px] lg:text-[80px] font-normal leading-[0.95] tracking-[-0.02em] mb-6">
                {complex.name}
              </h1>

              {/* Description */}
              {shortDescription && (
                <p className="text-[14px] md:text-[15px] leading-relaxed text-white/70 max-w-lg mb-8">
                  {shortDescription}
                </p>
              )}

              {/* Download button */}
              <ComplexPresentationButton complex={complex} />
            </div>

            {/* Right — info grid */}
            <div className="lg:col-span-5 text-white">
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {/* Сдача */}
                <div className="bg-[#1a2a3a]/80 backdrop-blur-sm p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2">Сдача</p>
                  <p className="text-[15px] font-medium">
                    {complex.completion_date
                      ? new Date(complex.completion_date).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          quarter: undefined,
                          month: "long",
                        })
                      : "Уточняйте"}
                  </p>
                </div>
                {/* Город */}
                <div className="bg-[#1a2a3a]/80 backdrop-blur-sm p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2">Город</p>
                  <p className="text-[15px] font-medium">{complex.city || "Санкт-Петербург"}</p>
                </div>
                {/* Адрес */}
                <div className="bg-[#1a2a3a]/80 backdrop-blur-sm p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2">Адрес</p>
                  <p className="text-[15px] font-medium">{complex.address || "Уточняйте"}</p>
                </div>
                {/* Район */}
                <div className="bg-[#1a2a3a]/80 backdrop-blur-sm p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2">Район</p>
                  <p className="text-[15px] font-medium">{complex.district || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
