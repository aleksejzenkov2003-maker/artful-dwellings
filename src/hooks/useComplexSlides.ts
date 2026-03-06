import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ComplexSlide {
  id: string;
  complex_id: string;
  slide_type: string;
  title: string;
  description: string | null;
  image_url: string | null;
  order_position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const SLIDE_TYPES = [
  { value: "architecture", label: "Архитектура" },
  { value: "landscaping", label: "Благоустройство" },
  { value: "courtyard", label: "Двор" },
  { value: "art_objects", label: "Арт-объекты" },
  { value: "wellness", label: "Wellness" },
] as const;

export function useComplexSlides(complexId: string | undefined) {
  return useQuery({
    queryKey: ["complex-slides", complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const { data, error } = await supabase
        .from("complex_slides" as any)
        .select("*")
        .eq("complex_id", complexId)
        .eq("is_published", true)
        .order("order_position");
      if (error) throw error;
      return (data || []) as unknown as ComplexSlide[];
    },
    enabled: !!complexId,
  });
}

export function useAllComplexSlides(complexId: string | undefined) {
  return useQuery({
    queryKey: ["admin-complex-slides", complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const { data, error } = await supabase
        .from("complex_slides" as any)
        .select("*")
        .eq("complex_id", complexId)
        .order("order_position");
      if (error) throw error;
      return (data || []) as unknown as ComplexSlide[];
    },
    enabled: !!complexId,
  });
}

export function useCreateSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slide: Omit<ComplexSlide, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("complex_slides" as any)
        .insert(slide as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex-slides"] });
      queryClient.invalidateQueries({ queryKey: ["complex-slides"] });
    },
  });
}

export function useUpdateSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<ComplexSlide> & { id: string }) => {
      const { error } = await supabase
        .from("complex_slides" as any)
        .update(data as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex-slides"] });
      queryClient.invalidateQueries({ queryKey: ["complex-slides"] });
    },
  });
}

export function useDeleteSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("complex_slides" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex-slides"] });
      queryClient.invalidateQueries({ queryKey: ["complex-slides"] });
    },
  });
}
