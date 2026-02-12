import { Layout } from "@/components/layout/Layout";
import {
  AboutHero,
  AboutServices,
  AboutAdditionalServices,
  AboutCertificates,
  AboutAdvantages,
  AboutTeamCarousel,
  AboutTestimonials,
  AboutConsultationForm,
} from "@/components/about";

const OKompanii = () => {
  return (
    <Layout>
      {/* 1. Hero with title, team photo, stats */}
      <AboutHero />

      {/* 2. Services grid on brown background */}
      <AboutServices />

      {/* 3. Additional services on brown background */}
      <AboutAdditionalServices />

      {/* 4. Certificates on dark background */}
      <AboutCertificates />

      {/* 5. Advantages - Art Estate это */}
      <AboutAdvantages />

      {/* 6. Team grid on dark background */}
      <AboutTeamCarousel />

      {/* 7. Video testimonials */}
      <AboutTestimonials />

      {/* 8. Consultation form */}
      <AboutConsultationForm />
    </Layout>
  );
};

export default OKompanii;
