import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
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
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <span className="text-5xl lg:text-6xl font-serif text-primary/30 block mb-4">"</span>
          <h2 className="text-3xl lg:text-4xl font-serif">
            Слово нашим клиентам
          </h2>
        </div>

        {/* Carousel with side arrows */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3]" />
              </div>
            ))}
          </div>
        ) : displayReviews.length > 0 ? (
          <div className="relative">
            {/* Arrow Left - minimal style */}
            <button 
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-8 z-10 p-2 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            
            {/* Carousel */}
            <div className="overflow-hidden mx-8 lg:mx-12" ref={emblaRef}>
              <div className="flex gap-6">
                {displayReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="flex-shrink-0 w-[320px] md:w-[400px] relative aspect-[4/3] overflow-hidden group cursor-pointer"
                    onClick={() => review.source_url && handleVideoPlay(review.source_url)}
                  >
                    {/* Background image/video thumbnail */}
                    {review.author_photo ? (
                      <img 
                        src={review.author_photo} 
                        alt={review.author_name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
                    )}
                    
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Content at bottom */}
                    <div className="absolute bottom-0 left-0 right-16 p-6">
                      <h3 className="text-2xl font-serif text-white mb-2">
                        {review.author_name}
                      </h3>
                      <div className="w-10 h-0.5 bg-primary mb-3" />
                      <p className="text-xs uppercase tracking-wider text-white/80 line-clamp-2">
                        {review.author_role || review.content?.substring(0, 60)}
                      </p>
                    </div>
                    
                    {/* Play button - bottom right with teal border */}
                    {review.source_url && (
                      <button className="absolute bottom-6 right-6 w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Play className="w-5 h-5 text-primary fill-primary/30 ml-0.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Arrow Right - minimal style */}
            <button 
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-8 z-10 p-2 hover:text-primary transition-colors"
            >
              <ArrowRight className="w-8 h-8" />
            </button>
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
