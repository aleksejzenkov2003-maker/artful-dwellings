import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Preload heavy assets immediately on site start
import partneramHeroUrl from "./assets/partneram-hero.svg";
const preloadImg = new Image();
preloadImg.src = partneramHeroUrl;

createRoot(document.getElementById("root")!).render(<App />);
