import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/CityContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function TeamSection() {
  const { data: teamMembers, isLoading } = useTeamMembers();
  const { currentCity } = useCity();

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
        Команда экспертов {currentCity?.name && `в г. ${currentCity.name}`}
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
      <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12">
        Опытный переговорщик на вашей стороне — не повредит. Мы сделаем все возможное,
        чтобы вы купили квартиру на самых выгодных условиях.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="aspect-[3/4] mb-4" />
              <Skeleton className="h-5 w-32 mx-auto mb-2" />
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
          ))}
        </div>
      ) : teamMembers && teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers?.map((member) => {
            const hasPage = !!member.slug;
            const CardContent = (
              <>
                <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                  <img
                    src={member.photo_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600"}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-lg mb-1">{member.name}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {member.role}
                </p>
                {hasPage && (
                  <div className="mt-3 flex items-center justify-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Подробнее</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                )}
              </>
            );

            return hasPage ? (
              <Link 
                key={member.id} 
                to={`/broker/${member.slug}`}
                className="text-center group block"
              >
                {CardContent}
              </Link>
            ) : (
              <div key={member.id} className="text-center group">
                {CardContent}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            В городе {currentCity?.name || "—"} команда пока формируется.
          </p>
        </div>
      )}
    </div>
  );
}
