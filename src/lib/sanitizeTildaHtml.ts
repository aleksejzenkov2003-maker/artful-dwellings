/** Убирает ul/ol/list-style — в Tilda абсолютная вёрстка, списки из редактора накладываются на декоративные круги. */
export function sanitizeTildaHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="sanitize-root">${trimmed}</div>`, "text/html");
  const root = doc.getElementById("sanitize-root");
  if (!root) return trimmed;

  root.querySelectorAll("ul, ol").forEach((list) => {
    const div = doc.createElement("div");
    div.className = "tilda-safe-list";
    Array.from(list.children).filter((n) => n.tagName === "LI").forEach((li) => {
      const p = doc.createElement("p");
      p.style.margin = "0 0 14px 0";
      p.style.paddingLeft = "0";
      const inner = (li.innerHTML || "").trim();
      p.innerHTML = inner || (li.textContent || "").trim();
      div.appendChild(p);
    });
    list.replaceWith(div);
  });

  root.querySelectorAll("li").forEach((li) => {
    const p = doc.createElement("p");
    p.style.margin = "0 0 14px 0";
    p.innerHTML = (li.innerHTML || "").trim() || (li.textContent || "").trim();
    li.replaceWith(p);
  });

  root.querySelectorAll("[style]").forEach((el) => {
    const node = el as HTMLElement;
    const style = node.getAttribute("style") || "";
    if (/list-style/i.test(style)) {
      node.style.listStyle = "none";
      node.style.paddingLeft = "0";
      node.style.marginLeft = "0";
    }
  });

  return root.innerHTML.trim();
}
