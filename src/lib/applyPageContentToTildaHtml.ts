import type { Apartment } from "@/hooks/useApartments";
import type { ComplexBuilding } from "@/hooks/useComplexBuildings";
import type { ComplexSlide } from "@/hooks/useComplexSlides";
import { SLIDE_TYPES } from "@/hooks/useComplexSlides";
import type { PageContent } from "@/types/pageContent";
import { sanitizeTildaHtml } from "@/lib/sanitizeTildaHtml";

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

function setImgField(root: ParentNode, imgfield: string, url: string) {
  if (!url) return;
  const img = root.querySelector(`img[imgfield='${imgfield}']`) as HTMLImageElement | null;
  if (img) {
    img.setAttribute("data-original", url);
    img.src = url;
  }
}

const ABOUT_MAIN_TEXT_FIELD = "tn_text_1470210011265";
const ABOUT_MAIN_TEXT_ELEM_ID = "1470210011265";

/** Статистика «О проекте» — только эти field, без pickAtom (иначе дублируется «2 корпуса» у видео). */
const ABOUT_STATS_FIELDS = {
  corpsHeader: "tn_text_1616954518493",
  corpsList: "tn_text_175749789165940690",
  apartments: "tn_text_1616953983343",
  areaValue: "tn_text_1617298629804",
} as const;

function setAboutField(root: ParentNode, field: string, text: string, asHtml = false) {
  root.querySelectorAll(`.tn-atom[field='${field}']`).forEach((el) => {
    if (asHtml) setHtml(el, text);
    else setText(el, text);
  });
}

const ABOUT_CARD_FIELDS = [
  {
    title: "tn_text_1616964401750",
    descr: "tn_text_1616964401718",
    titleElemId: "1616964401750",
    descrElemId: "1616964401718",
  },
  {
    title: "tn_text_1616964723201",
    descr: "tn_text_1616964723179",
    titleElemId: "1616964723201",
    descrElemId: "1616964723179",
  },
  {
    title: "tn_text_1616964789804",
    descr: "tn_text_1616964789783",
    titleElemId: "1616964789804",
    descrElemId: "1616964789783",
  },
  {
    title: "tn_text_1616964789849",
    descr: "tn_text_1616964789835",
    titleElemId: "1616964789849",
    descrElemId: "1616964789835",
  },
] as const;

function setAllAboutTextAtoms(root: ParentNode, field: string, elemId: string, text: string, asHtml = false) {
  const seen = new Set<Element>();
  const nodes: Element[] = [];
  root.querySelectorAll(`.tn-atom[field='${field}']`).forEach((el) => nodes.push(el));
  root.querySelectorAll(`[data-elem-id='${elemId}'] .tn-atom`).forEach((el) => nodes.push(el));
  const fallback = root.querySelector(`[data-elem-id='${elemId}']`);
  if (fallback) nodes.push(fallback);

  for (const el of nodes) {
    if (seen.has(el)) continue;
    seen.add(el);
    if (asHtml) setHtml(el, text);
    else setText(el, text);
  }
}

const ABOUT_IMAGE_FIELDS = ["tn_img_1617102823641", "tn_img_1617787290646"] as const;

const TOUR_IMAGE_FIELDS = ["tn_img_1616966538924", "tn_img_1617140919394", "tn_img_1617199290456"] as const;

export function applyPageContentToTildaHtml(args: {
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
  slides?: ComplexSlide[];
}): string {
  const { templateHtml, complex, apartments, buildings, slides = [] } = args;
  const raw = (complex.page_content as PageContent) || {};
  const content: PageContent = {
    about_text: raw.about_text || "",
    ...raw,
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, "text/html");

  const fixed = (doc.body.innerHTML || "")
    .split("images/")
    .join("/tilda/images/")
    .split('href="css/')
    .join('href="/tilda/css/')
    .split('src="js/')
    .join('src="/tilda/js/');
  doc.body.innerHTML = fixed;

  doc.querySelector("#rec1289837561")?.remove();
  doc.querySelector("#rec1652287971")?.remove();
  doc.querySelector("#rec1289837801")?.remove();
  doc.querySelector("#rec1289837811")?.remove();

  const formsSuccessUrl = content.forms_success_url || "/thanks";
  doc.querySelectorAll("form[data-success-url]").forEach((f) => {
    const current = f.getAttribute("data-success-url") || "";
    if (current.includes("jkmir.ru/thanks") || current.startsWith("http")) {
      f.setAttribute("data-success-url", formsSuccessUrl);
    }
  });

  // HERO
  const hero = doc.querySelector("#rec1289837591");
  if (hero) {
    setText(hero.querySelector(".tn-atom[field='tn_text_1616952611617']"), complex.name);
    if (content.hero_title) {
      setHtml(hero.querySelector(".tn-atom[field='tn_text_1470209944682']"), content.hero_title);
    }
    if (content.hero_background_image) {
      const carrier = hero.querySelector(".t396__carrier") as HTMLElement | null;
      if (carrier) {
        carrier.setAttribute("data-original", content.hero_background_image);
        carrier.style.backgroundImage = `url('${content.hero_background_image}')`;
      }
    }
    const address = complex.address || "Адрес уточняется";
    const metro = content.metro_station || "";
    const completion = formatQuarter(complex.completion_date);
    const addrHtml = [
      address,
      "<br><br><br>",
      metro ? `Метро: «${metro}»` : "Метро: уточняйте",
      "<br><br><br>",
      `Сдача: ${completion}`,
    ].join("");
    setHtml(hero.querySelector(".tn-atom[field='tn_text_1470210011265']"), addrHtml);

    const phoneA = hero.querySelector(".main-phone a");
    const phoneText = (content.phone || phoneA?.textContent || "").trim();
    if (phoneA && phoneText) {
      phoneA.setAttribute("href", `tel:${normalizeTel(phoneText)}`);
      phoneA.textContent = phoneText;
    }
    if (content.work_hours) {
      setHtml(hero.querySelector(".tn-atom[field='tn_text_1616952736902']"), content.work_hours);
    }
  }

  // About section
  const aboutRec = doc.querySelector("#rec1289837621");
  if (aboutRec) {
    if (content.about_text?.trim()) {
      const safeAbout = sanitizeTildaHtml(content.about_text);
      setAllAboutTextAtoms(
        aboutRec,
        ABOUT_MAIN_TEXT_FIELD,
        ABOUT_MAIN_TEXT_ELEM_ID,
        safeAbout,
        true,
      );
    }

    // Карточки: перезаписываем слоты, если в админке есть хотя бы одна заполненная карточка
    const hasAboutCards =
      Array.isArray(content.about_cards) &&
      content.about_cards.some((c) => (c.title || "").trim() || (c.description || "").trim());

    if (hasAboutCards) {
      ABOUT_CARD_FIELDS.forEach((fields, idx) => {
        const card = content.about_cards?.[idx];
        const title = card?.title?.trim() ?? "";
        const description = card?.description?.trim() ?? "";
        setAllAboutTextAtoms(aboutRec, fields.title, fields.titleElemId, title, false);
        setAllAboutTextAtoms(
          aboutRec,
          fields.descr,
          fields.descrElemId,
          description ? sanitizeTildaHtml(description) : "",
          true,
        );
      });
    }

    if (content.about_images?.length) {
      content.about_images.slice(0, ABOUT_IMAGE_FIELDS.length).forEach((url, idx) => {
        setImgField(aboutRec, ABOUT_IMAGE_FIELDS[idx], url);
      });
    }

    const corpCount = buildings.length;
    const apartmentsCount = complex.apartments_count;
    const areaFrom = complex.area_from;
    const areaTo = complex.area_to;

    if (corpCount > 0) {
      const label =
        corpCount === 1 ? "1 КОРПУС" : corpCount >= 2 && corpCount <= 4 ? `${corpCount} КОРПУСА` : `${corpCount} КОРПУСОВ`;
      setAboutField(aboutRec, ABOUT_STATS_FIELDS.corpsHeader, label);

      const lines = buildings
        .slice(0, 6)
        .map(
          (b, i) =>
            `${b.name || `Корпус ${i + 1}`}${b.floors_count ? ` — ${b.floors_count} этажей` : ""}`,
        );
      setAboutField(aboutRec, ABOUT_STATS_FIELDS.corpsList, lines.join("<br>"), true);
    }

    if (typeof apartmentsCount === "number" && apartmentsCount > 0) {
      setAboutField(aboutRec, ABOUT_STATS_FIELDS.apartments, `${apartmentsCount} КВАРТИРЫ`);
    }

    if (areaFrom || areaTo) {
      const from = areaFrom ? Math.round(areaFrom) : null;
      const to = areaTo ? Math.round(areaTo) : null;
      setAboutField(
        aboutRec,
        ABOUT_STATS_FIELDS.areaValue,
        `от ${from ?? "—"} до ${to ?? "—"} кв. м`,
      );
    }

    aboutRec.querySelectorAll(".tn-atom").forEach((el) => {
      const node = el as HTMLElement;
      if (!node.innerHTML) return;
      node.innerHTML = node.innerHTML
        .split("«МИРЪ»")
        .join(`«${complex.name}»`)
        .split("«МИР»")
        .join(`«${complex.name}»`);
    });

    const aboutVideoCaption = aboutRec.querySelector(".tn-atom[field='tn_text_1617103014890']");
    if (aboutVideoCaption) {
      setText(aboutVideoCaption, `посмотрите видео о ${complex.name}`);
    }
  }

  // Video
  {
    const videoDiv = doc.querySelector(
      "#rec1289837611 .t-video-lazyload[data-videolazy-type='vimeo']",
    );
    if (content.video_url) {
      const vimeoId =
        content.video_url.match(/vimeo\.com\/(\d+)/)?.[1] ||
        content.video_url.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];
      if (vimeoId && videoDiv) videoDiv.setAttribute("data-videolazy-id", vimeoId);
    } else {
      videoDiv?.closest("#rec1289837611")?.remove();
    }
  }

  // Panorama
  {
    const iframe = doc.querySelector("iframe[title='Панорама']");
    if (content.panorama_url) {
      if (iframe) iframe.setAttribute("src", content.panorama_url);
    } else {
      iframe?.closest(".t-popup")?.remove();
    }
  }

  // Virtual tour / slides
  const publishedSlides = slides.filter((s) => s.is_published && s.image_url);
  const tourRec = doc.querySelector("#rec1289837661");
  if (tourRec) {
    if (publishedSlides.length > 0) {
      const first = publishedSlides[0];
      const slideLabel =
        SLIDE_TYPES.find((t) => t.value === first.slide_type)?.label || first.title;
      setText(tourRec.querySelector(".tn-atom[field='tn_text_1470209944682']"), slideLabel);
      const descr = first.description || first.title;
      if (descr) {
        setHtml(tourRec.querySelector(".tn-atom[field='tn_text_1616954474827']"), descr);
      }
      publishedSlides.slice(0, TOUR_IMAGE_FIELDS.length).forEach((slide, idx) => {
        if (slide.image_url) setImgField(tourRec, TOUR_IMAGE_FIELDS[idx], slide.image_url);
      });
    } else if (!content.panorama_url) {
      tourRec.remove();
    }
  }

  // Map
  if (content.map_image) {
    const mapCarrier = doc.querySelector("#rec1289837631 .t674__cover-carrier") as HTMLElement | null;
    if (mapCarrier) {
      mapCarrier.setAttribute("data-original", content.map_image);
      mapCarrier.style.backgroundImage = `url('${content.map_image}')`;
    }
    const infraRec = doc.querySelector("#rec1289837641");
    if (infraRec) setImgField(infraRec, "tn_img_1616966029884", content.map_image);
  }

  // Layouts background
  if (content.layouts_background_image) {
    const layoutsCarrier = doc.querySelector("#rec1289837681 .t396__carrier") as HTMLElement | null;
    if (layoutsCarrier) {
      layoutsCarrier.setAttribute("data-original", content.layouts_background_image);
      layoutsCarrier.style.backgroundImage = `url('${content.layouts_background_image}')`;
    }
  }

  // Infrastructure
  const infra = doc.querySelector("#rec1289837641");
  if (infra) {
    if (content.infrastructure_text) {
      setHtml(infra.querySelector(".tn-atom[field='tn_text_1470210011265']"), content.infrastructure_text);
    }
    if (content.infrastructure_items?.length) {
      const itemsHtml = content.infrastructure_items
        .filter((i) => i.title)
        .map((i) => (i.description ? `${i.title} — ${i.description}` : i.title))
        .join("<br><br>");
      if (itemsHtml) {
        setHtml(infra.querySelector(".tn-atom[field='tn_text_1616953983343']"), itemsHtml);
      }
      const details = content.infrastructure_items
        .filter((i) => i.description && i.title)
        .map((i) => i.description)
        .join("<br><br>");
      if (details) {
        setHtml(infra.querySelector(".tn-atom[field='tn_text_1616954474827']"), details);
      }
      const diamonds = infra.querySelector(".tn-atom[field='tn_text_1616965832400']");
      if (diamonds) {
        const count = Math.max(1, Math.min(13, content.infrastructure_items.length));
        setHtml(diamonds, Array.from({ length: count }).map(() => "⬥").join("<br>"));
      }
    }
  }

  // Layout cards from apartments
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

  // Documents
  if (content.documents?.length) {
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
      const diamonds = docsBlock.querySelector(".tn-atom[field='tn_text_1616965832400']");
      if (diamonds) {
        const count = Math.max(1, Math.min(12, content.documents.length));
        setHtml(diamonds, Array.from({ length: count }).map(() => "⬥").join("<br>"));
      }
    }
  }

  // Promotions heading
  if (content.promotions_heading) {
    const promoHeadingRec = doc.querySelector("#rec1347585091");
    if (promoHeadingRec) {
      setText(
        promoHeadingRec.querySelector(".tn-atom[field='tn_text_1616968065917']"),
        content.promotions_heading,
      );
    }
  }

  // Promotions list
  if (content.promotions?.length) {
    const promoRec = doc.querySelector("#rec1347582671");
    if (promoRec) {
      const items = Array.from(promoRec.querySelectorAll(".t568__text"));
      content.promotions.slice(0, items.length).forEach((p, idx) => {
        const line = p.text ? `${p.title}${p.text ? `: ${p.text}` : ""}` : p.title;
        setText(items[idx], line);
      });
    }
  }

  // Installments section heading + intro
  const introRec = doc.querySelector("#rec1347578891");
  if (introRec) {
    if (content.installments_section_heading) {
      setText(
        introRec.querySelector(".tn-atom[field='tn_text_1616968065917']"),
        content.installments_section_heading,
      );
    }

    let introHtml = "";
    if (content.mortgage_heading || content.mortgage_text || content.mortgage_conditions?.length) {
      if (content.mortgage_heading) {
        introHtml += `<p><strong>${content.mortgage_heading}</strong></p>`;
      }
      if (content.mortgage_text) introHtml += content.mortgage_text;
      if (content.mortgage_conditions?.length) {
        introHtml += content.mortgage_conditions
          .filter((c) => c.title)
          .map((c) => `<p><strong>${c.title}:</strong> ${c.value || ""}</p>`)
          .join("");
      }
      introHtml += "<br>";
    }
    if (content.installments_intro) {
      introHtml += content.installments_intro;
    }
    if (introHtml) {
      setHtml(introRec.querySelector(".tn-atom[field='tn_text_1470210011265']"), introHtml);
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
      const descr = ratesRec.querySelector(
        "[field='li_descr__9713475634810'], [field^='li_descr__']",
      );
      if (descr) setHtml(descr, content.installments_subsidy_rates_html);
    }
  }

  const applyTwoCardProgram = (opts: {
    titleRecId: string;
    titleField: string;
    noteField: string;
    heading?: string;
    note?: string;
    cardsRecId: string;
    cards?: Array<{ title: string; description: string }>;
  }) => {
    const titleRec = doc.querySelector(`#${opts.titleRecId}`);
    if (titleRec) {
      if (opts.heading) {
        setText(titleRec.querySelector(`.tn-atom[field='${opts.titleField}']`), opts.heading);
      }
      if (opts.note) {
        setText(titleRec.querySelector(`.tn-atom[field='${opts.noteField}']`), opts.note);
      }
    }
    if (opts.cards?.length) {
      const rec = doc.querySelector(`#${opts.cardsRecId}`);
      if (!rec) return;
      const cardTitles = Array.from(rec.querySelectorAll(".t-card__title, [field^='li_title__']"));
      const cardDescrs = Array.from(rec.querySelectorAll(".t-card__descr, [field^='li_descr__']"));
      opts.cards.slice(0, Math.min(cardTitles.length, cardDescrs.length)).forEach((c, idx) => {
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

  // Driver
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
      setImgField(driverRec, "tn_img_1617114588640", content.driver_car_image);
    }
    if (content.driver_button_text) {
      const formElem = driverRec.querySelector(
        ".tn-elem[data-elem-id='1616953287834']",
      ) as HTMLElement | null;
      if (formElem) {
        formElem.setAttribute("data-field-buttontitle-value", content.driver_button_text);
      }
    }
  }

  // Telegram
  const tgRec = doc.querySelector("#rec1528001701");
  if (tgRec) {
    if (content.telegram_title) {
      setText(tgRec.querySelector(".tn-atom[field='tn_text_1592216698319']"), content.telegram_title);
    }
    if (content.telegram_description) {
      setHtml(tgRec.querySelector(".tn-atom[field='tn_text_1593634597228']"), content.telegram_description);
    }
    if (content.telegram_button_text || content.telegram_button_url) {
      const btn = tgRec.querySelector(
        ".tn-elem[data-elem-id='1593634916248'] a.tn-atom",
      ) as HTMLAnchorElement | null;
      if (btn) {
        if (content.telegram_button_url) btn.setAttribute("href", content.telegram_button_url);
        if (content.telegram_button_text) {
          const t = btn.querySelector(".tn-atom__button-text");
          if (t) (t as HTMLElement).textContent = content.telegram_button_text;
        }
      }
    }
    if (content.telegram_qr_image) {
      setImgField(tgRec, "tn_img_1762438348679", content.telegram_qr_image);
    }
    if (content.telegram_phone_image) {
      setImgField(tgRec, "tn_img_1593634750476", content.telegram_phone_image);
    }
  }

  // Disclaimer
  if (content.disclaimer_text) {
    const rec = doc.querySelector("#rec1344423681");
    if (rec) {
      setHtml(rec.querySelector(".tn-atom[field='tn_text_1617191546076']"), content.disclaimer_text);
    }
  }

  // FAQ — prefer newer block
  if (content.faq?.length) {
    const faqRoot = doc.querySelector("#rec1661341581") || doc.body;
    const faqTitles = Array.from(faqRoot.querySelectorAll(".t668__title"));
    const faqDescrs = Array.from(faqRoot.querySelectorAll(".t668__text"));
    content.faq.slice(0, Math.min(faqTitles.length, faqDescrs.length)).forEach((item, idx) => {
      setText(faqTitles[idx], item.question);
      setHtml(faqDescrs[idx], item.answer);
    });
  }

  // Contacts in page body (forms area)
  if (content.contact_email || content.contact_phone || content.phone) {
    doc.querySelectorAll("a[href^='mailto:']").forEach((a) => {
      if (content.contact_email) {
        a.setAttribute("href", `mailto:${content.contact_email}`);
        if (!a.closest("#rec1289837801")) a.textContent = content.contact_email;
      }
    });
    const footerPhone = content.contact_phone || content.phone;
    if (footerPhone) {
      doc.querySelectorAll("a[href^='tel:']").forEach((a) => {
        if (!a.closest("#rec1289837801")) return;
        a.setAttribute("href", `tel:${normalizeTel(footerPhone)}`);
        a.textContent = footerPhone;
      });
    }
  }

  let finalHtml = doc.body.innerHTML || templateHtml;
  finalHtml = finalHtml.split("«МИРЪ»").join(`«${complex.name}»`);
  finalHtml = finalHtml.split("«МИР»").join(`«${complex.name}»`);

  return finalHtml;
}
