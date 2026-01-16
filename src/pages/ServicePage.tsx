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
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif mb-6">
                Получить консультацию
              </h2>
              <p className="text-muted-foreground mb-8">
                Оставьте заявку и наш специалист свяжется с вами для подробной консультации по услуге «{service.title}»
              </p>
              
              {/* Features list */}
              {features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
                    Что вы получите:
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="bg-background p-8 shadow-lg">
              <ServiceContactForm serviceTitle={service.title} serviceSlug={service.slug} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
