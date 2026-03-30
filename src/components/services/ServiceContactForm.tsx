import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";

interface ServiceContactFormProps {
  serviceTitle: string;
  serviceSlug: string;
}

export function ServiceContactForm({ serviceTitle, serviceSlug }: ServiceContactFormProps) {
  return (
    <UnifiedConsultationForm
      variant="full"
      title="Заказать услугу"
      subtitle={`Оставьте заявку и мы свяжемся с вами\nпо услуге «${serviceTitle}»`}
      formSource={`Услуга: ${serviceTitle} (${serviceSlug})`}
      formType="service"
      buttonText="ОСТАВИТЬ ЗАЯВКУ"
    />
  );
}
