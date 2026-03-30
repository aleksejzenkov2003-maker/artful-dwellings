import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Thanks() {
  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Спасибо!</h1>
          <p className="text-muted-foreground mb-8">
            Заявка отправлена. Мы свяжемся с вами в ближайшее время.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild>
              <Link to="/novostroyki">К каталогу</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">На главную</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

