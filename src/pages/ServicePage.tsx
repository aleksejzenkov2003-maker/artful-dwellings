import { useParams, Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useServiceBySlug } from "@/hooks/useServiceBySlug";
import { Layout } from "@/components/layout/Layout";
import { ServiceContactForm } from "@/components/services/ServiceContactForm";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceProblemBlocks } from "@/components/services/ServiceProblemBlocks";
import { ServiceAdvantagesGrid } from "@/components/services/ServiceAdvantagesGrid";
import { TwoColumnAdvantages } from "@/components/services/TwoColumnAdvantages";

interface ProblemBlock {
  title: string;
  description: string;
}

interface Advantage {
  id: string;
  number: string;
  title: string;
  description: string;
  image_url?: string;
  background_type: "white" | "terracotta" | "image";
  size?: "small" | "medium" | "large";
}

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useServiceBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif mb-4">Услуга не найдена</h1>
          <Link to="/uslugi" className="text-primary hover:underline">
            Вернуться к списку услуг
          </Link>
        </div>
      </Layout>
    );
  }

  // Parse advantages from JSON
  const advantages: Advantage[] = Array.isArray(service.advantages) 
    ? (service.advantages as unknown as Advantage[])
    : [];

  // Parse problem blocks from JSON
  const problemBlocks: ProblemBlock[] = Array.isArray((service as any).problem_blocks)
    ? (service as any).problem_blocks as ProblemBlock[]
    : [];

  // Split advantages for different sections
  const gridAdvantages = advantages.slice(0, 6);
  const bottomAdvantages = advantages.slice(6).map(adv => ({
    number: adv.number,
    title: adv.title,
    description: adv.description,
  }));

  const features = Array.isArray(service.features) ? service.features as string[] : [];

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/uslugi" className="hover:text-foreground transition-colors">
              Услуги
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <ServiceHero 
        title={service.title}
        introText={service.intro_text}
        mainImage={service.main_image}
      />

      {/* Problem Blocks Section */}
      {problemBlocks.length > 0 && (
        <ServiceProblemBlocks blocks={problemBlocks} />
      )}

      {/* Advantages Grid Section */}
      {gridAdvantages.length > 0 && (
        <ServiceAdvantagesGrid 
          advantages={gridAdvantages}
          title="Что мы предлагаем"
        />
      )}

      {/* Bottom Two-Column Advantages */}
      {bottomAdvantages.length > 0 && (
        <TwoColumnAdvantages advantages={bottomAdvantages} />
      )}

      {/* Contact Form Section */}
      <ServiceContactForm serviceTitle={service.title} serviceSlug={service.slug} />
    </Layout>
  );
}
