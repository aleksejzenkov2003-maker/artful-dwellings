import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Ipoteka = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ипотека
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Подберём лучшие условия ипотечного кредитования от ведущих банков России
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Рассчитать ипотеку
          </Button>
        </div>
      </section>

      {/* Calculator placeholder */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8">
            Ипотечный калькулятор
          </h2>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Здесь будет ипотечный калькулятор
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ipoteka;
