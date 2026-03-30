import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ComplexNavigationProps {
  activeSection?: string;
}

const tabs = [
  { id: "details", label: "О ПРОЕКТЕ" },
  { id: "description", label: "ИНФРАСТРУКТУРА" },
  { id: "apartments", label: "ПЛАНИРОВКИ" },
  { id: "location", label: "ЛОКАЦИЯ" },
  { id: "advantages", label: "ПЛЮСЫ" },
];

export function ComplexNavigation({ activeSection }: ComplexNavigationProps) {
  const [active, setActive] = useState("details");

  useEffect(() => {
    if (activeSection) setActive(activeSection);
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    setActive(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navigateUpDown = (direction: "up" | "down") => {
    const currentIndex = tabs.findIndex((t) => t.id === active);
    const nextIndex = direction === "down"
      ? Math.min(currentIndex + 1, tabs.length - 1)
      : Math.max(currentIndex - 1, 0);
    scrollToSection(tabs[nextIndex].id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs
        .map((tab) => ({ id: tab.id, element: document.getElementById(tab.id) }))
        .filter((s) => s.element);
      const scrollPosition = window.scrollY + 150;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].element && sections[i].element!.offsetTop <= scrollPosition) {
          setActive(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between py-5">
          {/* Tabs */}
          <div className="flex items-center flex-1 overflow-x-auto">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center shrink-0">
                {index > 0 && (
                  <span className="w-12 lg:w-20 xl:w-28 h-px bg-muted-foreground/20 mx-3 lg:mx-4" />
                )}
                <button
                  onClick={() => scrollToSection(tab.id)}
                  className={`text-[12px] lg:text-[13px] uppercase tracking-[0.18em] font-medium transition-colors whitespace-nowrap ${
                    active === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground/60 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              </div>
            ))}
          </div>

          {/* Up/Down arrows */}
          <div className="flex flex-col ml-6 shrink-0">
            <button
              onClick={() => navigateUpDown("up")}
              className="text-muted-foreground/40 hover:text-foreground transition-colors p-1"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateUpDown("down")}
              className="text-muted-foreground/40 hover:text-foreground transition-colors p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
