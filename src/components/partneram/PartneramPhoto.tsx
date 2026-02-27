import { useEffect, useRef } from "react";
import partneramPhoto from "@/assets/partneram-photo.svg";

export function PartneramPhoto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !imgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only animate when section is in viewport
      if (rect.bottom < 0 || rect.top > windowH) return;

      // Progress: 0 when section enters bottom, 1 when it leaves top
      const progress = 1 - (rect.bottom / (windowH + rect.height));
      // Shift image upward by up to 60px as user scrolls down
      const translateY = -(progress * 60);
      imgRef.current.style.transform = `translateY(${translateY}px) scale(1.08)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden">
      <div className="overflow-hidden">
        <img
          ref={imgRef}
          src={partneramPhoto}
          alt="Недвижимость Art Estate"
          className="w-full h-auto will-change-transform transition-transform duration-100 ease-out scale-[1.08]"
        />
      </div>
    </section>
  );
}
