import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ComplexBuilding {
  id: string;
  complex_id: string;
  name: string;
  polygon_points: { x: number; y: number }[];
  plan_image: string | null;
  color: string;
  floors_count: number | null;
  order_position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useComplexBuildings(complexId: string | undefined) {
  return useQuery({
    queryKey: ["complex-buildings", complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const { data, error } = await supabase
        .from("complex_buildings")
        .select("*")
        .eq("complex_id", complexId)
        .eq("is_published", true)
        .order("order_position", { ascending: true });
      
      if (error) throw error;
      
      // Parse polygon_points from JSON
      return (data || []).map(building => ({
        ...building,
        polygon_points: Array.isArray(building.polygon_points) 
          ? building.polygon_points 
          : []
      })) as ComplexBuilding[];
    },
    enabled: !!complexId,
  });
}

// Admin hook - get all buildings including unpublished
export function useAllComplexBuildings(complexId: string | undefined) {
  return useQuery({
    queryKey: ["admin-complex-buildings", complexId],
    queryFn: async () => {
      if (!complexId) return [];
      const { data, error } = await supabase
        .from("complex_buildings")
        .select("*")
        .eq("complex_id", complexId)
        .order("order_position", { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(building => ({
        ...building,
        polygon_points: Array.isArray(building.polygon_points) 
          ? building.polygon_points 
          : []
      })) as ComplexBuilding[];
    },
    enabled: !!complexId,
  });
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (building: Omit<ComplexBuilding, "id" | "created_at" | "updated_at">) => {
      const insertData = {
        complex_id: building.complex_id,
        name: building.name,
        polygon_points: JSON.parse(JSON.stringify(building.polygon_points)),
        plan_image: building.plan_image,
        color: building.color,
        floors_count: building.floors_count,
        order_position: building.order_position,
        is_published: building.is_published,
      };
      
      const { data, error } = await supabase
        .from("complex_buildings")
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex-buildings", variables.complex_id] });
      queryClient.invalidateQueries({ queryKey: ["complex-buildings", variables.complex_id] });
    },
  });
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ComplexBuilding> & { id: string; complex_id: string }) => {
      const updateData: Record<string, unknown> = { ...updates };
      if (updates.polygon_points) {
        updateData.polygon_points = updates.polygon_points as unknown as object;
      }
      
      const { data, error } = await supabase
        .from("complex_buildings")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex-buildings", data.complex_id] });
      queryClient.invalidateQueries({ queryKey: ["complex-buildings", data.complex_id] });
    },
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, complexId }: { id: string; complexId: string }) => {
      const { error } = await supabase
        .from("complex_buildings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return complexId;
    },
    onSuccess: (complexId) => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex-buildings", complexId] });
      queryClient.invalidateQueries({ queryKey: ["complex-buildings", complexId] });
    },
  });
}

// Get apartments filtered by building
export function useApartmentsByBuilding(buildingId: string | undefined, floor?: number) {
  return useQuery({
    queryKey: ["apartments-by-building", buildingId, floor],
    queryFn: async () => {
      if (!buildingId) return [];
      
      let query = supabase
        .from("apartments")
        .select("*")
        .eq("building_id", buildingId)
        .eq("is_published", true)
        .eq("status", "available");
      
      if (floor) {
        query = query.eq("floor", floor);
      }
      
      const { data, error } = await query.order("floor", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!buildingId,
  });
}

// Get floors available in a building
export function useBuildingFloors(buildingId: string | undefined) {
  return useQuery({
    queryKey: ["building-floors", buildingId],
    queryFn: async () => {
      if (!buildingId) return [];
      
      const { data, error } = await supabase
        .from("apartments")
        .select("floor")
        .eq("building_id", buildingId)
        .eq("is_published", true)
        .eq("status", "available");
      
      if (error) throw error;
      
      // Get unique floors sorted
      const floors = [...new Set(data.map(a => a.floor))].sort((a, b) => a - b);
      return floors;
    },
    enabled: !!buildingId,
  });
}
