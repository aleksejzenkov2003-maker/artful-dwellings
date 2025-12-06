import { useCompanyStats } from "@/hooks/useCompanyStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Building2, CheckCircle, Award, TrendingUp, Home, Briefcase } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  users: Users,
  building: Building2,
  "check-circle": CheckCircle,
  award: Award,
  "trending-up": TrendingUp,
  home: Home,
  briefcase: Briefcase,
};

interface StatsSectionProps {
  variant?: "primary" | "secondary";
  className?: string;
}

export const StatsSection = ({ variant = "primary", className = "" }: StatsSectionProps) => {
  const { data: stats, isLoading } = useCompanyStats();

  const bgClass = variant === "primary" 
    ? "bg-primary text-primary-foreground" 
    : "bg-secondary";

  if (isLoading) {
    return (
      <section className={`py-12 ${bgClass} ${className}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-3 rounded-full" />
                <Skeleton className="h-10 w-20 mx-auto mb-1" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${bgClass} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon ? iconMap[stat.icon] : null;
            return (
              <div key={stat.id} className="text-center">
                {IconComponent && (
                  <IconComponent className={`h-8 w-8 mx-auto mb-3 ${variant === "primary" ? "opacity-80" : "text-primary"}`} />
                )}
                <div className={`text-3xl md:text-4xl font-serif font-bold mb-1 ${variant === "secondary" ? "text-foreground" : ""}`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className={`text-sm ${variant === "primary" ? "opacity-80" : "text-muted-foreground"}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
