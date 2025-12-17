import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyStat {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  order_position: number | null;
  city_id: string | null;
}

export const useCompanyStats = (cityId?: string | null) => {
  return useQuery({
    queryKey: ["company-stats", cityId],
    queryFn: async () => {
      let query = supabase
        .from("company_stats")
        .select("*")
        .eq("is_published", true)
        .order("order_position", { ascending: true });

      // Get stats that are either global (no city_id) or for the specific city
      if (cityId) {
        query = query.or(`city_id.is.null,city_id.eq.${cityId}`);
      } else {
        query = query.is("city_id", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as CompanyStat[];
    },
  });
};

// Hook to get count of residential complexes for current city
export const useCityComplexesCount = (cityId?: string | null) => {
  return useQuery({
    queryKey: ["city-complexes-count", cityId],
    queryFn: async () => {
      let query = supabase
        .from("residential_complexes")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true);

      if (cityId) {
        query = query.eq("city_id", cityId);
      }

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    },
  });
};