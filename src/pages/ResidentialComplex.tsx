import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentsByComplex } from "@/hooks/useApartments";
import type { Apartment } from "@/hooks/useApartments";
import { useComplexBuildings } from "@/hooks/useComplexBuildings";
import type { ComplexBuilding } from "@/hooks/useComplexBuildings";
import type { PageContent } from "@/types/pageContent";
import { Layout } from "@/components/layout/Layout";

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
    apartments_count: number | null;
    area_from: number | null;
    area_to: number | null;
    page_content: unknown;
  };
  apartments: Apartment[];
  buildings: ComplexBuilding[];
}): string {
  const { templateHtml, complex, apartments, buildings } = args;
  const raw = (complex.page_content as PageContent) || {};
  const content: PageContent = {
    // fallbacks from "admin ЖК" fields (not from template)
    about_text: raw.about_text || "",
    ...raw,
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, "text/html");

  // Make asset paths absolute inside SPA routes.
  const fixed = (doc.body.innerHTML || "")
    .split("images/").join("/tilda/images/")
    .split("href=\"css/").join("href=\"/tilda/css/")
    .split("src=\"js/").join("src=\"/tilda/js/");
  doc.body.innerHTML = fixed;

  // Remove Tilda navigation/burger, floating widgets, and Tilda footer (we use our own header/footer).
  doc.querySelector("#rec1289837561")?.remove(); // burger menu
  doc.querySelector("#rec1652287971")?.remove(); // floating chat/telegram button
  doc.querySelector("#rec1289837801")?.remove(); // tilda footer
  doc.querySelector("#rec1289837811")?.remove(); // clickfrog (tracking)

  // Fix Tilda forms redirect: do not send users to the template site.
  const formsSuccessUrl = content.forms_success_url || "/thanks";
  doc.querySelectorAll("form[data-success-url]").forEach((f) => {
    const current = f.getAttribute("data-success-url") || "";
    if (current.includes("jkmir.ru/thanks") || current.startsWith("http")) {
      f.setAttribute("data-success-url", formsSuccessUrl);
    }
  });

  // HERO: #rec1289837591
  const hero = doc.querySelector("#rec1289837591");
  if (hero) {
    // ЖК name
    setText(hero.querySelector(".tn-atom[field='tn_text_1616952611617']"), complex.name);

    // Hero subtitle (field tn_text_1470209944682)
    if (content.hero_title) {
      setHtml(hero.querySelector(".tn-atom[field='tn_text_1470209944682']"), content.hero_title);
    }

    // Hero background
    if (content.hero_background_image) {
      const carrier = hero.querySelector(".t396__carrier") as HTMLElement | null;
      if (carrier) {
        carrier.setAttribute("data-original", content.hero_background_image);
        carrier.style.backgroundImage = `url('${content.hero_background_image}')`;
      }
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

  // About section ("О проекте") lives in #rec1289837621.
  // Template contains project-specific text; we override with DB content.
  const aboutRec = doc.querySelector("#rec1289837621");
  if (aboutRec) {
    const aboutHtml = content.about_text || "";
    if (aboutHtml) {
      const textAtoms = Array.from(aboutRec.querySelectorAll(".tn-atom[field^='tn_text_']")) as HTMLElement[];
      // Heuristic: pick the largest text block and replace it with about_text.
      let best: HTMLElement | null = null;
      let bestScore = 0;
      for (const el of textAtoms) {
        const t = (el.textContent || "").trim();
        if (!t) continue;
        const score = t.length;
        if (score > bestScore) {
          bestScore = score;
          best = el;
        }
      }
      if (best) setHtml(best, aboutHtml);
    }

    // Replace project stats from admin fields/buildings/apartments
    const corpCount = buildings.length;
    const apartmentsCount = complex.apartments_count;
    const areaFrom = complex.area_from;
    const areaTo = complex.area_to;

    const aboutAtoms = Array.from(aboutRec.querySelectorAll(".tn-atom")) as HTMLElement[];
    let replacedCorpus = false;
    let replacedApartments = false;
    let replacedArea = false;
    for (const el of aboutAtoms) {
      const t = (el.textContent || "").trim();
      if (!t) continue;

      if (/корпус/i.test(t) && corpCount > 0) {
        if (!replacedCorpus) {
          const lines = [
            `${corpCount} корпуса`,
            ...buildings
              .slice(0, 6)
              .map((b, i) => `${b.name || `Корпус ${i + 1}`}${b.floors_count ? ` — ${b.floors_count} этажей` : ""}`),
          ];
          el.innerHTML = lines.join("<br>");
          replacedCorpus = true;
        } else {
          // Hide duplicate corpus blocks
          const wrapper = el.closest(".tn-elem") as HTMLElement | null;
          if (wrapper) wrapper.style.display = "none";
          else el.style.display = "none";
        }
        continue;
      }

      if (/квартир/i.test(t) && typeof apartmentsCount === "number") {
        if (!replacedApartments) {
          el.textContent = `${apartmentsCount} КВАРТИРЫ`;
          replacedApartments = true;
        } else {
          const wrapper = el.closest(".tn-elem") as HTMLElement | null;
          if (wrapper) wrapper.style.display = "none";
          else el.style.display = "none";
        }
        continue;
      }

      if (/от\s*\d+\s*до\s*\d+.*кв/i.test(t) && (areaFrom || areaTo)) {
        if (!replacedArea) {
          const from = areaFrom ? Math.round(areaFrom) : null;
          const to = areaTo ? Math.round(areaTo) : null;
          el.textContent = `ОТ ${from ?? "—"} ДО ${to ?? "—"} КВ. М`;
          replacedArea = true;
        } else {
          const wrapper = el.closest(".tn-elem") as HTMLElement | null;
          if (wrapper) wrapper.style.display = "none";
          else el.style.display = "none";
        }
        continue;
      }
    }

    // Remove "МИРЪ" leftovers inside about block if any.
    aboutRec.querySelectorAll(".tn-atom").forEach((el) => {
      const node = el as HTMLElement;
      if (!node.innerHTML) return;
      node.innerHTML = node.innerHTML
        .split("«МИРЪ»").join(`«${complex.name}»`)
        .split("«МИР»").join(`«${complex.name}»`);
    });

    // Video caption inside about section
    const aboutVideoCaption = aboutRec.querySelector(".tn-atom[field='tn_text_1617103014890']");
    if (aboutVideoCaption) {
      setText(aboutVideoCaption, `посмотрите видео о ${complex.name}`);
    }
  }

  // Video: update Vimeo id if provided
  {
    const videoDiv = doc.querySelector("#rec1289837611 .t-video-lazyload[data-videolazy-type='vimeo']");
    if (content.video_url) {
      const vimeoId =
        content.video_url.match(/vimeo\.com\/(\d+)/)?.[1] ||
        content.video_url.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];
      if (vimeoId && videoDiv) videoDiv.setAttribute("data-videolazy-id", vimeoId);
    } else {
      // Do not show template video for other complexes
      videoDiv?.closest("#rec1289837611")?.remove();
    }
  }

  // Panorama iframe
  {
    const iframe = doc.querySelector("iframe[title='Панорама']");
    if (content.panorama_url) {
      if (iframe) iframe.setAttribute("src", content.panorama_url);
    } else {
      // Do not show template panorama for other complexes
      iframe?.closest(".t-popup")?.remove();
    }
  }

  // Map image (rec1289837631)
  if (content.map_image) {
    const mapCarrier = doc.querySelector("#rec1289837631 .t674__cover-carrier") as HTMLElement | null;
    if (mapCarrier) {
      mapCarrier.setAttribute("data-original", content.map_image);
      mapCarrier.style.backgroundImage = `url('${content.map_image}')`;
    }
  }

  // Layouts background (rec1289837681)
  if (content.layouts_background_image) {
    const layoutsCarrier = doc.querySelector("#rec1289837681 .t396__carrier") as HTMLElement | null;
    if (layoutsCarrier) {
      layoutsCarrier.setAttribute("data-original", content.layouts_background_image);
      layoutsCarrier.style.backgroundImage = `url('${content.layouts_background_image}')`;
    }
  }

  // Layout cards (rec1289837701 / t776) from DB apartments
  const availableApts = apartments.filter((a) => a.is_published && a.status === "available");
  if (availableApts.length > 0) {
    const rec = doc.querySelector("#rec1289837701");
    if (rec) {
      const roomOrder = ["studio", "1", "2", "3", "4"];
      const roomLabels: Record<string, string> = {
        studio: "Студии",
        "1": "1-комнатные",
        "2": "2-комнатные",
        "3": "3-комнатные",
        "4": "4-комнатные",
      };

      const cols = Array.from(rec.querySelectorAll(".t776__col"));

      roomOrder.forEach((roomType, idx) => {
        const col = cols[idx];
        if (!col) return;

        const list = availableApts.filter((a) => a.room_type === roomType);
        if (list.length === 0) return;

        const minArea = Math.min(...list.map((a) => a.area));
        const maxArea = Math.max(...list.map((a) => a.area));
        const minPrice = Math.min(...list.map((a) => a.price));

        const titleEl = col.querySelector("[field^='li_title__'], .t776__title");
        if (titleEl) setText(titleEl, roomLabels[roomType] || roomType);

        const descrEl = col.querySelector("[field^='li_descr__'], .t776__descr");
        if (descrEl) {
          const areaText =
            Math.abs(minArea - maxArea) < 0.0001
              ? `${minArea.toFixed(1)} кв. м`
              : `${minArea.toFixed(1)} — ${maxArea.toFixed(1)} кв. м`;
          setHtml(
            descrEl,
            `<br />Площадь: ${areaText}<br />Цена от: ${new Intl.NumberFormat("ru-RU").format(minPrice)} ₽`,
          );
        }

        const imgUrl = list.find((a) => !!a.layout_image)?.layout_image || null;
        if (imgUrl) {
          const img = col.querySelector("img") as HTMLImageElement | null;
          if (img) {
            img.setAttribute("data-original", imgUrl);
            img.src = imgUrl;
          }
          const bg = col.querySelector(".t-bgimg") as HTMLElement | null;
          if (bg) {
            bg.setAttribute("data-original", imgUrl);
            bg.style.backgroundImage = `url('${imgUrl}')`;
          }
        }
      });
    }
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

  // Documentation list (rec1289837731)
  if (content.documents && content.documents.length > 0) {
    const docsBlock = doc.querySelector("#rec1289837731");
    if (docsBlock) {
      const linksContainer = docsBlock.querySelector(".docs-links .tn-atom");
      if (linksContainer) {
        const html = content.documents
          .filter((d) => d.title && d.url)
          .map(
            (d) =>
              `<a href="${d.url}" target="_blank" rel="nofollow noreferrer noopener">${d.title}</a>`,
          )
          .join("<br><br>");
        setHtml(linksContainer, html);
      }

      // Diamonds column (⬥) – match number of docs
      const diamonds = docsBlock.querySelector(".tn-atom[field='tn_text_1616965832400']");
      if (diamonds) {
        const count = Math.max(1, Math.min(12, content.documents.length));
        setHtml(diamonds, Array.from({ length: count }).map(() => "⬥").join("<br>"));
      }
    }
  }

  // Promotions (Акции) in the template is a list (T568): #rec1347582671
  if (content.promotions && content.promotions.length > 0) {
    const promoRec = doc.querySelector("#rec1347582671");
    if (promoRec) {
      const items = Array.from(promoRec.querySelectorAll(".t568__text"));
      content.promotions.slice(0, items.length).forEach((p, idx) => {
        // Template shows short lines; we use title as the line text.
        setText(items[idx], p.title);
      });
    }
  }

  // Installments / Programs section (as in template)
  // Intro text + main title already exist in template; we only replace specific fields.
  if (content.installments_intro) {
    const introRec = doc.querySelector("#rec1347578891");
    if (introRec) {
      setHtml(introRec.querySelector(".tn-atom[field='tn_text_1470210011265']"), content.installments_intro);
    }
  }

  if (content.installments_subsidy_heading) {
    const rec = doc.querySelector("#rec1367623981");
    if (rec) {
      setText(rec.querySelector(".tn-atom[field='tn_text_1617101482694']"), content.installments_subsidy_heading);
    }
  }

  if (content.installments_subsidy_rates_html) {
    const ratesRec = doc.querySelector("#rec1347576871");
    if (ratesRec) {
      // In template: <div class="t-card__descr ... field="li_descr__9713475634810">...</div>
      const descr = ratesRec.querySelector("[field='li_descr__9713475634810'], [field^='li_descr__']") as Element | null;
      if (descr) setHtml(descr, content.installments_subsidy_rates_html);
    }
  }

  const applyTwoCardProgram = (args: {
    titleRecId: string;
    titleField: string;
    noteField: string;
    heading?: string;
    note?: string;
    cardsRecId: string;
    cards?: Array<{ title: string; description: string }>;
  }) => {
    const titleRec = doc.querySelector(`#${args.titleRecId}`);
    if (titleRec) {
      if (args.heading) setText(titleRec.querySelector(`.tn-atom[field='${args.titleField}']`), args.heading);
      if (args.note) setText(titleRec.querySelector(`.tn-atom[field='${args.noteField}']`), args.note);
    }

    if (args.cards && args.cards.length > 0) {
      const rec = doc.querySelector(`#${args.cardsRecId}`);
      if (!rec) return;
      const cardTitles = Array.from(rec.querySelectorAll(".t-card__title, [field^='li_title__']"));
      const cardDescrs = Array.from(rec.querySelectorAll(".t-card__descr, [field^='li_descr__']"));
      args.cards.slice(0, Math.min(cardTitles.length, cardDescrs.length)).forEach((c, idx) => {
        setText(cardTitles[idx], c.title);
        setText(cardDescrs[idx], c.description);
      });
    }
  };

  applyTwoCardProgram({
    titleRecId: "rec1347577871",
    titleField: "tn_text_1617101482694",
    noteField: "tn_text_175768861875973450",
    heading: content.installments_program1_heading,
    note: content.installments_program1_note,
    cardsRecId: "rec1367627401",
    cards: content.installments_program1_cards,
  });

  applyTwoCardProgram({
    titleRecId: "rec1347572061",
    titleField: "tn_text_1617101482694",
    noteField: "tn_text_175768861875973450",
    heading: content.installments_program2_heading,
    note: content.installments_program2_note,
    cardsRecId: "rec1347571551",
    cards: content.installments_program2_cards,
  });

  // Driver block (T396): #rec1289837791
  const driverRec = doc.querySelector("#rec1289837791");
  if (driverRec) {
    if (content.driver_title) {
      setText(driverRec.querySelector(".tn-atom[field='tn_text_1616952611617']"), content.driver_title);
    }
    if (content.driver_badge) {
      setText(driverRec.querySelector(".tn-atom[field='tn_text_1470209944682']"), content.driver_badge);
    }
    if (content.driver_description) {
      setHtml(driverRec.querySelector(".tn-atom[field='tn_text_1617810495181']"), content.driver_description);
    }
    if (content.driver_right_text) {
      setHtml(driverRec.querySelector(".tn-atom[field='tn_text_1470210128180']"), content.driver_right_text);
    }
    if (content.driver_wait_time) {
      setText(driverRec.querySelector(".tn-atom[field='tn_text_1616953252953']"), content.driver_wait_time);
    }
    if (content.driver_background_image) {
      const carrier = driverRec.querySelector(".t396__carrier.t-bgimg") as HTMLElement | null;
      if (carrier) {
        carrier.setAttribute("data-original", content.driver_background_image);
        carrier.style.backgroundImage = `url('${content.driver_background_image}')`;
      }
    }
    if (content.driver_car_image) {
      const img = driverRec.querySelector("img[imgfield='tn_img_1617114588640']") as HTMLImageElement | null;
      if (img) {
        img.setAttribute("data-original", content.driver_car_image);
        img.src = content.driver_car_image;
      }
    }
    if (content.driver_button_text) {
      const formElem = driverRec.querySelector(".tn-elem[data-elem-id='1616953287834']") as HTMLElement | null;
      if (formElem) {
        formElem.setAttribute("data-field-buttontitle-value", content.driver_button_text);
      }
    }
  }

  // Telegram channel block (T396): #rec1528001701
  const tgRec = doc.querySelector("#rec1528001701");
  if (tgRec) {
    if (content.telegram_title) {
      setText(tgRec.querySelector(".tn-atom[field='tn_text_1592216698319']"), content.telegram_title);
    }
    if (content.telegram_description) {
      setHtml(tgRec.querySelector(".tn-atom[field='tn_text_1593634597228']"), content.telegram_description);
    }
    if (content.telegram_button_text || content.telegram_button_url) {
      const btn = tgRec.querySelector(".tn-elem[data-elem-id='1593634916248'] a.tn-atom") as HTMLAnchorElement | null;
      if (btn) {
        if (content.telegram_button_url) btn.setAttribute("href", content.telegram_button_url);
        if (content.telegram_button_text) {
          const t = btn.querySelector(".tn-atom__button-text");
          if (t) (t as HTMLElement).textContent = content.telegram_button_text;
        }
      }
    }
    if (content.telegram_qr_image) {
      const img = tgRec.querySelector("img[imgfield='tn_img_1762438348679']") as HTMLImageElement | null;
      if (img) {
        img.setAttribute("data-original", content.telegram_qr_image);
        img.src = content.telegram_qr_image;
      }
    }
    if (content.telegram_phone_image) {
      const img = tgRec.querySelector("img[imgfield='tn_img_1593634750476']") as HTMLImageElement | null;
      if (img) {
        img.setAttribute("data-original", content.telegram_phone_image);
        img.src = content.telegram_phone_image;
      }
    }
  }

  // Mortgage disclaimer (yellow bar) #rec1344423681
  if (content.disclaimer_text) {
    const rec = doc.querySelector("#rec1344423681");
    if (rec) {
      setHtml(rec.querySelector(".tn-atom[field='tn_text_1617191546076']"), content.disclaimer_text);
    }
  }

  // FAQ (t668): replace questions/answers
  if (content.faq && content.faq.length > 0) {
    const faqTitles = Array.from(doc.querySelectorAll(".t668__title"));
    const faqDescrs = Array.from(doc.querySelectorAll(".t668__text"));
    content.faq.slice(0, Math.min(faqTitles.length, faqDescrs.length)).forEach((item, idx) => {
      setText(faqTitles[idx], item.question);
      setHtml(faqDescrs[idx], item.answer);
    });
  }

  // Global cleanup: replace template-specific "МИРЪ" strings via fast string ops
  let finalHtml = doc.body.innerHTML || templateHtml;
  finalHtml = finalHtml.split("«МИРЪ»").join(`«${complex.name}»`);
  finalHtml = finalHtml.split("«МИР»").join(`«${complex.name}»`);

  return finalHtml;
}

export default function ResidentialComplex() {
  const { slug } = useParams<{ slug: string }>();
  const { data: complex, isLoading, error } = useResidentialComplex(slug || "");
  const { data: apartments = [] } = useApartmentsByComplex(complex?.id);
  const { data: buildings = [] } = useComplexBuildings(complex?.id);
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
        apartments_count: complex.apartments_count,
        area_from: complex.area_from,
        area_to: complex.area_to,
        page_content: (complex as unknown as { page_content: unknown }).page_content,
      },
      apartments,
      buildings,
    });
  }, [templateHtml, complex, apartments, buildings]);

  return (
    <Layout>
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
        <div className="t-body -mt-28 lg:-mt-28" style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: processedHtml }} />
      )}
    </Layout>
  );
}

