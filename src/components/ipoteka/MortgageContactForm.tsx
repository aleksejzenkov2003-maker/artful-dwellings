import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

export function MortgageContactForm() {
  return (
    <UnifiedConsultationForm
      title="Получите консультацию по ипотеке"
      subtitle={"Наш специалист поможет подобрать\nлучшие условия кредитования"}
      formSource="Страница ипотеки"
      formType="mortgage"
      buttonText="ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ"
    />
  );
}
