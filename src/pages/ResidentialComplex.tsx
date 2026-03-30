import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import type { PageContent } from "@/types/pageContent";

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

function formatQuarter(date: string | null): string {
  if (!date) return "Уточняйте";
  const d = new Date(date);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `${q} квартал ${d.getFullYear()}`;
}

function normalizeTel(tel: string): string {
  return tel.replace(/[^\d+]/g, "");
}

function setHtml(el: Element | null, html: string) {
  if (!el) return;
  (el as HTMLElement).innerHTML = html;
}

function setText(el: Element | null, text: string) {
  if (!el) return;
  (el as HTMLElement).textContent = text;
}

function applyPageContentToTildaHtml(args: {
  templateHtml: string;
  complex: {
    name: string;
    address: string | null;
    completion_date: string | null;
    page_content: unknown;
  };
}): string {
  const { templateHtml, complex } = args;
  const content = (complex.page_content as PageContent) || {};

  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, "text/html");

  // Make asset paths absolute inside SPA routes.
  const fixed = (doc.body.innerHTML || "")
    .replaceAll("images/", "/tilda/images/")
    .replaceAll("href=\"css/", "href=\"/tilda/css/")
    .replaceAll("src=\"js/", "src=\"/tilda/js/");
  doc.body.innerHTML = fixed;

  // HERO: #rec1289837591
  const hero = doc.querySelector("#rec1289837591");
  if (hero) {
    // ЖК name
    setText(hero.querySelector(".tn-atom[field='tn_text_1616952611617']"), complex.name);

    // Hero subtitle (field tn_text_1470209944682)
    if (content.hero_title) {
      setHtml(hero.querySelector(".tn-atom[field='tn_text_1470209944682']"), content.hero_title);
    }

    // Address + metro + сдача (field tn_text_1470210011265)
    const address = complex.address || "Адрес уточняется";
    const metro = content.metro_station || "";
    const completion = formatQuarter(complex.completion_date);
    const addrHtml = [
      address,
      "<br><br><br>",
      metro ? `Метро: «${metro}»` : "Метро: уточняется",
      "<br><br><br>",
      `Сдача: ${completion}`,
    ].join("");
    setHtml(hero.querySelector(".tn-atom[field='tn_text_1470210011265']"), addrHtml);

    // Phone (main-phone)
    const phoneA = hero.querySelector(".main-phone a");
    const phoneText = (content.phone || phoneA?.textContent || "").trim();
    if (phoneA && phoneText) {
      phoneA.setAttribute("href", `tel:${normalizeTel(phoneText)}`);
      phoneA.textContent = phoneText;
    }

    // Work hours
    if (content.work_hours) {
      setHtml(hero.querySelector(".tn-atom[field='tn_text_1616952736902']"), content.work_hours);
    }
  }

  // Infrastructure: #rec1289837641 has its own text block (also tn_text_1470210011265)
  const infra = doc.querySelector("#rec1289837641");
  if (infra && content.infrastructure_text) {
    setHtml(infra.querySelector(".tn-atom[field='tn_text_1470210011265']"), content.infrastructure_text);
  }

  // Video: update Vimeo id if provided
  if (content.video_url) {
    const vimeoId =
      content.video_url.match(/vimeo\.com\/(\d+)/)?.[1] ||
      content.video_url.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];
    if (vimeoId) {
      const videoDiv = doc.querySelector(
        "#rec1289837611 .t-video-lazyload[data-videolazy-type='vimeo']",
      );
      if (videoDiv) videoDiv.setAttribute("data-videolazy-id", vimeoId);
    }
  }

  // Panorama iframe
  if (content.panorama_url) {
    const iframe = doc.querySelector("iframe[title='Панорама']");
    if (iframe) iframe.setAttribute("src", content.panorama_url);
  }

  // Footer contacts
  const footer = doc.querySelector("#rec1289837801");
  if (footer) {
    if (content.contact_email) {
      const emailA = footer.querySelector("a[href^='mailto:']");
      if (emailA) {
        emailA.setAttribute("href", `mailto:${content.contact_email}`);
        emailA.textContent = content.contact_email;
      }
    }

    const footerPhone = content.contact_phone || content.phone;
    if (footerPhone) {
      const phoneA = footer.querySelector("a[href^='tel:']");
      if (phoneA) {
        phoneA.setAttribute("href", `tel:${normalizeTel(footerPhone)}`);
        phoneA.textContent = footerPhone;
      }
    }
  }

  return doc.body.innerHTML || templateHtml;
}

export default function ResidentialComplex() {
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
    // CSS from exported Tilda template
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
    // JS from exported Tilda template
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
        page_content: (complex as unknown as { page_content: unknown }).page_content,
      },
    });
  }, [templateHtml, complex]);

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
}

