import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ComplexGalleryProps {
  images: string[];
  mainImage?: string | null;
  complexName: string;
}

export const ComplexGallery = ({ images, mainImage, complexName }: ComplexGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const allImages = mainImage ? [mainImage, ...images.filter(img => img !== mainImage)] : images;
  
  if (allImages.length === 0) {
    return (
      <div className="aspect-[16/9] bg-secondary rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Нет изображений</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={allImages[currentIndex]}
            alt={`${complexName} - фото ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          
          {allImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
          
          <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded text-sm">
            {currentIndex + 1} / {allImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                  index === currentIndex ? "border-primary" : "border-transparent hover:border-border"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={image}
                  alt={`${complexName} - превью ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black border-none">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <img
              src={allImages[currentIndex]}
              alt={`${complexName} - фото ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
