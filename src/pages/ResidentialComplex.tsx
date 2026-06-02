import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { tildaTemplatePromise } from "@/main";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentsByComplex } from "@/hooks/useApartments";
import { useComplexBuildings } from "@/hooks/useComplexBuildings";
import { useComplexSlides } from "@/hooks/useComplexSlides";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { applyPageContentToTildaHtml } from "@/lib/applyPageContentToTildaHtml";
import { loadComplexPreviewDraft } from "@/lib/complexPreviewStorage";
import { Layout } from "@/components/layout/Layout";
import { usePermissions } from "@/hooks/usePermissions";
import type { ComplexSlide } from "@/hooks/useComplexSlides";

function ensureHeadLink(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function ensureHeadScript(id: string, src: string, opts?: { defer?: boolean; async?: boolean }) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  if (opts?.defer) script.defer = true;
  if (opts?.async) script.async = true;
  document.head.appendChild(script);
}

function ensureInlineScript(id: string, code: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.textContent = code;
  document.head.appendChild(script);
}

export default function ResidentialComplex() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { isContent } = usePermissions();
  const isPreview = searchParams.get("preview") === "1" && isContent;
  const isDraft = searchParams.get("draft") === "1" && isPreview;
  const isEmbed = searchParams.get("embed") === "1";

  const { data: fetchedComplex, isLoading, error } = useResidentialComplex(slug || "", { preview: isPreview });
  const [draftComplex, setDraftComplex] = useState<ResidentialComplex | null>(null);
  const [draftSlides, setDraftSlides] = useState<ComplexSlide[] | null>(null);

  const complex = draftComplex ?? fetchedComplex;

  useEffect(() => {
    if (!isDraft || !fetchedComplex?.id) {
      setDraftComplex(null);
      setDraftSlides(null);
      return;
    }
    const draft = loadComplexPreviewDraft(fetchedComplex.id);
    if (!draft?.complex) return;
    setDraftComplex({ ...fetchedComplex, ...draft.complex } as ResidentialComplex);
    if (draft.slides) {
      setDraftSlides(draft.slides as ComplexSlide[]);
    }
  }, [isDraft, fetchedComplex]);

  const { data: apartments = [] } = useApartmentsByComplex(complex?.id);
  const { data: buildings = [] } = useComplexBuildings(complex?.id);
  const { data: dbSlides = [] } = useComplexSlides(complex?.id);
  const slides = draftSlides ?? dbSlides;

  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    tildaTemplatePromise.then((text) => {
      if (!cancelled) {
        if (text) setTemplateHtml(text);
        else setTemplateError("Template load failed");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!complex) return;
    const title = complex.seo_title || complex.name;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = complex.seo_description || complex.description?.replace(/<[^>]+>/g, "").slice(0, 160) || "";
  }, [complex]);

  useEffect(() => {
    ensureHeadLink("tilda-grid", "/tilda/css/tilda-grid-3.0.min.css");
    ensureHeadLink("tilda-page", "/tilda/css/tilda-blocks-page76983836.min.css");
    ensureHeadLink("tilda-animation", "/tilda/css/tilda-animation-2.0.min.css");
    ensureHeadLink("tilda-menu-widgeticons", "/tilda/css/tilda-menu-widgeticons-1.0.min.css");
    ensureHeadLink("tilda-popup", "/tilda/css/tilda-popup-1.1.min.css");
    ensureHeadLink("tilda-forms", "/tilda/css/tilda-forms-1.0.min.css");
    ensureHeadLink("tilda-slds", "/tilda/css/tilda-slds-1.4.min.css");
    ensureHeadLink("tilda-catalog", "/tilda/css/tilda-catalog-1.1.min.css");
    ensureHeadLink("tilda-catalog-filters", "/tilda/css/tilda-catalog-filters-1.0.min.css");
    ensureHeadLink("tilda-cards", "/tilda/css/tilda-cards-1.0.min.css");
    ensureHeadLink("tilda-zoom", "/tilda/css/tilda-zoom-2.0.min.css");

    if (!document.getElementById("tilda-fonts-montserrat")) {
      const l = document.createElement("link");
      l.id = "tilda-fonts-montserrat";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&subset=latin,cyrillic";
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    ensureInlineScript(
      "tilda-inline-helpers",
      [
        "function t_onReady(func){if(document.readyState!='loading'){func();}else{document.addEventListener('DOMContentLoaded',func);}}",
        "function t_onFuncLoad(funcName,okFunc,time){if(typeof window[funcName]==='function'){okFunc();}else{setTimeout(function(){t_onFuncLoad(funcName,okFunc,time);},(time||100));}}",
      ].join("\n"),
    );

    ensureHeadScript("tilda-jquery", "/tilda/js/jquery-1.10.2.min.js", { defer: true });
    ensureHeadScript("tilda-scripts", "/tilda/js/tilda-scripts-3.0.min.js", { defer: true });
    ensureHeadScript("tilda-page-js", "/tilda/js/tilda-blocks-page76983836.min.js", { defer: true });
    ensureHeadScript("tilda-lazyload", "/tilda/js/lazyload-1.3.min.export.js", { defer: true });
    ensureHeadScript("tilda-animation-js", "/tilda/js/tilda-animation-2.0.min.js", { defer: true });
    ensureHeadScript("tilda-menu", "/tilda/js/tilda-menu-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-menu-widgeticons-js", "/tilda/js/tilda-menu-widgeticons-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-zero", "/tilda/js/tilda-zero-1.1.min.js", { defer: true });
    ensureHeadScript("tilda-popup-js", "/tilda/js/tilda-popup-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-video", "/tilda/js/tilda-video-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-forms-js", "/tilda/js/tilda-forms-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-hammer", "/tilda/js/hammer.min.js", { defer: true });
    ensureHeadScript("tilda-slds-js", "/tilda/js/tilda-slds-1.4.min.js", { defer: true });
    ensureHeadScript("tilda-products", "/tilda/js/tilda-products-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-catalog-js", "/tilda/js/tilda-catalog-1.1.min.js", { defer: true });
    ensureHeadScript("tilda-cards-js", "/tilda/js/tilda-cards-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-video-processor", "/tilda/js/tilda-video-processor-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-zero-forms", "/tilda/js/tilda-zero-forms-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-animation-sbs", "/tilda/js/tilda-animation-sbs-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-zoom-js", "/tilda/js/tilda-zoom-2.0.min.js", { defer: true });
    ensureHeadScript("tilda-zero-scale", "/tilda/js/tilda-zero-scale-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-skiplink", "/tilda/js/tilda-skiplink-1.0.min.js", { defer: true });
    ensureHeadScript("tilda-events", "/tilda/js/tilda-events-1.0.min.js", { defer: true });
  }, []);

  const processedHtml = useMemo(() => {
    if (!templateHtml || !complex) return null;
    return applyPageContentToTildaHtml({
      templateHtml,
      complex: {
        name: complex.name,
        address: complex.address,
        completion_date: complex.completion_date,
        apartments_count: complex.apartments_count,
        area_from: complex.area_from,
        area_to: complex.area_to,
        page_content: (complex as unknown as { page_content: unknown }).page_content,
      },
      apartments,
      buildings,
      slides,
    });
  }, [templateHtml, complex, apartments, buildings, slides]);

  const pageBody = (
    <>
      {isPreview && !isEmbed && (
        <div className="sticky top-0 z-50 bg-amber-500 text-black text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          {isDraft ? "Предпросмотр черновика (несохранённые изменения)" : "Режим предпросмотра"}
        </div>
      )}
      {isLoading ? (
        <section className="min-h-[600px] flex items-center justify-center">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-48" />
          </div>
        </section>
      ) : error || !complex ? (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">ЖК не найден</h1>
            <p className="text-muted-foreground mb-8">
              К сожалению, запрашиваемый жилой комплекс не существует или был удалён
            </p>
            <Button asChild>
              <Link to="/novostroyki">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к каталогу
              </Link>
            </Button>
          </div>
        </section>
      ) : templateError ? (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Шаблон страницы не загрузился</h1>
            <p className="text-muted-foreground mb-8">{templateError}</p>
            <Button asChild>
              <Link to="/novostroyki">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к каталогу
              </Link>
            </Button>
          </div>
        </section>
      ) : !processedHtml ? (
        <section className="min-h-[600px] flex items-center justify-center">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-48" />
          </div>
        </section>
      ) : (
        <div
          className={`t-body w-full max-w-full ${isEmbed ? "" : "-mt-28 lg:-mt-28"}`}
          style={{ margin: 0, overflowX: "clip" }}
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      )}
    </>
  );

  if (isEmbed) {
    return <div className="min-h-screen bg-white">{pageBody}</div>;
  }

  return <Layout>{pageBody}</Layout>;
}
