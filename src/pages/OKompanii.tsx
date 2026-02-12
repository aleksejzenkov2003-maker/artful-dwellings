import { Layout } from "@/components/layout/Layout";
import {
  AboutHero,
  AboutIntro,
  AboutServices,
  AboutAdditionalServices,
  AboutTimeline,
  AboutFounders,
  AboutIdea,
  AboutAdvantages,
  AboutCertificates,
  AboutTeamCarousel,
  AboutTestimonials,
  AboutConsultationForm,
} from "@/components/about";

const OKompanii = () => {
  return (
    <Layout>
      {/* 1. Hero with hexagons */}
      <AboutHero />

      {/* 2. Company intro with team photo + stats */}
      <AboutIntro />

      {/* 3. Services grid on brown/coral background */}
      <AboutServices />

      {/* 4. Additional services (accordion) */}
      <AboutAdditionalServices />

      {/* 5. History timeline */}
      <AboutTimeline />

      {/* 6. Founders */}
      <AboutFounders />

      {/* 7. Idea + Partnership sections */}
      <AboutIdea />

      {/* 8. Advantages with icons + CTA */}
      <AboutAdvantages />

      {/* 9. Certificates and awards */}
      <AboutCertificates />

      {/* 10. Team carousel on dark background */}
      <AboutTeamCarousel />

      {/* 11. Video testimonials */}
      <AboutTestimonials />

      {/* 12. Consultation form */}
      <AboutConsultationForm />
    </Layout>
  );
};

export default OKompanii;
