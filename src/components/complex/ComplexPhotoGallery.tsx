import { useState } from "react";
import { HexagonPattern } from "@/components/ui/HexagonPattern";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexPhotoGalleryProps {
  complex: ResidentialComplex;
}

export function ComplexPhotoGallery({ complex }: ComplexPhotoGalleryProps) {
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");

  const images = complex.main_image 
    ? [complex.main_image, ...(Array.isArray(complex.images) ? complex.images as string[] : [])]
    : (Array.isArray(complex.images) ? complex.images as string[] : ["/placeholder.svg"]);

  return (
    <section id="photo" className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Hexagon Pattern - Right Side */}
      <HexagonPattern className="top-0 right-0 w-64 h-96" />
      
      <div className="container mx-auto px-4 lg:px-8">
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8">
          {/* Left Sidebar - Vertical Labels */}
          <div className="hidden lg:flex flex-col gap-4">
            <button
              onClick={() => setMediaType("photo")}
              className={`font-serif text-[48px] leading-none transition-colors ${
                mediaType === "photo" ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
              Фото
            </button>
            <div className="h-px w-8 bg-foreground mx-auto" />
            <button
              onClick={() => setMediaType("video")}
              className={`font-serif text-[48px] leading-none transition-colors ${
                mediaType === "video" ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
              Видео
            </button>
          </div>

          {/* Masonry Image Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large Image - Left Column */}
            {images[0] && (
              <div className="col-span-1 row-span-2">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={images[0]} 
                    alt={`${complex.name} - фото 1`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}
            
            {/* Top Right Images */}
            {images[1] && (
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={images[1]} 
                  alt={`${complex.name} - фото 2`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            {images[2] && (
              <div className="aspect-square overflow-hidden">
                <img 
                  src={images[2]} 
                  alt={`${complex.name} - фото 3`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            
            {/* Bottom Row */}
            {images[3] && (
              <div className="col-span-2 aspect-[16/9] overflow-hidden">
                <img 
                  src={images[3]} 
                  alt={`${complex.name} - фото 4`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            
            {/* Right Column Images */}
            {images[4] && (
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={images[4]} 
                  alt={`${complex.name} - фото 5`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            {images.slice(5, 7).map((image, index) => (
              <div key={index} className="aspect-[4/3] overflow-hidden">
                <img 
                  src={image} 
                  alt={`${complex.name} - фото ${index + 6}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
