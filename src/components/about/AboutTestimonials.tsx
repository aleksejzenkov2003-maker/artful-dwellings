import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const getVideoEmbed = (url: string) => {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1` };
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
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

  const displayReviews = reviews?.filter(r => r.source_url || r.author_photo) || [];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <div className="relative mb-12">
          {/* Decorative quotation mark - top left */}
          <span className="text-6xl lg:text-7xl font-serif text-muted-foreground/30 absolute -top-8 left-0 leading-none">"</span>
          <h2 className="text-3xl lg:text-4xl font-serif text-center">
            Слово нашим клиентам
          </h2>
        </div>

        {/* Video cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[4/3]" />
            ))}
          </div>
        ) : displayReviews.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {displayReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex-shrink-0 w-[300px] md:w-[380px] relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
                    onClick={() => review.source_url && handleVideoPlay(review.source_url)}
                  >
                    {review.author_photo ? (
                      <img
                        src={review.author_photo}
                        alt={review.author_name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Name top-left */}
                    <div className="absolute top-4 left-4">
                      <h3 className="text-white font-serif text-lg">{review.author_name}</h3>
                    </div>

                    {/* Play button - top right, teal circle */}
                    {review.source_url && (
                      <button className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </button>
                    )}

                    {/* Caption bottom */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/80 text-xs">
                        {review.author_role || review.content?.substring(0, 50)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 w-32 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-accent rounded-full" />
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Отзывы скоро появятся</p>
          </div>
        )}
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
              return <video src={video.embedUrl} controls autoPlay className="w-full h-full" />;
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
