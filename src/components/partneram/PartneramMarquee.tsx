import { useEffect, useRef } from "react";

const text = "Мы продаем недвижимость от лучших застройщиков Санкт-Петербурга, Москвы и Дубая";

export function PartneramMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      // Move text proportionally to scroll position
      xRef.current = -(window.scrollY * 0.5);
      containerRef.current.style.transform = `translateX(${xRef.current}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = Array.from({ length: 6 });

  return (
    <section className="bg-[#BA846E] py-4 overflow-hidden">
      <div ref={containerRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((_, i) => (
          <span
            key={i}
            className="text-white text-lg lg:text-xl tracking-wide shrink-0 mx-10"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
