import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

const ResidentialComplex = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: complex, isLoading, error } = useResidentialComplex(slug || "");
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/tilda/files/page76983836body.html", { cache: "force-cache" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Template load failed (${r.status})`);
        const text = await r.text();
        if (!cancelled) setTemplateHtml(text);
      })
      .catch((e) => {
        if (!cancelled) setTemplateError(e instanceof Error ? e.message : "Template load failed");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Apply Tilda baseline body styling for full template fidelity.
    const prevClass = document.body.className;
    const prevMargin = document.body.style.margin;

    document.body.classList.add("t-body");
    document.body.style.margin = "0";

    return () => {
      document.body.className = prevClass;
      document.body.style.margin = prevMargin;
    };
  }, []);

  useEffect(() => {
    // Load template CSS (copied from the provided эталон HTML export).
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
    // Load template JS needed for interactions (menu, popup, animation, etc.).
    ensureInlineScript(
      "tilda-inline-helpers",
      [
        "function t_onReady(func){if(document.readyState!='loading'){func();}else{document.addEventListener('DOMContentLoaded',func);}}",
        "function t_onFuncLoad(funcName,okFunc,time){if(typeof window[funcName]==='function'){okFunc();}else{setTimeout(function(){t_onFuncLoad(funcName,okFunc,time);},(time||100));}}",
      ].join("\n"),
    );

    // Keep execution order stable (many Tilda scripts assume dependencies).
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
    if (!templateHtml) return null;

    let html = templateHtml;

    // Make asset paths absolute inside SPA routes.
    html = html
      .replaceAll("images/", "/tilda/images/")
      .replaceAll("data-original='/tilda//tilda/images/", "data-original='/tilda/images/") // safety for accidental double prefix
      .replaceAll("data-original=\"/tilda//tilda/images/", "data-original=\"/tilda/images/");

    // Inject some basic dynamic data (best-effort without rewriting the whole template).
    if (complex?.name) {
      html = html.replaceAll("ЖК «МИРъ»", complex.name);
    }
    if (complex?.address) {
      html = html.replaceAll("Миргородская ул., 1", complex.address);
    }

    return html;
  }, [templateHtml, complex?.name, complex?.address]);

  if (isLoading) {
    return (
      <section className="min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-48" />
        </div>
      </section>
    );
  }

  if (error || !complex) {
    return (
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
    );
  }

  if (templateError) {
    return (
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
    );
  }

  if (!processedHtml) {
    return (
      <section className="min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-48" />
        </div>
      </section>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
};

export default ResidentialComplex;
