import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams();

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
            <span className="text-sm font-medium text-primary">Категория</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-2 mb-4">
              {slug?.replace(/-/g, " ")}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8">
              <span>15 ноября 2024</span>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Поделиться
              </Button>
            </div>
            
            <div className="aspect-video bg-secondary rounded-lg mb-8" />
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Содержимое статьи будет загружено из базы данных.
              </p>
            </div>
          </div>
          
          {/* Related posts placeholder */}
          <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-serif font-bold mb-8">Похожие статьи</h2>
            <div className="bg-secondary rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Блок с похожими статьями</p>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
