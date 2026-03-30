interface ProblemBlock {
  title: string;
  description: string;
}

interface ServiceProblemBlocksProps {
  blocks: ProblemBlock[];
}

export function ServiceProblemBlocks({ blocks }: ServiceProblemBlocksProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blocks.map((block, index) => (
            <div 
              key={index}
              className="bg-background shadow-lg p-8 md:p-10 text-center"
            >
              <h3 className="text-2xl md:text-3xl font-serif mb-4 text-foreground">
                {block.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {block.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
