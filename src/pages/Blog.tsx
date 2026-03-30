import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useBlogPosts, useBlogCategoriesWithCount, isNewsCategory, isArticleCategory, normalizeCategory } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromotions } from "@/hooks/usePromotions";

const Blog = () => {
  const [activeTab, setActiveTab] = useState<"all" | "news" | "articles">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: posts, isLoading: postsLoading } = useBlogPosts();
  const { data: categoriesWithCount = [] } = useBlogCategoriesWithCount();
  const { data: promotions } = usePromotions();

  const activePromo = promotions?.[0];

  // Filter posts by tab (news/articles/all) and selected category
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    let filtered = posts;

    // Filter by tab
    if (activeTab === "news") {
      filtered = filtered.filter(post => isNewsCategory(post.category));
    } else if (activeTab === "articles") {
      filtered = filtered.filter(post => isArticleCategory(post.category));
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(post => normalizeCategory(post.category) === selectedCategory);
    }

    return filtered;
  }, [posts, activeTab, selectedCategory]);

  // Group posts by normalized category for category cards
  const postsByCategory = useMemo(() => {
    if (!posts) return {};
    
    return posts.reduce((acc, post) => {
      const cat = normalizeCategory(post.category);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(post);
      return acc;
    }, {} as Record<string, typeof posts>);
  }, [posts]);

  // Category images mapping
  const categoryImages: Record<string, string> = {
    "Советы": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "Аналитика": "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800",
    "Новости": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    "Ипотека": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800",
    "Гайды": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "Статьи": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  };

  const getCategoryImage = (categoryName: string) => {
    return categoryImages[categoryName] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Главная
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif">
            Немного о дизайне интерьера
          </h1>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0 space-y-8">
              {/* Categories - Рубрики */}
              <div>
                <h3 className="text-lg font-medium mb-2 uppercase tracking-wider">Рубрики</h3>
                <div className="w-16 h-0.5 bg-primary mb-4" />
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center justify-between w-full py-2 px-3 rounded text-sm transition-colors ${
                      selectedCategory === null 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <span>Все рубрики</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === null 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {posts?.length || 0}
                    </span>
                  </button>
                  {categoriesWithCount.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex items-center justify-between w-full py-2 px-3 rounded text-sm transition-colors ${
                        selectedCategory === category.name 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.name 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question form */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-medium mb-1 uppercase">Ответим на любой вопрос</h3>
                <h4 className="text-sm font-medium mb-4 uppercase">в сфере недвижимости</h4>
                <Input placeholder="Ваш телефон" className="mb-3" />
                <Button className="w-full">Заказать звонок</Button>
              </div>

              {/* Promotion banner */}
              {activePromo && (
                <Link 
                  to={`/akcii/${activePromo.slug}`}
                  className="block bg-navy text-white rounded-lg overflow-hidden group"
                >
                  <div className="relative">
                    {activePromo.cover_image && (
                      <img 
                        src={activePromo.cover_image} 
                        alt={activePromo.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 uppercase">
                        Акция
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-white/60 mb-1">{activePromo.category}</p>
                    <h4 className="font-serif text-sm mb-3 line-clamp-2">{activePromo.title}</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white text-white bg-transparent hover:bg-white hover:text-navy text-xs"
                    >
                      Подробнее
                    </Button>
                  </div>
                </Link>
              )}
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex gap-8 border-b border-border mb-8">
                <button
                  onClick={() => { setActiveTab("all"); setSelectedCategory(null); }}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "all" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Все материалы
                </button>
                <button
                  onClick={() => { setActiveTab("news"); setSelectedCategory(null); }}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "news" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Новости
                </button>
                <button
                  onClick={() => { setActiveTab("articles"); setSelectedCategory(null); }}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "articles" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Статьи
                </button>
              </div>

              {/* Loading state */}
              {postsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="aspect-[4/3] rounded-lg mb-4" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : selectedCategory || activeTab !== "all" ? (
                /* Filtered view - list of articles when tab is news/articles OR category is selected */
                <div>
                  {selectedCategory && (
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-serif">{selectedCategory}</h2>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                      >
                        ← Все рубрики
                      </Button>
                    </div>
                  )}
                  {!selectedCategory && activeTab === "news" && (
                    <h2 className="text-2xl font-serif mb-6">Новости</h2>
                  )}
                  {!selectedCategory && activeTab === "articles" && (
                    <h2 className="text-2xl font-serif mb-6">Статьи</h2>
                  )}
                  
                  {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredPosts.map((post, index) => {
                        const isLarge = index === 0;
                        return (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className={`group relative overflow-hidden rounded-lg ${
                              isLarge ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                            }`}
                          >
                            <div className="absolute inset-0 bg-muted">
                              {post.cover_image ? (
                                <img 
                                  src={post.cover_image} 
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                              )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <span className="text-xs uppercase tracking-wider text-primary mb-2 block">
                                {normalizeCategory(post.category)}
                              </span>
                              <h3 className={`font-serif leading-tight ${
                                isLarge ? "text-xl md:text-2xl" : "text-base md:text-lg"
                              }`}>
                                {post.title}
                              </h3>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground text-lg">
                        {activeTab === "news" 
                          ? "Новостей пока нет" 
                          : activeTab === "articles" 
                            ? "Статей пока нет"
                            : `Статей в категории "${selectedCategory}" не найдено`}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Category cards grid view - only when "Все материалы" tab is active */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {categoriesWithCount.map((category) => {
                    const categoryPosts = postsByCategory[category.name] || [];
                    const displayPosts = categoryPosts.slice(0, 3);
                    
                    return (
                      <div key={category.name} className="group">
                        {/* Category card with image */}
                        <button
                          onClick={() => setSelectedCategory(category.name)}
                          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4"
                        >
                          <img 
                            src={getCategoryImage(category.name)} 
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                            <h3 className="text-2xl font-serif mb-1">{category.name}</h3>
                            <p className="text-sm text-white/70">{category.count} статей</p>
                          </div>
                        </button>

                        {/* Article titles list */}
                        <div className="space-y-2 mb-3">
                          {displayPosts.map((post) => (
                            <Link
                              key={post.id}
                              to={`/blog/${post.slug}`}
                              className="block text-sm hover:text-primary transition-colors line-clamp-1"
                            >
                              {post.title}
                            </Link>
                          ))}
                        </div>

                        {/* View all button */}
                        <button
                          onClick={() => setSelectedCategory(category.name)}
                          className="inline-flex items-center text-xs uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                        >
                          Все статьи
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;