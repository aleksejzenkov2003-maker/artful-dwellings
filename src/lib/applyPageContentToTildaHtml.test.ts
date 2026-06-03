import { describe, expect, it } from "vitest";
import { applyPageContentToTildaHtml } from "@/lib/applyPageContentToTildaHtml";
import { sanitizeTildaHtml } from "@/lib/sanitizeTildaHtml";

const ABOUT_FIXTURE = `
<div id="rec1289837621">
  <h2 class="tn-atom" field="tn_text_1470209944682">О ПРОЕКТЕ</h2>
  <div class="tn-atom" field="tn_text_1470210011265">Шаблонный текст</div>
  <div class="tn-atom" field="tn_text_1616954518493">2 КОРПУСА</div>
  <div class="tn-atom" field="tn_text_1617101482694">2 корпуса</div>
  <div class="tn-atom" field="tn_text_1616953983343">263 КВАРТИРЫ</div>
  <div class="tn-atom" field="tn_text_175749789165940690">Больший корпус</div>
  <div class="tn-atom" field="tn_text_1617298629804">от 26 до 146 кв. м</div>
  <div class="tn-atom" field="tn_text_1616964401750">CARD1</div>
  <div class="tn-atom" field="tn_text_1616964401718">desc1</div>
</div>
`;

describe("sanitizeTildaHtml", () => {
  it("converts ul/li to paragraphs without list markup", () => {
    const out = sanitizeTildaHtml("<p>Заголовок:</p><ul><li>Пункт A</li><li>Пункт B</li></ul>");
    expect(out).not.toMatch(/<ul/i);
    expect(out).not.toMatch(/<li/i);
    expect(out).toContain("Пункт A");
    expect(out).toContain("Пункт B");
  });
});

describe("applyPageContentToTildaHtml about block", () => {
  it("writes about_text to main body field, not section heading", () => {
    const html = applyPageContentToTildaHtml({
      templateHtml: ABOUT_FIXTURE,
      complex: {
        name: "Test JK",
        address: null,
        completion_date: null,
        apartments_count: 50,
        area_from: 30,
        area_to: 100,
        page_content: { about_text: "<p>Текст ЖК</p>" },
      },
      buildings: [{ name: "Корпус 1", floors_count: 10 }],
      apartments: [],
      slides: [],
    });

    expect(html).toContain('field="tn_text_1470210011265"');
    expect(html).toContain("Текст ЖК");
    expect(html).toMatch(/field="tn_text_1470209944682">О ПРОЕКТЕ/);
    expect(html).not.toContain('field="tn_text_1470209944682">Текст ЖК');
  });

  it("updates corps header stat only, leaves video-area duplicate", () => {
    const html = applyPageContentToTildaHtml({
      templateHtml: ABOUT_FIXTURE,
      complex: {
        name: "Test",
        address: null,
        completion_date: null,
        apartments_count: 10,
        area_from: null,
        area_to: null,
        page_content: {},
      },
      buildings: [{ name: "A", floors_count: 5 }, { name: "B", floors_count: 7 }],
      apartments: [],
      slides: [],
    });

    expect(html).toContain('tn_text_1616954518493">2 КОРПУСА');
    expect(html).toContain('tn_text_1617101482694">2 корпуса');
  });

  it("applies about_cards to fixed slots", () => {
    const html = applyPageContentToTildaHtml({
      templateHtml: ABOUT_FIXTURE,
      complex: {
        name: "Test",
        address: null,
        completion_date: null,
        apartments_count: null,
        area_from: null,
        area_to: null,
        page_content: {
          about_cards: [{ title: "Новый заголовок", description: "<p>Описание</p>" }],
        },
      },
      buildings: [],
      apartments: [],
      slides: [],
    });

    expect(html).toContain("Новый заголовок");
    expect(html).toContain("Описание");
    expect(html).not.toContain(">CARD1<");
  });
});
