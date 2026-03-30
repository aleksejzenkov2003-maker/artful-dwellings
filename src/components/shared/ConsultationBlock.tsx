import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

interface ConsultationBlockProps {
  title?: string;
  subtitle?: string;
  topic?: string;
  variant?: "dark" | "primary";
  formSource?: string;
}

export function ConsultationBlock({
  title = "Получите консультацию",
  subtitle = "И наши специалисты ответят\nна все ваши вопросы",
  formSource = "consultation_block",
}: ConsultationBlockProps) {
  return (
    <UnifiedConsultationForm
      title={title}
      subtitle={subtitle}
      formSource={formSource}
      formType="consultation"
    />
  );
}
