import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { ComplexHero } from "@/components/complex/ComplexHero";
import { ComplexNavigation } from "@/components/complex/ComplexNavigation";
import { ComplexPhotoGallery } from "@/components/complex/ComplexPhotoGallery";
import { ComplexDetails } from "@/components/complex/ComplexDetails";
import { ComplexAdvantages } from "@/components/complex/ComplexAdvantages";
import { ComplexApartments } from "@/components/complex/ComplexApartments";
import { ComplexDescription } from "@/components/complex/ComplexDescription";
import { ComplexQuizBanner } from "@/components/complex/ComplexQuizBanner";
import { ComplexLocation } from "@/components/complex/ComplexLocation";
import { ComplexExcursionForm } from "@/components/complex/ComplexExcursionForm";
import { ComplexConceptCards } from "@/components/complex/ComplexConceptCards";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentialComplex = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: complex, isLoading, error } = useResidentialComplex(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[600px] flex items-center justify-center">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-48" />
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !complex) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">ЖК не найден</h1>
            <p className="text-muted-foreground mb-8">
              К сожалению, запрашиваемый жилой комплекс не существует или был удалён
            </p>
            <Button asChild>
              <Link to="/novostroyki">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к каталогу
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO */}
      {complex.seo_title && <title>{complex.seo_title}</title>}
      
      {/* Hero Section */}
      <ComplexHero complex={complex} />

      {/* Sticky Navigation */}
      <ComplexNavigation />

      {/* Photo Gallery Section */}
      <ComplexPhotoGallery complex={complex} />

      {/* Details Section */}
      <ComplexDetails complex={complex} />

      {/* Location Section */}
      <ComplexLocation complex={complex} />

      {/* Apartments Section */}
      <ComplexApartments complex={complex} />

      {/* Description Section */}
      <ComplexDescription complex={complex} />

      {/* Advantages Section */}
      <ComplexAdvantages complex={complex} />

      {/* Quiz Banner */}
      <ComplexQuizBanner />

      {/* Excursion Form */}
      <ComplexExcursionForm complex={complex} />

      {/* Concept Cards */}
      <ComplexConceptCards complex={complex} />
    </Layout>
  );
};

export default ResidentialComplex;
