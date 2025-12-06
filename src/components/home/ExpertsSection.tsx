import { useTeamMembers } from "@/hooks/useTeamMembers";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ExpertsSection() {
  const { data: team } = useTeamMembers();
  const displayTeam = team?.slice(0, 3) || [];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Команда экспертов
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Опытные переговорщики на вашей стороне — не понравит. Мы сделаем все возможное, 
          чтобы вы купили квартиру на самых выгодных условиях.
        </p>

        <div className="relative">
          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-10 h-10 border border-border flex items-center justify-center hover:border-primary transition-colors z-10 bg-background">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-10 h-10 border border-border flex items-center justify-center hover:border-primary transition-colors z-10 bg-background">
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 lg:px-16">
            {displayTeam.length > 0 ? (
              displayTeam.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative mb-6 overflow-hidden">
                    <img
                      src={member.photo_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop`}
                      alt={member.name}
                      className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-lg mb-1">{member.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              ))
            ) : (
              // Placeholder team members
              [
                { name: "Елена Максимова", role: "Ведущий специалист агентства Art Estate" },
                { name: "Виктор Борисов", role: "Брокер-аналитик Art Estate" },
                { name: "Илья Кириллов", role: "Ведущий специалист агентства Art Estate" },
              ].map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        index === 0 ? '1573496359142-b8d87734a5a2' :
                        index === 1 ? '1472099645785-5658abf4ff4e' :
                        '1519085360753-af0119f7cbe7'
                      }?w=400&h=500&fit=crop`}
                      alt={member.name}
                      className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-lg mb-1">{member.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
