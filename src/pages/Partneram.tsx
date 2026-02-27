import { Layout } from "@/components/layout/Layout";
import { UnifiedConsultationForm } from "@/components/shared/UnifiedConsultationForm";
import { PartneramHero } from "@/components/partneram/PartneramHero";
import partneramGrid from "@/assets/partneram-grid.png";

const Partneram = () => {
  return (
    <Layout>
      <PartneramHero />

      {/* Кому подойдет программа */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
          <img
            src={partneramGrid}
            alt="Кому подойдет программа — партнёрская сетка"
            className="w-full h-auto"
          />
        </div>
      </section>

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
