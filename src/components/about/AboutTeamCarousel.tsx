import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export function AboutTeamCarousel() {
  const { data: teamMembers, isLoading } = useTeamMembers();

  // Show first 4 team members
  const displayMembers = teamMembers?.slice(0, 4) || [];

  return (
    <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">
            ◆ специалисты ◆
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif">
            Команда экспертов
          </h2>
        </div>

        {/* 4-column grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] bg-white/10" />
                <Skeleton className="h-5 w-32 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
            ))}
          </div>
        ) : displayMembers.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {displayMembers.map((member) => {
              const hasPage = !!member.slug;
              
              const content = (
                <div className="group">
                  {/* Photo */}
                  <div className="aspect-[3/4] bg-white/5 overflow-hidden mb-4">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-serif text-white/20">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Name + role */}
                  <h3 className="text-lg font-serif text-white mb-1">{member.name}</h3>
                  <p className="text-white/50 text-sm">{member.role}</p>
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
