import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCity } from "@/contexts/CityContext";
import type { Json } from "@/integrations/supabase/types";

export interface CityContact {
  id: string;
  phone: string;
  phone_secondary: string | null;
  email: string | null;
  address: string | null;
  working_hours: string | null;
  whatsapp: string | null;
  telegram: string | null;
  coordinates: { lat: number; lng: number } | null;
}

function parseCoordinates(coords: Json | null): { lat: number; lng: number } | null {
  if (!coords || typeof coords !== "object" || Array.isArray(coords)) return null;
  const obj = coords as Record<string, unknown>;
  if (typeof obj.lat === "number" && typeof obj.lng === "number") {
    return { lat: obj.lat, lng: obj.lng };
  }
  return null;
}

export function useCityContacts() {
  const { currentCity } = useCity();

  return useQuery({
    queryKey: ["city-contacts", currentCity?.id],
    queryFn: async () => {
      if (!currentCity) return null;

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("city_id", currentCity.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        coordinates: parseCoordinates(data.coordinates),
      } as CityContact;
    },
    enabled: !!currentCity,
  });
}
