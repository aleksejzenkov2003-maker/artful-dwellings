import { Layout } from "@/components/layout/Layout";
import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";
import { PartneramHero } from "@/components/partneram/PartneramHero";
import { PartneramMarquee } from "@/components/partneram/PartneramMarquee";
import { PartneramHighlights } from "@/components/partneram/PartneramHighlights";
import { PartneramPhoto } from "@/components/partneram/PartneramPhoto";
import { PartneramAbout } from "@/components/partneram/PartneramAbout";
import { PartneramGrid } from "@/components/partneram/PartneramGrid";
import { PartneramProcess } from "@/components/partneram/PartneramProcess";
import { PartneramStats } from "@/components/partneram/PartneramStats";
import { PartneramGuarantee } from "@/components/partneram/PartneramGuarantee";
import { PartneramTelegram } from "@/components/partneram/PartneramTelegram";

const Partneram = () => {
  return (
    <Layout>
      <PartneramHero />

      <PartneramMarquee />

      <PartneramHighlights />

      <PartneramPhoto />

      <PartneramAbout />

      <PartneramGrid />

      <PartneramProcess />

      <PartneramStats />

      <PartneramGuarantee />

      <div id="partner-form">
        <UnifiedConsultationForm
          title="Стать партнёром"
          subtitle={"Заполните заявку и мы свяжемся\nдля обсуждения условий сотрудничества"}
          formSource="/partneram"
          formType="partner"
          buttonText="СТАТЬ ПАРТНЁРОМ"
        />
      </div>

      <PartneramTelegram />
    </Layout>
  );
};

export default Partneram;
