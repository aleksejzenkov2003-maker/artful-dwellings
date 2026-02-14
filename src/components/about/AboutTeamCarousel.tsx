import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

import teamMember1 from "@/assets/team-member-1.png";
import teamMember2 from "@/assets/team-member-2.png";
import teamMember3 from "@/assets/team-member-3.png";
import teamMember4 from "@/assets/team-member-4.png";

const fallbackPhotos = [teamMember1, teamMember2, teamMember3, teamMember4];

export function AboutTeamCarousel() {
  const { data: teamMembers, isLoading } = useTeamMembers();

  const displayMembers = teamMembers?.slice(0, 4) || [];

  return (
    <section className="py-16 lg:py-24 bg-[#262626] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C4956A] mb-4">
            ◆ специалисты ◆
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif">
            Команда экспертов
          </h2>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] bg-white/10" />
                <Skeleton className="h-5 w-32 mx-auto bg-white/10" />
                <Skeleton className="h-4 w-24 mx-auto bg-white/10" />
              </div>
            ))}
          </div>
        ) : displayMembers.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {displayMembers.map((member, index) => {
              const hasPage = !!member.slug;
              const photo = fallbackPhotos[index] || member.photo_url || fallbackPhotos[0];

              const content = (
                <div className="group text-center">
                  {/* Photo — cutout on dark bg, grayscale → color on hover */}
                  <div className="flex items-end justify-center mb-4 h-[400px] lg:h-[520px]">
                    <img
                      src={photo}
                      alt={member.name}
                      className="max-h-full w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  {/* Name + role */}
                  <h3 className="text-lg font-serif font-bold text-[#C4956A] mb-1">{member.name}</h3>
                  <p className="text-white/60 text-sm">{member.role}</p>
                </div>
              );

              return hasPage ? (
                <Link key={member.id} to={`/broker/${member.slug}`}>
                  {content}
                </Link>
              ) : (
                <div key={member.id}>{content}</div>
              );
            })}
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
