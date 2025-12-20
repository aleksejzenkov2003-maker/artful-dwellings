import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitLead } from "@/hooks/useSubmitLead";
import { toast } from "sonner";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexExcursionFormProps {
  complex: ResidentialComplex;
}

export function ComplexExcursionForm({ complex }: ComplexExcursionFormProps) {
  const [phone, setPhone] = useState("");
  const { mutate: submitLead, isPending } = useSubmitLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Введите номер телефона");
      return;
    }
    submitLead({
      name: "Заявка на экскурсию",
      phone,
      form_type: "excursion",
      form_source: `ЖК ${complex.name}`,
    });
    setPhone("");
  };

  return (
    <section className="py-12 lg:py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Title */}
          <h2 className="font-serif font-normal text-[24px] md:text-[28px] lg:text-[32px] leading-[1.2]">
            Отправьте заявку на бесплатную экскурсию
          </h2>

          {/* Form */}
          <div className="flex gap-4 w-full lg:w-auto">
            <Input
              type="tel"
              placeholder="ВАШ ТЕЛЕФОН"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full lg:w-72 uppercase text-[12px] tracking-wider border-border"
            />
            <Button 
              type="submit" 
              variant="outline"
              disabled={isPending}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-[12px] px-6 whitespace-nowrap"
            >
              {isPending ? "Отправка..." : "Отправить запрос"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
