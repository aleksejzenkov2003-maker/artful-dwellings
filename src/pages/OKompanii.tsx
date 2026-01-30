import { Layout } from "@/components/layout/Layout";
import {
  AboutHero,
  AboutIntro,
  AboutServices,
  AboutTimeline,
  AboutFounders,
  AboutIdea,
  AboutAdvantages,
  AboutTeamCarousel,
  AboutTestimonials,
} from "@/components/about";

const OKompanii = () => {
  return (
    <Layout>
      {/* 1. Hero with hexagons */}
      <AboutHero />

      {/* 2. Company intro with team photo */}
      <AboutIntro />

      {/* 3. Services grid (01/-08/) */}
      <AboutServices />

      {/* 4. History timeline */}
      <AboutTimeline />

      {/* 5. Founders */}
      <AboutFounders />

      {/* 6. Idea + Partnership sections */}
      <AboutIdea />

      {/* 7. Advantages with icons + CTA */}
      <AboutAdvantages />

      {/* 8. Team carousel on dark background */}
      <AboutTeamCarousel />

      {/* 9. Video testimonials */}
      <AboutTestimonials />
    </Layout>
  );
};

export default OKompanii;
