import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { PropertySearchSection } from "@/components/home/PropertySearchSection";
import { PromotionsSection } from "@/components/home/PromotionsSection";
import { RealEstateAsArtSection } from "@/components/home/RealEstateAsArtSection";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { ExpertsSection } from "@/components/home/ExpertsSection";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { VideoTestimonialsSection } from "@/components/home/VideoTestimonialsSection";
import { AboutTeamCarousel } from "@/components/about/AboutTeamCarousel";

const Index = () => {
  return (
    <Layout>
      {/* Hero with categories */}
      <HeroSection />

      {/* Property Search & Listings */}
      <PropertySearchSection />

      {/* Promotions - Dark banner */}
      <PromotionsSection />

      {/* Real Estate as Art - Light background */}
      <RealEstateAsArtSection />

      {/* Team of Experts */}
      <AboutTeamCarousel />

      {/* Consultation Form - Dark */}
      <ConsultationSection />

      {/* Services Strip & After Sale */}
      <ServicesStrip />

      {/* Video Testimonials */}
      <VideoTestimonialsSection />
    </Layout>
  );
};

export default Index;
