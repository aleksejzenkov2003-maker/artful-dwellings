import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ResidentialComplex = Tables<"residential_complexes">;

export function useResidentialComplexes(options?: {
  featured?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["residential_complexes", options],
    queryFn: async () => {
      let query = supabase
        .from("residential_complexes")
        .select("*")
        .order("created_at", { ascending: false });

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
        .maybeSingle();

      if (error) throw error;
      return data as ResidentialComplex | null;
    },
    enabled: !!slug,
  });
}
