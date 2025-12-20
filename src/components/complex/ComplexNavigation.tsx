import { useState, useEffect } from "react";

interface ComplexNavigationProps {
  activeSection?: string;
}

const tabs = [
  { id: "photo", label: "ФОТО" },
  { id: "details", label: "ДЕТАЛИ" },
  { id: "location", label: "МЕСТО" },
  { id: "apartments", label: "КВАРТИРЫ" },
  { id: "description", label: "ОПИСАНИЕ" },
];

export function ComplexNavigation({ activeSection }: ComplexNavigationProps) {
  const [active, setActive] = useState("photo");

  useEffect(() => {
    if (activeSection) {
      setActive(activeSection);
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    setActive(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Track scroll position to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => ({
        id: tab.id,
        element: document.getElementById(tab.id)
      })).filter(section => section.element);

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActive(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center gap-6 lg:gap-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`relative text-[12px] lg:text-[13px] uppercase tracking-[0.12em] font-medium transition-colors whitespace-nowrap ${
                active === tab.id 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {/* Active indicator */}
              {active === tab.id && (
                <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary" />
              )}
              {/* Connector Line */}
              {index < tabs.length - 1 && (
                <span className="absolute left-full top-1/2 w-6 lg:w-12 h-px bg-border ml-3 hidden lg:block" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
