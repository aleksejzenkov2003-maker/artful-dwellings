import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Helper to detect video type and get embed URL
const getVideoEmbed = (url: string) => {
  if (!url) return null;
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1` };
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
  }
  
  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return { type: 'direct', embedUrl: url };
  }
  
  return { type: 'direct', embedUrl: url };
};

export function AboutTestimonials() {
  const { data: reviews, isLoading } = useReviews();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleVideoPlay = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoOpen(true);
  };

  // Filter reviews with video or use all for display
  const displayReviews = reviews?.filter(r => r.source_url || r.author_photo) || [];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif">
            Слово нашим клиентам
          </h2>
          
          {/* Navigation arrows */}
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : displayReviews.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 w-[320px] md:w-[380px] bg-card rounded-lg overflow-hidden group"
                >
                  {/* Video thumbnail */}
                  <div 
                    className="aspect-video bg-muted relative cursor-pointer"
                    onClick={() => review.source_url && handleVideoPlay(review.source_url)}
                  >
                    {review.author_photo ? (
                      <img 
                        src={review.author_photo} 
                        alt={review.author_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
                    )}
                    
                    {/* Play button */}
                    {review.source_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-serif mb-2">{review.author_name}</h3>
                    <div className="w-12 h-0.5 bg-primary mb-3" />
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground">Отзывы скоро появятся</p>
          </div>
        )}

        {/* All reviews button */}
        <div className="text-center mt-12">
          <Button variant="teal" size="lg" asChild>
            <Link to="/otzyvy">
              ВСЕ ОТЗЫВЫ
            </Link>
          </Button>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="aspect-video bg-black">
            {selectedVideo && (() => {
              const video = getVideoEmbed(selectedVideo);
              if (!video) return null;
              
              if (video.type === 'youtube' || video.type === 'vimeo') {
                return (
                  <iframe 
                    src={video.embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              
              return (
                <video 
                  src={video.embedUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full"
                />
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
