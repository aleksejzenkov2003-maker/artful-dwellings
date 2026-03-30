import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  is_default: boolean;
  hero_image: string | null;
}

interface CityContextType {
  cities: City[];
  citiesByCountry: Record<string, City[]>;
  countries: string[];
  currentCity: City | null;
  setCurrentCity: (city: City) => void;
  isLoading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const CITY_STORAGE_KEY = "art-estate-city";

// Country flags mapping
export const countryFlags: Record<string, string> = {
  "Россия": "🇷🇺",
  "ОАЭ": "🇦🇪",
  "Турция": "🇹🇷",
  "Кипр": "🇨🇾",
  "Таиланд": "🇹🇭",
  "Грузия": "🇬🇪",
};

export function CityProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCityState] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      const { data, error } = await supabase
        .from("cities")
        .select("id, name, slug, country, is_default, hero_image")
        .eq("is_active", true)
        .order("order_position");

      if (error) {
        console.error("Error fetching cities:", error);
        setIsLoading(false);
        return;
      }

      setCities(data || []);

      // Try to restore from localStorage
      const savedSlug = localStorage.getItem(CITY_STORAGE_KEY);
      const savedCity = data?.find((c) => c.slug === savedSlug);
      
      if (savedCity) {
        setCurrentCityState(savedCity);
      } else {
        // Use default city
        const defaultCity = data?.find((c) => c.is_default) || data?.[0];
        if (defaultCity) {
          setCurrentCityState(defaultCity);
        }
      }

      setIsLoading(false);
    }

    fetchCities();
  }, []);

  // Group cities by country
  const citiesByCountry = useMemo(() => {
    return cities.reduce((acc, city) => {
      const country = city.country || "Другое";
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(city);
      return acc;
    }, {} as Record<string, City[]>);
  }, [cities]);

  // Get unique countries in order
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(cities.map((c) => c.country || "Другое"))];
    // Put Russia first if it exists
    return uniqueCountries.sort((a, b) => {
      if (a === "Россия") return -1;
      if (b === "Россия") return 1;
      return a.localeCompare(b);
    });
  }, [cities]);

  const setCurrentCity = (city: City) => {
    setCurrentCityState(city);
    localStorage.setItem(CITY_STORAGE_KEY, city.slug);
  };

  return (
    <CityContext.Provider value={{ cities, citiesByCountry, countries, currentCity, setCurrentCity, isLoading }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
