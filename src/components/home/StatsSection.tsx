import { useCompanyStats, useCityComplexesCount } from "@/hooks/useCompanyStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Building2, CheckCircle, Award, TrendingUp, Home, Briefcase } from "lucide-react";
import { useCity } from "@/contexts/CityContext";

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
  showComplexesCount?: boolean;
}

export const StatsSection = ({ variant = "primary", className = "", showComplexesCount = true }: StatsSectionProps) => {
  const { currentCity } = useCity();
  const { data: stats, isLoading } = useCompanyStats(currentCity?.id);
  const { data: complexesCount } = useCityComplexesCount(currentCity?.id);

  const bgClass = variant === "primary" 
    ? "bg-primary text-primary-foreground" 
    : "bg-secondary";

  if (isLoading) {
    return (
      <section className={`py-12 ${bgClass} ${className}`}>
        <div className="container-wide">
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

  // Create dynamic stats array with complexes count if enabled
  const displayStats = [...(stats || [])];
  
  // Add dynamic complexes count stat if enabled and we have data
  if (showComplexesCount && complexesCount !== undefined && complexesCount > 0) {
    // Check if we already have a "complexes" stat to avoid duplicates
    const hasComplexesStat = displayStats.some(s => s.icon === 'building' && s.label.toLowerCase().includes('жк'));
    
    if (!hasComplexesStat) {
      displayStats.unshift({
        id: 'dynamic-complexes',
        label: currentCity ? `ЖК в ${currentCity.name}` : 'Жилых комплексов',
        value: String(complexesCount),
        suffix: null,
        icon: 'building',
        order_position: -1,
        city_id: currentCity?.id || null,
      });
    }
  }

  if (displayStats.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${bgClass} ${className}`}>
      <div className="container-wide">
        <div className={`grid grid-cols-2 ${displayStats.length >= 4 ? 'md:grid-cols-4' : `md:grid-cols-${displayStats.length}`} gap-8`}>
          {displayStats.map((stat) => {
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