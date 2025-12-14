import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts } = useBlogPosts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get current post index for navigation
  const currentIndex = allPosts?.findIndex(p => p.slug === slug) ?? -1;
  const totalPosts = allPosts?.length ?? 0;

  const formatDateParts = (dateString: string | null) => {
    if (!dateString) return { day: "", month: "", year: "" };
    const date = new Date(dateString);
    return {
      day: format(date, "d", { locale: ru }),
      month: format(date, "MMMM", { locale: ru }),
      year: format(date, "yyyy", { locale: ru })
    };
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post?.title || "")}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Ссылка скопирована");
          return;
        } catch {
          toast.error("Не удалось скопировать ссылку");
          return;
        }
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Mock gallery images (in real app would come from post)
  const galleryImages = post?.cover_image 
    ? [post.cover_image, post.cover_image, post.cover_image] 
    : [];

  const dateParts = formatDateParts(post?.published_at || null);

  if (isLoading) {
    return (
      <Layout>
        <div className="relative h-[60vh] min-h-[400px] bg-muted">
          <Skeleton className="absolute inset-0" />
        </div>
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <Skeleton className="w-24 h-40 flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-64 w-full mt-8" />
              </div>
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <article className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Статья не найдена</h1>
            <p className="text-muted-foreground mb-8">
              Возможно, она была удалена или перемещена
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к блогу
              </Button>
            </Link>
          </div>
        </article>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero section with background image */}
      <section 
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: post.cover_image ? `url(${post.cover_image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-0 right-0">
          <div className="container mx-auto px-4 flex items-center justify-between text-white">
            <Link 
              to="/blog" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Все новости</span>
            </Link>
            {totalPosts > 0 && (
              <span className="text-sm">
                {currentIndex + 1} / {totalPosts}
              </span>
            )}
          </div>
        </div>
        
        {/* Title */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Share buttons */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4 flex justify-center items-center gap-4 text-white">
            <span className="text-sm uppercase tracking-wider">Поделиться</span>
            <div className="flex gap-3">
              <button 
                onClick={() => handleShare("twitter")}
                className="hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare("instagram")}
                className="hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare("facebook")}
                className="hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <article className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Date sidebar */}
            <aside className="lg:w-32 flex-shrink-0">
              <div className="sticky top-24 text-center lg:text-left">
                <div className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary leading-none">
                  {dateParts.day}
                </div>
                <div className="text-lg font-serif text-primary mt-2">
                  {dateParts.month}
                </div>
                <div className="w-12 h-px bg-primary my-4 mx-auto lg:mx-0" />
                <div className="text-lg font-serif text-primary">
                  {dateParts.year}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 max-w-3xl">
              {/* Excerpt / Lead */}
              {post.excerpt && (
                <p className="text-lg md:text-xl leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Image gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-8">
                  <div className="relative aspect-[16/10] bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={galleryImages[currentImageIndex]} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {galleryImages.length > 1 && (
                      <>
                        <button 
                          onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : galleryImages.length - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setCurrentImageIndex(prev => prev < galleryImages.length - 1 ? prev + 1 : 0)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Gallery dots */}
                  {galleryImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {galleryImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Article content */}
              {post.content ? (
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:text-foreground/80 prose-a:text-primary prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : null}

              {/* Highlight block */}
              <div className="bg-primary text-primary-foreground p-8 lg:p-12 mt-12">
                <p className="text-lg md:text-xl font-serif italic leading-relaxed">
                  Проект предусматривает детский клуб, оборудование для маломобильных групп населения, единую входную группу с камином, системы видеонаблюдения и контроля доступа на территорию и в дом.
                </p>
              </div>

              {/* Additional content section */}
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-serif mb-6">
                  Инновации в ваших домах — реальность.
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-8">
                  Отличительными особенностями нового ЖК станут квартиры с каминами и пентхаусы с просторными террасами на последних этажах. На первом этаже спланировано 10 помещений универсального назначения. Проект предусматривает детский клуб, оборудование для маломобильных групп населения, единую входную группу с камином, системы видеонаблюдения и контроля доступа на территорию и в дом.
                </p>

                {/* Image with text wrap */}
                {post.cover_image && (
                  <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="md:w-1/3 flex-shrink-0">
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-auto rounded"
                      />
                      <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                        Комплекс «{post.title}»
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground/80 leading-relaxed text-sm">
                        Новый жилой комплекс бизнес-класса возводится холдингом «Аквилон-Инвест» в Петроградском районе Санкт-Петербурга на пересечении улиц Лодейнопольской и Петрозаводской, в шаговой доступности от станции метро «Чкаловская». В жилом комплексе общей площадью 18,5 тыс. кв. м запроектировано 156 комфортных квартир — от однокомнатных до четырехкомнатных площадью до 150 кв. м, с возможностью объединения в пентхаус до 400 кв. м. Окна всех квартир выходят на спокойные Лодейнопольскую или Петрозаводскую улицы и в тихий закрытый двор. Для удобства автомобилистов предусмотрен подземный паркинг на 81 машино-место.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-secondary text-sm rounded-full"
                    >
                      #{String(tag)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
