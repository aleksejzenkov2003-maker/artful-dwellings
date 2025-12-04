import { Layout } from "@/components/layout/Layout";

const Novostroyki = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Новостройки Москвы
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Каталог новостроек от проверенных застройщиков с актуальными ценами и планировками
          </p>
          
          {/* Placeholder for filters and catalog */}
          <div className="bg-secondary rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Здесь будет каталог ЖК с фильтрами и сортировкой
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Novostroyki;
