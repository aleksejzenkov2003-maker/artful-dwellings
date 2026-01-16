import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ExpertsSection() {
  const { data: teamMembers, isLoading } = useTeamMembers();

  // Filter only members with photos for the carousel
  const displayMembers = teamMembers?.filter(m => m.photo_url) || [];

  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Команда экспертов
          </h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-zinc-400 italic font-serif text-lg max-w-2xl mx-auto">
            Опытный переговорщик на вашей стороне — не повредит. Мы сделаем всё возможное,
            чтобы вы купили квартиру на самых выгодных условиях.
          </p>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] bg-zinc-800" />
            ))}
          </div>
        ) : displayMembers.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {displayMembers.map((member) => (
                <CarouselItem key={member.id} className="pl-4 md:basis-1/3 lg:basis-1/3">
                  <ExpertCard member={member} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom navigation buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 bg-transparent border-zinc-600 text-white hover:bg-zinc-800 hover:border-primary hover:text-primary" />
              <CarouselNext className="static translate-y-0 bg-transparent border-zinc-600 text-white hover:bg-zinc-800 hover:border-primary hover:text-primary" />
            </div>
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500">Команда формируется...</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface ExpertCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    slug?: string | null;
    photo_url?: string | null;
  };
}

function ExpertCard({ member }: ExpertCardProps) {
  const hasPage = !!member.slug;
  
  const cardContent = (
    <div className="relative aspect-[3/4] overflow-hidden group cursor-pointer">
      {/* Photo */}
      <img
        src={member.photo_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600"}
        alt={member.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Info overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-medium text-xl mb-1">{member.name}</h3>
        <p className="text-zinc-300 text-sm uppercase tracking-wider mb-3">
          {member.role}
        </p>
        {hasPage && (
          <span className="inline-flex items-center text-primary text-sm font-medium">
            Подробнее
            <ChevronRight className="h-4 w-4 ml-1" />
          </span>
        )}
      </div>
    </div>
  );

  if (hasPage) {
    return (
      <Link to={`/broker/${member.slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
