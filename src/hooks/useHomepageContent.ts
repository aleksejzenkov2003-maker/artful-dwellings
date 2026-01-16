import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageContent {
  id: string;
  city_id: string | null;
  section_key: string;
  content: Record<string, any>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useHomepageContent(sectionKey: string, cityId?: string | null) {
  return useQuery({
    queryKey: ["homepage-content", sectionKey, cityId],
    queryFn: async () => {
      let query = supabase
        .from("homepage_content")
        .select("*")
        .eq("section_key", sectionKey)
        .eq("is_published", true);

      if (cityId) {
        query = query.eq("city_id", cityId);
      } else {
        query = query.is("city_id", null);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data as HomepageContent | null;
    },
  });
}

export function useAllHomepageContent(cityId?: string | null) {
  return useQuery({
    queryKey: ["homepage-content", "all", cityId],
    queryFn: async () => {
      let query = supabase
        .from("homepage_content")
        .select("*");

      if (cityId) {
        query = query.eq("city_id", cityId);
      } else {
        query = query.is("city_id", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as HomepageContent[];
    },
  });
}

export function useUpdateHomepageContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cityId,
      sectionKey,
      content,
    }: {
      cityId: string | null;
      sectionKey: string;
      content: Record<string, any>;
    }) => {
      // First check if record exists
      let query = supabase
        .from("homepage_content")
        .select("id")
        .eq("section_key", sectionKey);

      if (cityId) {
        query = query.eq("city_id", cityId);
      } else {
        query = query.is("city_id", null);
      }

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("homepage_content")
          .update({ content, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("homepage_content")
          .insert({
            city_id: cityId,
            section_key: sectionKey,
            content,
            is_published: true,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-content"] });
    },
  });
}
