import { useEffect, useRef, useState } from "react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexesMapProps {
  complexes: ResidentialComplex[];
  onComplexClick?: (slug: string) => void;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export function ComplexesMap({ complexes, onComplexClick }: ComplexesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Yandex Maps API if not loaded
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU";
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => setIsLoaded(true));
      };
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(() => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Get center from first complex with coordinates or default to SPb
    const defaultCenter = [59.9343, 30.3351];
    const complexesWithCoords = complexes.filter(
      (c) => c.coordinates && typeof c.coordinates === "object" && "lat" in c.coordinates
    );
    
    const center = complexesWithCoords.length > 0
      ? [
          (complexesWithCoords[0].coordinates as { lat: number; lng: number }).lat,
          (complexesWithCoords[0].coordinates as { lat: number; lng: number }).lng,
        ]
      : defaultCenter;

    // Create map
    mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
      center,
      zoom: 11,
      controls: ["zoomControl", "fullscreenControl"],
    });

    // Add placemarks for each complex
    complexes.forEach((complex) => {
      if (!complex.coordinates || typeof complex.coordinates !== "object") return;
      const coords = complex.coordinates as { lat: number; lng: number };
      if (!coords.lat || !coords.lng) return;

      const priceText = complex.price_from
        ? `от ${(complex.price_from / 1_000_000).toFixed(1)} млн ₽`
        : "";

      const placemark = new window.ymaps.Placemark(
        [coords.lat, coords.lng],
        {
          balloonContentHeader: complex.name,
          balloonContentBody: `
            <div style="max-width: 250px;">
              ${complex.main_image ? `<img src="${complex.main_image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ""}
              <p style="margin: 4px 0; color: #666; font-size: 13px;">${complex.address || ""}</p>
              <p style="margin: 4px 0; font-weight: 600; color: #14b8a6; font-size: 15px;">${priceText}</p>
              <a href="/novostroyki/${complex.slug}" style="display: inline-block; margin-top: 8px; color: #14b8a6; font-size: 14px;">Подробнее →</a>
            </div>
          `,
          hintContent: complex.name,
        },
        {
          preset: "islands#tealDotIcon",
        }
      );

      placemark.events.add("click", () => {
        if (onComplexClick) {
          onComplexClick(complex.slug);
        }
      });

      mapInstanceRef.current.geoObjects.add(placemark);
    });

    // Fit bounds if multiple markers
    if (complexesWithCoords.length > 1) {
      mapInstanceRef.current.setBounds(
        mapInstanceRef.current.geoObjects.getBounds(),
        { checkZoomRange: true, zoomMargin: 50 }
      );
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded, complexes, onComplexClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] rounded-xl overflow-hidden bg-muted"
    />
  );
}
