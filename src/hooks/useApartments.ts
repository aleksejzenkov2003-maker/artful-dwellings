import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Apartment {
  id: string;
  complex_id: string;
  room_type: string;
  area: number;
  floor: number;
  price: number;
  status: string;
  layout_image: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useApartmentsByComplex(complexId: string | undefined) {
  return useQuery({
    queryKey: ["apartments", complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("complex_id", complexId)
        .eq("is_published", true)
        .order("room_type", { ascending: true });
      
      if (error) throw error;
      return data as Apartment[];
    },
    enabled: !!complexId,
  });
}

export function useApartmentStats(complexId: string | undefined) {
  return useQuery({
    queryKey: ["apartment-stats", complexId],
    queryFn: async () => {
      if (!complexId) return null;
      const { data, error } = await supabase
        .from("apartments")
        .select("room_type, area, price, status")
        .eq("complex_id", complexId)
        .eq("is_published", true)
        .eq("status", "available");
      
      if (error) throw error;
      
      // Calculate stats by room type
      const stats: Record<string, { count: number; minArea: number; maxArea: number; minPrice: number }> = {};
      let totalAvailable = 0;
      
      data.forEach((apt) => {
        totalAvailable++;
        if (!stats[apt.room_type]) {
          stats[apt.room_type] = {
            count: 0,
            minArea: Infinity,
            maxArea: 0,
            minPrice: Infinity,
          };
        }
        stats[apt.room_type].count++;
        stats[apt.room_type].minArea = Math.min(stats[apt.room_type].minArea, apt.area);
        stats[apt.room_type].maxArea = Math.max(stats[apt.room_type].maxArea, apt.area);
        stats[apt.room_type].minPrice = Math.min(stats[apt.room_type].minPrice, apt.price);
      });
      
      return { stats, totalAvailable };
    },
    enabled: !!complexId,
  });
}

// Admin hooks
export function useAllApartmentsByComplex(complexId: string | undefined) {
  return useQuery({
    queryKey: ["admin-apartments", complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("complex_id", complexId)
        .order("room_type", { ascending: true })
        .order("floor", { ascending: true });
      
      if (error) throw error;
      return data as Apartment[];
    },
    enabled: !!complexId,
  });
}

export function useCreateApartment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (apartment: Omit<Apartment, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("apartments")
        .insert(apartment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-apartments", variables.complex_id] });
      queryClient.invalidateQueries({ queryKey: ["apartments", variables.complex_id] });
      queryClient.invalidateQueries({ queryKey: ["apartment-stats", variables.complex_id] });
    },
  });
}

export function useUpdateApartment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Apartment> & { id: string }) => {
      const { data, error } = await supabase
        .from("apartments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-apartments", data.complex_id] });
      queryClient.invalidateQueries({ queryKey: ["apartments", data.complex_id] });
      queryClient.invalidateQueries({ queryKey: ["apartment-stats", data.complex_id] });
    },
  });
}

export function useDeleteApartment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, complexId }: { id: string; complexId: string }) => {
      const { error } = await supabase
        .from("apartments")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return complexId;
    },
    onSuccess: (complexId) => {
      queryClient.invalidateQueries({ queryKey: ["admin-apartments", complexId] });
      queryClient.invalidateQueries({ queryKey: ["apartments", complexId] });
      queryClient.invalidateQueries({ queryKey: ["apartment-stats", complexId] });
    },
  });
}
