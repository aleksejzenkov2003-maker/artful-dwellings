import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

interface ComplexContactFormProps {
  complexName: string;
  complexSlug: string;
}

export const ComplexContactForm = ({ complexName, complexSlug }: ComplexContactFormProps) => {
  return (
    <UnifiedConsultationForm
      variant="compact"
      title="Записаться на просмотр"
      subtitle={`Оставьте заявку и мы организуем экскурсию в ЖК «${complexName}»`}
      formSource={`/novostroyki/${complexSlug}`}
      formType="complex_inquiry"
      buttonText="ЗАПИСАТЬСЯ НА ПРОСМОТР"
    />
  );
};
