import { Layout } from "@/components/layout/Layout";

const OKompanii = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            О компании Art Estate
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Агентство премиальной недвижимости с 2015 года помогает клиентам находить идеальные дома
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Наша миссия</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Мы верим, что выбор дома — это искусство. Наша задача — помочь вам найти не просто квартиру, а место, где вы будете счастливы.
              </p>
            </div>
            <div className="bg-secondary rounded-lg aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Фото команды</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section id="team" className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">
            Команда экспертов
          </h2>
          <div className="bg-card rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Здесь будут карточки членов команды
            </p>
          </div>
        </div>
      </section>

      {/* Timeline placeholder */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">
            История компании
          </h2>
          <div className="bg-secondary rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Здесь будет таймлайн истории компании
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OKompanii;
