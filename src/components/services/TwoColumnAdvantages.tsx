interface Advantage {
  number: string;
  title: string;
  description: string;
}

interface TwoColumnAdvantagesProps {
  advantages: Advantage[];
}

export function TwoColumnAdvantages({ advantages }: TwoColumnAdvantagesProps) {
  if (!advantages || advantages.length === 0) return null;

  // Split advantages into two columns
  const midpoint = Math.ceil(advantages.length / 2);
  const leftColumn = advantages.slice(0, midpoint);
  const rightColumn = advantages.slice(midpoint);

  const renderAdvantage = (advantage: Advantage) => (
    <div key={advantage.number} className="flex items-start gap-2 mb-12 last:mb-0">
      <span className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-primary leading-none">
        {advantage.number}/
      </span>
      <div className="pt-1">
        <h4 className="text-xs font-medium tracking-wide uppercase mb-3 leading-tight">
          {advantage.title}
        </h4>
        <p className="text-muted-foreground italic text-sm leading-relaxed">
          {advantage.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
      <div>
        {leftColumn.map(renderAdvantage)}
      </div>
      <div>
        {rightColumn.map(renderAdvantage)}
      </div>
    </div>
  );
}
