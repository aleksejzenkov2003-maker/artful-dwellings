import { Layout } from "@/components/layout/Layout";
import { useParams } from "react-router-dom";

const ResidentialComplex = () => {
  const { slug } = useParams();

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            ЖК «{slug}»
          </h1>
          
          {/* Placeholder for complex details */}
          <div className="bg-secondary rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Здесь будет детальная страница ЖК с галереей, описанием и формой записи
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResidentialComplex;
