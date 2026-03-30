import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

type LeadInsert = TablesInsert<"leads">;

export function useSubmitLead() {
  return useMutation({
    mutationFn: async (lead: LeadInsert) => {
      const { data, error } = await supabase
        .from("leads")
        .insert(lead)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
    },
    onError: (error) => {
      console.error("Error submitting lead:", error);
      toast.error("Ошибка при отправке заявки. Попробуйте позже.");
    },
  });
}
