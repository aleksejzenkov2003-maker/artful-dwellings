import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Calendar, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts } = useBlogPosts();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "d MMMM yyyy", { locale: ru });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  // Get related posts (same category, excluding current)
  const relatedPosts = allPosts
    ?.filter(p => p.slug !== slug && p.category === post?.category)
    .slice(0, 3);

  if (isLoading) {
    return (
      <Layout>
        <article className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="space-y-3 pt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
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
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к блогу
          </Link>
          
          <div className="max-w-3xl mx-auto">
            {post.category && (
              <span className="text-sm font-medium text-primary">{post.category}</span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-2 mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-8">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </span>
              )}
              {post.author_name && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author_name}
                </span>
              )}
              {post.views_count !== null && post.views_count > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views_count}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </Button>
            </div>
            
            {post.cover_image && (
              <div className="aspect-video bg-secondary rounded-lg mb-8 overflow-hidden">
                <img 
                  src={post.cover_image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {post.content ? (
              <div 
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : post.excerpt ? (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {post.excerpt}
              </p>
            ) : null}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-secondary text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Related posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-border">
              <h2 className="text-2xl font-serif font-bold mb-8">Похожие статьи</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="aspect-video bg-secondary rounded-lg mb-3 overflow-hidden">
                      {relatedPost.cover_image ? (
                        <img 
                          src={relatedPost.cover_image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
