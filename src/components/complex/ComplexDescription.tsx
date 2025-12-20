import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";

interface ComplexDescriptionProps {
  complex: ResidentialComplex;
}

export function ComplexDescription({ complex }: ComplexDescriptionProps) {
  const features = Array.isArray(complex.features) ? (complex.features as string[]) : [];

  if (!complex.description && features.length === 0) {
    return null;
  }

  return (
    <section id="description" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1] mb-8">
            Описание
          </h2>

          {complex.description && (
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-[16px] lg:text-[18px] leading-[1.7]">
                {complex.description}
              </p>
            </div>
          )}

          {features.length > 0 && (
            <div>
              <h3 className="text-[14px] uppercase tracking-wider font-medium mb-6">
                Особенности
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-[15px]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
