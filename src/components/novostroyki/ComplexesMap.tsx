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
    // Load Yandex Maps API if not loaded (free version without API key for display)
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
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

    // Get complexes with coordinates
    const complexesWithCoords = complexes.filter(
      (c) => c.coordinates && typeof c.coordinates === "object" && "lat" in c.coordinates
    );

    console.log("Complexes with coordinates:", complexesWithCoords.length, "of", complexes.length);

    // Default center - St. Petersburg
    const defaultCenter = [59.9343, 30.3351];
    
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

    // Add placemarks for each complex with coordinates
    complexesWithCoords.forEach((complex) => {
      const coords = complex.coordinates as { lat: number; lng: number };

      const priceText = complex.price_from
        ? `от ${(complex.price_from / 1_000_000).toFixed(1)} млн ₽`
        : "";

      const placemark = new window.ymaps.Placemark(
        [coords.lat, coords.lng],
        {
          balloonContentHeader: `<a href="/novostroyki/${complex.slug}" style="color: #14b8a6; text-decoration: none; font-weight: 600;">${complex.name}</a>`,
          balloonContentBody: `
            <div style="max-width: 250px;">
              ${complex.main_image ? `<img src="${complex.main_image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ""}
              <p style="margin: 4px 0; color: #666; font-size: 13px;">${complex.address || ""}</p>
              <p style="margin: 4px 0; font-weight: 600; color: #14b8a6; font-size: 15px;">${priceText}</p>
            </div>
          `,
          hintContent: complex.name,
        },
        {
          preset: "islands#darkGreenDotIcon",
        }
      );

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

  // Show message if no complexes have coordinates
  const complexesWithCoords = complexes.filter(
    (c) => c.coordinates && typeof c.coordinates === "object" && "lat" in c.coordinates
  );

  return (
    <div className="relative">
      {complexesWithCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10 rounded-xl">
          <p className="text-muted-foreground text-center px-4">
            Координаты для объектов не заданы.<br />
            Запустите геокодирование в панели администратора.
          </p>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-xl overflow-hidden bg-muted"
      />
    </div>
  );
}
