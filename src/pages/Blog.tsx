import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Как выбрать квартиру в новостройке",
    excerpt: "Подробный гайд по выбору идеальной квартиры в строящемся доме",
    slug: "kak-vybrat-kvartiru",
    date: "15 ноября 2024",
    tag: "Советы",
  },
  {
    id: 2,
    title: "Тренды рынка недвижимости 2024",
    excerpt: "Анализ текущей ситуации и прогнозы экспертов",
    slug: "trendy-rynka-2024",
    date: "10 ноября 2024",
    tag: "Аналитика",
  },
  {
    id: 3,
    title: "Ипотека с господдержкой: условия и нюансы",
    excerpt: "Всё, что нужно знать о программах льготной ипотеки",
    slug: "ipoteka-s-gospodderzhkoy",
    date: "5 ноября 2024",
    tag: "Ипотека",
  },
];

const Blog = () => {
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
          
          {/* Tags filter placeholder */}
          <div className="flex gap-2 mb-8">
            {["Все", "Советы", "Аналитика", "Ипотека", "Новости"].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="aspect-video bg-secondary" />
                <div className="p-6">
                  <span className="text-xs font-medium text-primary">{post.tag}</span>
                  <h3 className="text-lg font-serif font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
