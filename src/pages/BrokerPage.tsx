import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, Send, Building2, MapPin, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { ComplexCard } from "@/components/novostroyki/ComplexCard";
import { BrokerContactForm } from "@/components/broker/BrokerContactForm";
import { BrokerReviews } from "@/components/broker/BrokerReviews";

// Content block types matching AdminBlogEdit / AdminTeamEdit
interface ContentBlock {
  id: string;
  type: "text" | "heading" | "image" | "quote" | "colored-block" | "two-columns" | "image-text";
  content?: string;
  heading?: string;
  imageUrl?: string;
  imageCaption?: string;
  imagePosition?: "left" | "right" | "full";
  backgroundColor?: string;
  textColor?: string;
  quoteAuthor?: string;
  leftContent?: string;
  rightContent?: string;
  alignment?: "left" | "center" | "right";
}

// Block renderer component
const BlockRenderer = ({ block }: { block: ContentBlock }) => {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[block.alignment || "left"];

  switch (block.type) {
    case "heading":
      return (
        <h2 className={`text-2xl md:text-3xl font-serif mb-6 ${alignmentClass}`}>
          {block.heading || block.content}
        </h2>
      );

    case "text":
      return (
        <div 
          className={`prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:text-foreground/80 prose-a:text-primary ${alignmentClass}`}
          dangerouslySetInnerHTML={{ __html: block.content || "" }}
        />
      );

    case "image":
      return (
        <figure className="my-8">
          <img 
            src={block.imageUrl} 
            alt={block.imageCaption || ""} 
            className="w-full h-auto rounded-lg"
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
        <blockquote className="border-l-4 border-primary bg-primary/5 py-6 px-8 my-8 font-serif text-lg italic">
          <p className="mb-2">{block.content}</p>
          {block.quoteAuthor && (
            <cite className="text-sm text-muted-foreground not-italic">
              — {block.quoteAuthor}
            </cite>
          )}
        </blockquote>
      );

    case "colored-block":
      return (
        <div 
          className="p-8 lg:p-12 my-8 rounded-lg"
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
              <>
                <img 
                  src={block.imageUrl} 
                  alt={block.imageCaption || ""}
                  className="w-full h-auto rounded"
                />
                {block.imageCaption && (
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                    {block.imageCaption}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex-1">
            <div 
              className="prose prose-lg max-w-none prose-p:text-foreground/80 prose-p:text-sm"
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

const BrokerPage = () => {
  const { slug } = useParams();

  // Fetch broker data
  const { data: broker, isLoading: brokerLoading } = useQuery({
    queryKey: ["broker", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch broker's complexes
  const { data: brokerComplexes, isLoading: complexesLoading } = useQuery({
    queryKey: ["broker-complexes", broker?.id],
    queryFn: async () => {
      if (!broker?.id) return [];
      
      console.log("Fetching complexes for broker:", broker.id);
      
      const { data: assignments, error: assignError } = await supabase
        .from("broker_complexes")
        .select("complex_id")
        .eq("broker_id", broker.id);
      
      console.log("Broker complex assignments:", assignments, "error:", assignError);
      
      if (assignError) throw assignError;
      if (!assignments || assignments.length === 0) return [];
      
      const complexIds = assignments.map(a => a.complex_id);
      
      const { data: complexes, error } = await supabase
        .from("residential_complexes")
        .select("*")
        .in("id", complexIds)
        .eq("is_published", true);
      
      console.log("Fetched complexes:", complexes, "error:", error);
      
      if (error) throw error;
      return complexes || [];
    },
    enabled: !!broker?.id,
  });

  // Fetch broker's apartments
  const { data: brokerApartments } = useQuery({
    queryKey: ["broker-apartments", broker?.id],
    queryFn: async () => {
      if (!broker?.id) return [];
      
      const { data: assignments, error: assignError } = await supabase
        .from("broker_apartments")
        .select("apartment_id")
        .eq("broker_id", broker.id);
      
      if (assignError) throw assignError;
      if (!assignments || assignments.length === 0) return [];
      
      const apartmentIds = assignments.map(a => a.apartment_id);
      
      const { data: apartments, error } = await supabase
        .from("apartments")
        .select("*, residential_complexes!inner(name, address, district, slug)")
        .in("id", apartmentIds)
        .eq("is_published", true);
      
      if (error) throw error;
      return apartments || [];
    },
    enabled: !!broker?.id,
  });

  // Parse content blocks
  const contentBlocks: ContentBlock[] = (() => {
    if (!broker?.content_blocks) return [];
    try {
      const parsed = broker.content_blocks;
      if (Array.isArray(parsed)) return parsed as unknown as ContentBlock[];
      return [];
    } catch {
      return [];
    }
  })();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  if (brokerLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <Skeleton className="w-80 h-96 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!broker) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Брокер не найден</h1>
          <p className="text-muted-foreground mb-8">
            Возможно, страница была удалена или перемещена
          </p>
          <Link to="/o-kompanii">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              К команде
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Photo */}
            <div className="lg:w-80 flex-shrink-0">
              {broker.photo_url ? (
                <img 
                  src={broker.photo_url} 
                  alt={broker.name}
                  className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-6xl font-serif text-muted-foreground">
                    {broker.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <Link 
                to="/o-kompanii" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm uppercase tracking-wider">Команда</span>
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
                {broker.name}
              </h1>
              
              <p className="text-xl text-primary font-medium mb-6">
                {broker.role}
              </p>

              {broker.experience_years && (
                <p className="text-lg text-muted-foreground mb-4">
                  Опыт работы: {broker.experience_years} лет
                </p>
              )}

              {broker.specialization && Array.isArray(broker.specialization) && broker.specialization.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {broker.specialization.map((spec, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {broker.bio && (
                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  {broker.bio}
                </p>
              )}

              {/* Contacts */}
              <div className="flex flex-wrap gap-4">
                {broker.phone && (
                  <a href={`tel:${broker.phone}`} className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Phone className="h-5 w-5" />
                    <span>{broker.phone}</span>
                  </a>
                )}
                {broker.email && (
                  <a href={`mailto:${broker.email}`} className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                    <span>{broker.email}</span>
                  </a>
                )}
                {broker.telegram && (
                  <a href={broker.telegram.startsWith("http") ? broker.telegram : `https://t.me/${broker.telegram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Send className="h-5 w-5" />
                    <span>Telegram</span>
                  </a>
                )}
              </div>

              {/* Share button */}
              <div className="mt-8">
                <Button variant="outline" onClick={handleShare}>
                  Поделиться профилем
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content blocks on the left */}
            {contentBlocks.length > 0 && (
              <div className="space-y-6">
                {contentBlocks.map((block) => (
                  <BlockRenderer key={block.id} block={block} />
                ))}
              </div>
            )}
            
            {/* Contact form on the right */}
            <div className={contentBlocks.length === 0 ? "lg:col-span-2 max-w-lg mx-auto" : ""}>
              <BrokerContactForm
                brokerId={broker.id}
                brokerName={broker.name.split(" ")[0]}
                brokerSlug={broker.slug || slug || ""}
              />
            </div>
          </div>
        </div>
      </section>


      {/* Broker's apartments */}
      {brokerApartments && brokerApartments.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif mb-8">
              Объекты в продаже ({brokerApartments.length})
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokerApartments.map((apartment: any) => (
                <Link 
                  key={apartment.id} 
                  to={`/novostroyki/${apartment.residential_complexes?.slug}`}
                  className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {apartment.layout_image ? (
                      <img 
                        src={apartment.layout_image} 
                        alt={`${apartment.room_type} квартира`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Building2 className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                        КВАРТИРА
                      </span>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <p className="text-2xl font-bold text-primary">
                      {Number(apartment.price).toLocaleString("ru-RU")} ₽
                    </p>
                    
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {apartment.residential_complexes?.address || apartment.residential_complexes?.district || "—"}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {apartment.room_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="h-4 w-4 text-muted-foreground" />
                        {apartment.area} м²
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {apartment.floor} этаж
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t flex items-center justify-between text-sm text-muted-foreground">
                      <span className="truncate">
                        {apartment.residential_complexes?.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Broker's complexes */}
      {brokerComplexes && brokerComplexes.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif mb-8">
              Жилые комплексы
          </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokerComplexes.map((complex) => (
                <ComplexCard key={complex.id} complex={complex} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Broker Reviews */}
      <BrokerReviews brokerId={broker.id} />

      {/* Video section if available */}
      {broker.video_url && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center">
              Видеопрезентация
            </h2>
            <div className="max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden bg-muted">
              <video 
                src={broker.video_url} 
                controls 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BrokerPage;
