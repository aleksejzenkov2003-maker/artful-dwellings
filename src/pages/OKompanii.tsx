import { Layout } from "@/components/layout/Layout";
import {
  AboutHero,
  AboutServices,
  AboutCertificates,
  AboutAdvantages,
  AboutTeamCarousel,
  AboutTestimonials,
  AboutConsultationForm,
  AboutTimeline,
} from "@/components/about";

const OKompanii = () => {
  return (
    <Layout>
      <AboutHero />
      <AboutServices />
      <AboutCertificates />
      <AboutAdvantages />
      <AboutTeamCarousel />
      <AboutTimeline />
      <AboutTestimonials />
      <AboutConsultationForm />
    </Layout>
  );
};

export default OKompanii;
