import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useBlogPosts, useBlogCategories } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Все");
  const { data: posts, isLoading: postsLoading } = useBlogPosts(activeCategory);
  const { data: categories = ["Все"] } = useBlogCategories();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "d MMMM yyyy", { locale: ru });
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Блог
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Новости рынка, полезные советы и экспертная аналитика
          </p>
          
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Blog posts grid */}
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-video" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                >
                  <div className="aspect-video bg-secondary overflow-hidden">
                    {post.cover_image ? (
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary" />
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-medium text-primary">{post.category}</span>
                    )}
                    <h3 className="text-lg font-serif font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {activeCategory === "Все" 
                  ? "Статей пока нет" 
                  : `Статей в категории "${activeCategory}" не найдено`}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
