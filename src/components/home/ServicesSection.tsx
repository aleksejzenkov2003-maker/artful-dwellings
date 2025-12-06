import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/useServices";
import { Loader2 } from "lucide-react";

export function ServicesSection() {
  const { data: services, isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayServices = services?.slice(0, 8) || [];

  return (
    <>
      <h2 className="text-3xl md:text-4xl font-serif mb-12">Услуги</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {displayServices.map((service, index) => (
          <Link
            to={`/uslugi/${service.slug}`}
            key={service.id}
            className="group cursor-pointer"
          >
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl md:text-3xl font-serif text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl md:text-3xl font-serif text-primary">/</span>
            </div>
            <h3 className="text-sm font-medium text-primary mb-1 group-hover:underline underline-offset-4">
              {service.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {service.short_description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/uslugi">
          <Button
            variant="outline"
            className="border-foreground/20 uppercase text-xs tracking-wider"
          >
            Все услуги
          </Button>
        </Link>
      </div>
    </>
  );
}
