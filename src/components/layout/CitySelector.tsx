import { useState } from "react";
import { ChevronDown, MapPin, Check } from "lucide-react";
import { useCity } from "@/contexts/CityContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CitySelectorProps {
  variant?: "default" | "light";
}

export function CitySelector({ variant = "default" }: CitySelectorProps) {
  const { cities, currentCity, setCurrentCity, isLoading } = useCity();
  const [open, setOpen] = useState(false);

  const isLight = variant === "light";

  if (isLoading || !currentCity) {
    return (
      <div className={cn(
        "flex items-center gap-1.5 text-sm",
        isLight ? "text-white/70" : "text-muted-foreground"
      )}>
        <MapPin className="w-4 h-4" />
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-1.5 text-sm transition-colors focus:outline-none",
        isLight 
          ? "text-white/80 hover:text-white" 
          : "hover:text-primary"
      )}>
        <MapPin className={cn(
          "w-4 h-4",
          isLight ? "text-white/70" : "text-primary"
        )} />
        <span className="font-medium">{currentCity.name}</span>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {cities.map((city) => (
          <DropdownMenuItem
            key={city.id}
            onClick={() => {
              setCurrentCity(city);
              setOpen(false);
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{city.name}</span>
              <span className="text-xs text-muted-foreground">{city.country}</span>
            </div>
            {city.id === currentCity.id && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
