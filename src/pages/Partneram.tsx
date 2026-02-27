import { Layout } from "@/components/layout/Layout";
import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";
import { PartneramHero } from "@/components/partneram/PartneramHero";
import { PartneramMarquee } from "@/components/partneram/PartneramMarquee";
import { PartneramHighlights } from "@/components/partneram/PartneramHighlights";

const Partneram = () => {
  return (
    <Layout>
      <PartneramHero />

      <PartneramMarquee />

      <PartneramHighlights />

      <div id="partner-form">
        <UnifiedConsultationForm
          title="Стать партнёром"
          subtitle={"Заполните заявку и мы свяжемся\nдля обсуждения условий сотрудничества"}
          formSource="/partneram"
          formType="partner"
          buttonText="СТАТЬ ПАРТНЁРОМ"
        />
      </div>
    </Layout>
  );
};

export default Partneram;
