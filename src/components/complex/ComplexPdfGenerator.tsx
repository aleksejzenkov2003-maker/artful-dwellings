import { useRef, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexPdfGeneratorProps {
  complex: ResidentialComplex;
}

export const ComplexPdfGenerator = ({ complex }: ComplexPdfGeneratorProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return "—";
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "building": return "Строится";
      case "ready": return "Сдан";
      case "soon": return "Скоро старт продаж";
      default: return status || "—";
    }
  };

  const handleDownloadPdf = async () => {
    // If static PDF exists, use it
    if (complex.presentation_url) {
      window.open(complex.presentation_url, "_blank");
      return;
    }

    // Generate PDF dynamically
    if (!contentRef.current) return;

    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      
      const options = {
        margin: 10,
        filename: `ЖК_${complex.name}_${new Date().toLocaleDateString("ru-RU")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().set(options).from(contentRef.current).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const features = Array.isArray(complex.features) ? complex.features : [];
  const infrastructure = Array.isArray(complex.infrastructure) ? complex.infrastructure : [];

  return (
    <>
      <Button
        onClick={handleDownloadPdf}
        variant="outline"
        className="gap-2"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : complex.presentation_url ? (
          <FileText className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Скачать презентацию
      </Button>

      {/* Hidden PDF Content */}
      <div className="absolute left-[-9999px] top-0">
        <div
          ref={contentRef}
          className="w-[210mm] bg-white text-black p-8"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#2a9d8f]">
            <div>
              <h1 className="text-3xl font-bold text-[#2a9d8f]">ART ESTATE</h1>
              <p className="text-sm text-gray-600">Агентство недвижимости</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>art-estate.top</p>
              <p>+7 (812) 123-45-67</p>
            </div>
          </div>

          {/* Complex Name */}
          <h2 className="text-2xl font-bold mb-2">ЖК «{complex.name}»</h2>
          <p className="text-gray-600 mb-6">{complex.address || complex.district}</p>

          {/* Main Image */}
          {complex.main_image && (
            <div className="mb-6">
              <img
                src={complex.main_image}
                alt={complex.name}
                className="w-full h-48 object-cover rounded"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600">Цена от</p>
              <p className="text-xl font-bold text-[#2a9d8f]">{formatPrice(complex.price_from)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600">Площадь</p>
              <p className="text-xl font-bold">
                {complex.area_from && complex.area_to 
                  ? `${complex.area_from} - ${complex.area_to} м²`
                  : complex.area_from 
                    ? `от ${complex.area_from} м²`
                    : "—"
                }
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600">Статус</p>
              <p className="text-xl font-bold">{getStatusLabel(complex.status)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600">Срок сдачи</p>
              <p className="text-xl font-bold">
                {complex.completion_date 
                  ? new Date(complex.completion_date).toLocaleDateString("ru-RU", { year: "numeric", month: "long" })
                  : "—"
                }
              </p>
            </div>
          </div>

          {/* Characteristics */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Характеристики</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {complex.developer && (
                <p><span className="text-gray-600">Застройщик:</span> {complex.developer}</p>
              )}
              {complex.floors_count && (
                <p><span className="text-gray-600">Этажность:</span> {complex.floors_count} этажей</p>
              )}
              {complex.apartments_count && (
                <p><span className="text-gray-600">Квартир:</span> {complex.apartments_count}</p>
              )}
              {complex.district && (
                <p><span className="text-gray-600">Район:</span> {complex.district}</p>
              )}
            </div>
          </div>

          {/* Description */}
          {complex.description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Описание</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{complex.description}</p>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Особенности</h3>
              <ul className="text-sm grid grid-cols-2 gap-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#2a9d8f] rounded-full" />
                    {String(feature)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Infrastructure */}
          {infrastructure.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Инфраструктура</h3>
              <ul className="text-sm grid grid-cols-2 gap-1">
                {infrastructure.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#e76f51] rounded-full" />
                    {String(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
            <p>Презентация сформирована {new Date().toLocaleDateString("ru-RU")}</p>
            <p className="text-[#2a9d8f] font-medium mt-2">Свяжитесь с нами для получения подробной консультации</p>
          </div>
        </div>
      </div>
    </>
  );
};
