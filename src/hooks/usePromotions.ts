import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  cover_image: string | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  complexes: string[];
}

export const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_published", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Promotion[];
    },
  });
};

export const usePromotion = (slug: string) => {
  return useQuery({
    queryKey: ["promotion", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as Promotion | null;
    },
    enabled: !!slug,
  });
};
