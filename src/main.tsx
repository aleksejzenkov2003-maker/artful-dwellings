import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Preload heavy assets immediately on site start
import partneramHeroUrl from "./assets/partneram-hero.svg";
const preloadImg = new Image();
preloadImg.src = partneramHeroUrl;

// Preload & cache the Tilda template globally so complex pages open instantly
export const tildaTemplatePromise: Promise<string> = fetch("/tilda/files/page76983836body.html", { cache: "force-cache" })
  .then(r => r.ok ? r.text() : Promise.reject(new Error(`Template ${r.status}`)))
  .catch(() => "");

createRoot(document.getElementById("root")!).render(<App />);
