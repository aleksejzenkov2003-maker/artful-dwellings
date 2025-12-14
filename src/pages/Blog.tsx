import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useBlogPosts, useBlogCategories } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { usePromotions } from "@/hooks/usePromotions";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeTab, setActiveTab] = useState<"all" | "news" | "articles">("all");
  const { data: posts, isLoading: postsLoading } = useBlogPosts(activeCategory);
  const { data: categories = ["Все"] } = useBlogCategories();
  const { data: promotions } = usePromotions();

  const activePromo = promotions?.[0];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return { day: "", monthYear: "" };
    const date = new Date(dateString);
    return {
      day: format(date, "d", { locale: ru }),
      monthYear: format(date, "MMMM yyyy", { locale: ru })
    };
  };

  // Create masonry layout pattern
  const getMasonryClass = (index: number) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0: return "col-span-1 row-span-2"; // Tall left
      case 1: return "col-span-1 row-span-1"; // Small right top
      case 2: return "col-span-1 row-span-1"; // Small right bottom
      case 3: return "col-span-1 row-span-1"; // Small left
      case 4: return "col-span-1 row-span-2"; // Tall right
      case 5: return "col-span-1 row-span-1"; // Small bottom
      default: return "col-span-1 row-span-1";
    }
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
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-4 uppercase text-primary">Другие рубрики</h3>
                <div className="space-y-2">
                  {categories.filter(c => c !== "Все").map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`flex items-center justify-between w-full py-2 px-3 rounded text-sm transition-colors ${
                        activeCategory === category 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{category}</span>
                      <ChevronRight className="h-4 w-4" />
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
                  onClick={() => setActiveTab("all")}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "all" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Все материалы
                </button>
                <button
                  onClick={() => setActiveTab("news")}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "news" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Новости
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`pb-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "articles" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Статьи
                </button>
              </div>

              {/* Date indicator for first post */}
              {posts && posts.length > 0 && (
                <div className="flex items-start gap-4 mb-8">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Статья</span>
                    <div className="text-primary text-xs">от {formatDate(posts[0].published_at).day} {formatDate(posts[0].published_at).monthYear}</div>
                  </div>
                </div>
              )}

              {/* Masonry Grid */}
              {postsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                      <Skeleton className="aspect-square" />
                    </div>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[200px]">
                  {posts.map((post, index) => {
                    const isLarge = index % 3 === 0;
                    return (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className={`group relative overflow-hidden rounded-lg ${
                          isLarge ? "row-span-2" : "row-span-1"
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
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
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
                    {activeCategory === "Все" 
                      ? "Статей пока нет" 
                      : `Статей в категории "${activeCategory}" не найдено`}
                  </p>
                </div>
              )}

              {/* Featured article card */}
              {posts && posts.length > 0 && (
                <div className="mt-8 bg-muted rounded-lg p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      В отделочных решениях мы настроились для вас создать интерьер, который достигнет успешного финала. Его успех подтверждается — функциональность, оформление элементов, карнизы, использование необычных решений для окон.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Такой, помимо пуфа на полке форме мы настроились на нашу рядов, на это создал...
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button variant="outline">В деталях</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">Консультация</p>
            <p className="text-xs uppercase tracking-wider mb-8 text-muted-foreground">по недвижимости</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Имя" className="bg-transparent border-b border-border rounded-none px-0" />
                <div className="flex gap-4">
                  <Input placeholder="Телефон" className="bg-transparent border-b border-border rounded-none px-0" />
                  <span className="text-muted-foreground self-center">или</span>
                  <Input placeholder="E-mail" className="bg-transparent border-b border-border rounded-none px-0" />
                </div>
              </div>
              <Textarea 
                placeholder="Интересующий вас вопрос" 
                className="bg-transparent border-b border-border rounded-none px-0 resize-none min-h-[80px]"
              />
              <div className="flex items-start gap-2">
                <Checkbox id="consent" />
                <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
                  Я даю свое согласие на обработку персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных», в целях и объемах установленных Согласие на обработку персональных данных
                </label>
              </div>
              <Button variant="outline">Отправить заявку</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
