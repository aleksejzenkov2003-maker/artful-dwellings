import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

export function ConsultationSection() {
  return (
    <UnifiedConsultationForm
      title="Получите консультацию"
      subtitle={"И наши специалисты ответят\nна все ваши вопросы"}
      formSource="Главная страница - консультация"
      formType="consultation"
    />
  );
}
