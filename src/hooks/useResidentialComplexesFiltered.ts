import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ResidentialComplex } from "./useResidentialComplexes";
import { useCity } from "@/contexts/CityContext";

export type SortOption = "default" | "price_asc" | "price_desc" | "address_asc" | "address_desc";

export interface FilterOptions {
  district?: string;
  status?: string;
  priceFrom?: number;
  priceTo?: number;
  page?: number;
  limit?: number;
  sort?: SortOption;
}

export function useResidentialComplexesFiltered(options: FilterOptions = {}) {
  const { currentCity } = useCity();
  const { page = 1, limit = 9, sort = "default" } = options;

  return useQuery({
    queryKey: ["residential_complexes_filtered", options, currentCity?.id],
    queryFn: async () => {
      let query = supabase
        .from("residential_complexes")
        .select("*", { count: "exact" })
        .eq("is_published", true);

      // Apply sorting
      if (sort === "price_asc") {
        query = query.order("price_from", { ascending: true, nullsFirst: false });
      } else if (sort === "price_desc") {
        query = query.order("price_from", { ascending: false, nullsFirst: false });
      } else if (sort === "address_asc") {
        query = query.order("address", { ascending: true, nullsFirst: false });
      } else if (sort === "address_desc") {
        query = query.order("address", { ascending: false, nullsFirst: false });
      } else {
        query = query
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });
      }

      // Filter by city if available
      if (currentCity?.id) {
        query = query.eq("city_id", currentCity.id);
      }

      if (options.district && options.district !== "all") {
        query = query.eq("district", options.district);
      }

      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      if (options.priceFrom) {
        query = query.gte("price_from", options.priceFrom);
      }

      if (options.priceTo) {
        query = query.lte("price_from", options.priceTo);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data as ResidentialComplex[],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
      };
    },
    enabled: !!currentCity,
  });
}

export function useDistrictsList() {
  const { currentCity } = useCity();

  return useQuery({
    queryKey: ["districts_list", currentCity?.id],
    queryFn: async () => {
      let query = supabase
        .from("residential_complexes")
        .select("district")
        .eq("is_published", true)
        .not("district", "is", null);

      if (currentCity?.id) {
        query = query.eq("city_id", currentCity.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueDistricts = [
        ...new Set(data.map((item) => item.district).filter(Boolean)),
      ] as string[];

      return uniqueDistricts.sort();
    },
    enabled: !!currentCity,
  });
}
