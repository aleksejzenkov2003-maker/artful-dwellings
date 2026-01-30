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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif mb-2">
              Команда экспертов
            </h2>
            <div className="w-20 h-0.5 bg-primary mb-4" />
            <p className="text-white/60 italic">
              Опытный переговорщик на вашей стороне!
            </p>
          </div>
          
          {/* Navigation arrows */}
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
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
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {teamMembers.map((member) => {
                const hasPage = !!member.slug;
                
                const CardContent = (
                  <div className="flex-shrink-0 w-[280px] md:w-[300px] group cursor-pointer">
                    {/* Photo */}
                    <div className="aspect-[3/4] bg-muted/20 overflow-hidden mb-4 rounded-lg">
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
                    
                    {/* Info */}
                    <h3 className="text-lg font-serif text-white mb-1">{member.name}</h3>
                    <p className="text-white/50 text-sm">{member.role}</p>
                    
                    {hasPage && (
                      <div className="mt-3 flex items-center text-primary text-sm group-hover:gap-2 transition-all">
                        <span>Подробнее</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    )}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-white/50">Информация о команде скоро появится</p>
          </div>
        )}
      </div>
    </section>
  );
}
