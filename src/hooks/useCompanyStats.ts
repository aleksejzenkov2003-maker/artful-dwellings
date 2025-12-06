import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyStat {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  order_position: number | null;
}

export const useCompanyStats = () => {
  return useQuery({
    queryKey: ["company-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_stats")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) throw error;
      return data as CompanyStat[];
    },
  });
};
