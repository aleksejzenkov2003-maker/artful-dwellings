import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Service = Tables<"services">;

export function useServiceBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data as Service | null;
    },
    enabled: !!slug,
  });
}
