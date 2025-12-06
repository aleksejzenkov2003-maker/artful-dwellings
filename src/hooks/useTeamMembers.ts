import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useCity } from "@/contexts/CityContext";

export type TeamMember = Tables<"team_members">;

export function useTeamMembers() {
  const { currentCity } = useCity();

  return useQuery({
    queryKey: ["team_members", currentCity?.id],
    queryFn: async () => {
      let query = supabase
        .from("team_members")
        .select("*")
        .eq("is_published", true)
        .order("order_position", { ascending: true });

      // Filter by city if available, or show all if no city_id set
      if (currentCity?.id) {
        query = query.or(`city_id.eq.${currentCity.id},city_id.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!currentCity,
  });
}
