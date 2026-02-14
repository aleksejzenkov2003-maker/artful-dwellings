import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexExcursionFormProps {
  complex: ResidentialComplex;
}

export function ComplexExcursionForm({ complex }: ComplexExcursionFormProps) {
  return (
    <UnifiedConsultationForm
      title="Запишитесь на экскурсию"
      subtitle={`Бесплатная экскурсия по ЖК «${complex.name}»`}
      formSource={`ЖК ${complex.name}`}
      formType="excursion"
      buttonText="ЗАПИСАТЬСЯ НА ЭКСКУРСИЮ"
    />
  );
}
