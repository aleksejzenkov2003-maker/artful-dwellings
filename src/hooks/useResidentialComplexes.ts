import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useCity } from "@/contexts/CityContext";

export type ResidentialComplex = Tables<"residential_complexes">;

export function useResidentialComplexes(options?: {
  featured?: boolean;
  limit?: number;
  propertyType?: "new" | "secondary";
}) {
  const { currentCity } = useCity();

  return useQuery({
    queryKey: ["residential_complexes", options, currentCity?.id],
    queryFn: async () => {
      let query = supabase
        .from("residential_complexes")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      // Filter by property type
      if (options?.propertyType === "new") {
        query = query.in("status", ["building", "pre-sale", "сдан"]);
      } else if (options?.propertyType === "secondary") {
        query = query.eq("status", "secondary");
      }

      // Filter by city
      if (currentCity?.id) {
        query = query.eq("city_id", currentCity.id);
      }

      if (options?.featured) {
        query = query.eq("is_featured", true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ResidentialComplex[];
    },
    enabled: !!currentCity,
  });
}

export function useResidentialComplex(slug: string) {
  return useQuery({
    queryKey: ["residential_complex", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("residential_complexes")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data as ResidentialComplex | null;
    },
    enabled: !!slug,
  });
}
