import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { ComplexHero } from "@/components/complex/ComplexHero";
import { ComplexNavigation } from "@/components/complex/ComplexNavigation";
import { ComplexStatsGrid } from "@/components/complex/ComplexStatsGrid";
import { ComplexDescription } from "@/components/complex/ComplexDescription";
import { ComplexConceptSlider } from "@/components/complex/ComplexConceptSlider";
import { BuildingSelector } from "@/components/complex/BuildingSelector";
import { ComplexApartments } from "@/components/complex/ComplexApartments";
import { ComplexLocation } from "@/components/complex/ComplexLocation";
import { ComplexAdvantages } from "@/components/complex/ComplexAdvantages";
import { ComplexQuizBanner } from "@/components/complex/ComplexQuizBanner";
import { ComplexExcursionForm } from "@/components/complex/ComplexExcursionForm";
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
      {complex.seo_title && <title>{complex.seo_title}</title>}

      {/* Hero */}
      <ComplexHero complex={complex} />

      {/* Sticky Navigation */}
      <ComplexNavigation />

      {/* Stats Grid */}
      <ComplexStatsGrid complex={complex} />

      {/* Description */}
      <ComplexDescription complex={complex} />

      {/* Concept Slider */}
      <ComplexConceptSlider complexId={complex.id} />

      {/* Building Selector */}
      <BuildingSelector
        complexId={complex.id}
        planImage={complex.main_image || ""}
        complexName={complex.name}
      />

      {/* Apartments */}
      <ComplexApartments complex={complex} />

      {/* Location */}
      <ComplexLocation complex={complex} />

      {/* Advantages */}
      <ComplexAdvantages complex={complex} />

      {/* Quiz Banner */}
      <ComplexQuizBanner complexName={complex.name} />

      {/* Excursion Form */}
      <ComplexExcursionForm complex={complex} />
    </Layout>
  );
};

export default ResidentialComplex;
