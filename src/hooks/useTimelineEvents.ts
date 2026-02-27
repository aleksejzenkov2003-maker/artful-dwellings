import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTimelineEvents() {
  return useQuery({
    queryKey: ["timeline-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .order("order_position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
