import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Loader2, ChevronRight } from "lucide-react";
import { useServiceBySlug } from "@/hooks/useServiceBySlug";
import { ServiceAdvantagesGrid } from "@/components/services/ServiceAdvantagesGrid";
import { TwoColumnAdvantages } from "@/components/services/TwoColumnAdvantages";
import { ServiceContactForm } from "@/components/services/ServiceContactForm";

interface ContentBlock {
  id: string;
  type: "text" | "image" | "quote" | "list" | "heading" | "gallery" | "cta" | "colored-block" | "two-columns" | "image-text";
  content?: string;
  imageUrl?: string;
  items?: string[];
  level?: number;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
  heading?: string;
  imageCaption?: string;
  imagePosition?: "left" | "right" | "full";
  backgroundColor?: string;
  textColor?: string;
  quoteAuthor?: string;
  leftContent?: string;
  rightContent?: string;
  alignment?: "left" | "center" | "right";
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

// Render content blocks
function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div 
          className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.content || "" }}
        />
      );
    case "heading":
      return (
        <h2 className="font-serif text-2xl md:text-3xl mb-4">
          {block.heading || block.content}
        </h2>
      );
    case "image":
      return (
        <figure className="my-8">
          <img
            src={block.imageUrl}
            alt={block.imageCaption || ""}
            className="w-full h-auto object-cover"
          />
          {block.imageCaption && (
            <figcaption className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-muted-foreground">
          <p>{block.content}</p>
          {block.quoteAuthor && (
            <cite className="text-sm not-italic mt-2 block">— {block.quoteAuthor}</cite>
          )}
        </blockquote>
      );
    case "colored-block":
      return (
        <div 
          className="p-8 lg:p-12 my-8"
          style={{ 
            backgroundColor: block.backgroundColor || "#c4a77d",
            color: block.textColor || "#ffffff"
          }}
        >
          <div 
            className="text-lg md:text-xl font-serif italic leading-relaxed"
            dangerouslySetInnerHTML={{ __html: block.content || "" }}
          />
        </div>
      );
    case "two-columns":
      return (
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div 
            className="prose prose-lg max-w-none prose-p:text-foreground/80"
            dangerouslySetInnerHTML={{ __html: block.leftContent || "" }}
          />
          <div 
            className="prose prose-lg max-w-none prose-p:text-foreground/80"
            dangerouslySetInnerHTML={{ __html: block.rightContent || "" }}
          />
        </div>
      );
    case "image-text":
      const isImageLeft = block.imagePosition !== "right";
      return (
        <div className={`flex flex-col md:flex-row gap-6 my-8 ${!isImageLeft ? "md:flex-row-reverse" : ""}`}>
          <div className="md:w-1/3 flex-shrink-0">
            {block.imageUrl && (
              <img 
                src={block.imageUrl} 
                alt={block.imageCaption || ""}
                className="w-full h-auto"
              />
            )}
          </div>
          <div className="flex-1">
            <div 
              className="prose prose-lg max-w-none prose-p:text-foreground/80"
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          </div>
        </div>
      );
    case "list":
      return (
        <ul className="space-y-3 my-6">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
          {block.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full aspect-square object-cover"
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useServiceBySlug(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Услуга не найдена</h1>
            <Link to="/uslugi" className="text-primary hover:underline">
              Вернуться к списку услуг
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const contentBlocks = (Array.isArray(service.content_blocks) ? service.content_blocks : []) as unknown as ContentBlock[];
  const advantages = (Array.isArray((service as any).advantages) ? (service as any).advantages : []) as Advantage[];
  const introText = (service as any).intro_text || service.description;
  const features = (service.features as string[]) || [];
  
  // Split advantages for different sections
  const gridAdvantages = advantages.slice(0, 6);
  const bottomAdvantages = advantages.slice(6).map(adv => ({
    number: adv.number,
    title: adv.title,
    description: adv.description,
  }));

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/uslugi" className="hover:text-foreground transition-colors">
              Услуги
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8">
            {service.title}
          </h1>
          
          {/* Intro Text */}
          {introText && (
            <div className="max-w-4xl">
              <p className="text-lg text-muted-foreground leading-relaxed italic">
                {introText}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Image */}
      {service.main_image && (
        <section className="pb-12 lg:pb-16">
          <div className="container mx-auto px-4">
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={service.main_image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Advantages Grid */}
      {gridAdvantages.length > 0 && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <ServiceAdvantagesGrid advantages={gridAdvantages} />
          </div>
        </section>
      )}

      {/* Content Blocks */}
      {contentBlocks.length > 0 && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {contentBlocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Advantages (Two Column) */}
      {bottomAdvantages.length > 0 && (
        <section className="py-12 lg:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <TwoColumnAdvantages advantages={bottomAdvantages} />
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
            
            <div className="bg-muted/30 p-8 rounded-lg">
              <ServiceContactForm serviceTitle={service.title} serviceSlug={service.slug} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicePage;
