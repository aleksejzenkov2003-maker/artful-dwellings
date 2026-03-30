import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

export function ConsultationForm() {
  return (
    <UnifiedConsultationForm
      title="Получите консультацию"
      subtitle={"И наши специалисты ответят\nна все ваши вопросы"}
      formSource="Главная страница"
      formType="consultation"
    />
  );
}
