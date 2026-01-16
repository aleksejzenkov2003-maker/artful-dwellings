import { useState } from "react";
import { HexagonPattern } from "@/components/ui/HexagonPattern";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { Play } from "lucide-react";

interface MediaItem {
  url: string;
  type: "image" | "video";
  isMain?: boolean;
}

interface ComplexPhotoGalleryProps {
  complex: ResidentialComplex;
}

// Helper to extract video ID from YouTube/Rutube URLs
function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  // Rutube
  const rtMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (rtMatch) {
    return `https://rutube.ru/play/embed/${rtMatch[1]}`;
  }
  return null;
}

// Check if URL is a direct video file (mp4, webm, etc.)
function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export function ComplexPhotoGallery({ complex }: ComplexPhotoGalleryProps) {
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");

  // Parse images - can be array of strings or array of MediaItem objects
  const parseMedia = (): { photos: string[]; videos: string[] } => {
    const photos: string[] = [];
    const videos: string[] = [];
    
    // Add main_image first if exists
    if (complex.main_image) {
      photos.push(complex.main_image);
    }
    
    // Parse complex.images
    if (Array.isArray(complex.images)) {
      complex.images.forEach((item) => {
        if (typeof item === "string") {
          // Legacy format - just string URLs (assume images)
          if (!photos.includes(item)) {
            photos.push(item);
          }
        } else if (item && typeof item === "object" && !Array.isArray(item)) {
          // New format - {url, type} objects
          const mediaItem = item as unknown as MediaItem;
          if (mediaItem.url && typeof mediaItem.url === "string") {
            if (mediaItem.type === "video") {
              videos.push(mediaItem.url);
            } else {
              if (!photos.includes(mediaItem.url)) {
                photos.push(mediaItem.url);
              }
            }
          }
        }
      });
    }
    
    // If no photos at all, add placeholder
    if (photos.length === 0) {
      photos.push("/placeholder.svg");
    }
    
    return { photos, videos };
  };

  const { photos, videos } = parseMedia();
  const hasVideos = videos.length > 0;

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
              } ${!hasVideos ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
              disabled={!hasVideos}
            >
              Видео
            </button>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-4 mb-4">
            <button
              onClick={() => setMediaType("photo")}
              className={`text-lg font-medium transition-colors ${
                mediaType === "photo" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              Фото ({photos.length})
            </button>
            {hasVideos && (
              <button
                onClick={() => setMediaType("video")}
                className={`text-lg font-medium transition-colors ${
                  mediaType === "video" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
                }`}
              >
                Видео ({videos.length})
              </button>
            )}
          </div>

          {/* Photo Gallery */}
          {mediaType === "photo" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large Image - Left Column */}
              {photos[0] && (
                <div className="col-span-1 row-span-2">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <img 
                      src={photos[0]} 
                      alt={`${complex.name} - фото 1`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              )}
              
              {/* Top Right Images */}
              {photos[1] && (
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img 
                    src={photos[1]} 
                    alt={`${complex.name} - фото 2`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {photos[2] && (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={photos[2]} 
                    alt={`${complex.name} - фото 3`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              {/* Bottom Row */}
              {photos[3] && (
                <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-lg">
                  <img 
                    src={photos[3]} 
                    alt={`${complex.name} - фото 4`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              {/* Right Column Images */}
              {photos[4] && (
                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                  <img 
                    src={photos[4]} 
                    alt={`${complex.name} - фото 5`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {photos.slice(5, 7).map((photo, index) => (
                <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img 
                    src={photo} 
                    alt={`${complex.name} - фото ${index + 6}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Video Gallery */}
          {mediaType === "video" && (
            <div className="space-y-6">
              {videos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Видео пока не добавлены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {videos.map((videoUrl, index) => {
                    const embedUrl = getVideoEmbedUrl(videoUrl);
                    const isDirect = isDirectVideoUrl(videoUrl);
                    
                    return (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden bg-black">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${complex.name} - видео ${index + 1}`}
                          />
                        ) : isDirect ? (
                          <video
                            src={videoUrl}
                            className="w-full h-full object-contain"
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <a 
                              href={videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                            >
                              <Play className="h-8 w-8" />
                              Открыть видео
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
