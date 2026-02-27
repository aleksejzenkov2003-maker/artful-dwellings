import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Award {
  id: string;
  title: string;
  image_url: string;
  order_position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useAwards(publishedOnly = true) {
  return useQuery({
    queryKey: ["awards", publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from("awards" as any)
        .select("*")
        .order("order_position", { ascending: true });

      if (publishedOnly) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as Award[];
    },
  });
}
