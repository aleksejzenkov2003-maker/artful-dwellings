import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function AboutTeamCarousel() {
  const { data: teamMembers, isLoading } = useTeamMembers();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif mb-2">
            Команда экспертов
          </h2>
          <div className="w-20 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-white/60 italic">
            Опытный переговорщик на вашей стороне!
          </p>
        </div>

        {/* Carousel with side arrows */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] bg-white/10" />
                <Skeleton className="h-6 w-32 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
            ))}
          </div>
        ) : teamMembers && teamMembers.length > 0 ? (
          <div className="relative">
            {/* Arrow Left */}
            <button 
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            {/* Carousel */}
            <div className="overflow-hidden mx-8 lg:mx-16" ref={emblaRef}>
              <div className="flex gap-6">
                {teamMembers.map((member) => {
                  const hasPage = !!member.slug;
                  
                  const CardContent = (
                    <div className="flex-shrink-0 w-[320px] md:w-[380px] group cursor-pointer">
                      {/* Photo - no rounded corners, larger */}
                      <div className="aspect-[3/4] bg-muted/20 overflow-hidden">
                        {member.photo_url ? (
                          <img 
                            src={member.photo_url} 
                            alt={member.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-6xl font-serif text-white/30">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Info - shown on hover */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-serif text-white mb-1">{member.name}</h3>
                        <p className="text-white/50 text-sm">{member.role}</p>
                        
                        {hasPage && (
                          <div className="mt-3 flex items-center text-primary text-sm group-hover:gap-2 transition-all">
                            <span>Подробнее</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return hasPage ? (
                    <Link key={member.id} to={`/broker/${member.slug}`}>
                      {CardContent}
                    </Link>
                  ) : (
                    <div key={member.id}>
                      {CardContent}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Arrow Right */}
            <button 
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/50">Информация о команде скоро появится</p>
          </div>
        )}
      </div>
    </section>
  );
}
