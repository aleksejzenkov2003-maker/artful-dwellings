import { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Check } from "lucide-react";
import { useCity, countryFlags } from "@/contexts/CityContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CitySelectorProps {
  variant?: "default" | "light";
}

export function CitySelector({ variant = "default" }: CitySelectorProps) {
  const { citiesByCountry, countries, currentCity, setCurrentCity, isLoading } = useCity();
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

  const getFlag = (country: string) => countryFlags[country] || "🌍";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-1.5 text-sm transition-colors focus:outline-none",
        isLight 
          ? "text-white/80 hover:text-white" 
          : "hover:text-primary"
      )}>
        <span className="text-base">{getFlag(currentCity.country)}</span>
        <span className="font-medium">{currentCity.name}</span>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {countries.map((country) => {
          const countryCities = citiesByCountry[country] || [];
          
          // If only one city in country, show it directly
          if (countryCities.length === 1) {
            const city = countryCities[0];
            return (
              <DropdownMenuItem
                key={city.id}
                onClick={() => {
                  setCurrentCity(city);
                  setOpen(false);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{getFlag(country)}</span>
                  <span className="font-medium">{city.name}</span>
                </div>
                {city.id === currentCity.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            );
          }
          
          // Multiple cities - use submenu
          return (
            <DropdownMenuSub key={country}>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-base">{getFlag(country)}</span>
                  <span className="font-medium">{country}</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[180px]">
                {countryCities.map((city) => (
                  <DropdownMenuItem
                    key={city.id}
                    onClick={() => {
                      setCurrentCity(city);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">{city.name}</span>
                    {city.id === currentCity.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
