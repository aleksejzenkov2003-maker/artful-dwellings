import { useState, useEffect } from "react";

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
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center overflow-x-auto">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center shrink-0">
              {index > 0 && (
                <span className="w-8 lg:w-16 h-px bg-muted-foreground/30 mx-4 lg:mx-6" />
              )}
              <button
                onClick={() => scrollToSection(tab.id)}
                className={`relative text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-medium transition-colors whitespace-nowrap py-2 ${
                  active === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {active === tab.id && (
                  <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-[#BA846E]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
