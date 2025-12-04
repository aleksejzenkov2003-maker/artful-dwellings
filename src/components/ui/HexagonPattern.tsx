// Geometric hexagon pattern component
interface HexagonPatternProps {
  className?: string;
}

export function HexagonPattern({ className = "" }: HexagonPatternProps) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {/* Large gray hexagon */}
      <svg 
        viewBox="0 0 120 140" 
        className="absolute w-32 h-40 top-0 right-20 text-foreground/10"
      >
        <path
          d="M60 5L110 35V105L60 135L10 105V35L60 5Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M60 20L95 42V98L60 120L25 98V42L60 20Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
      
      {/* Medium coral hexagon with A */}
      <svg 
        viewBox="0 0 100 115" 
        className="absolute w-28 h-32 top-16 right-0 text-coral"
      >
        <path
          d="M50 5L90 30V80L50 105L10 80V30L50 5Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M50 18L80 38V72L50 92L20 72V38L50 18Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          className="fill-current"
          style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, serif' }}
        >
          A
        </text>
      </svg>

      {/* Small gray hexagon bottom right */}
      <svg 
        viewBox="0 0 80 92" 
        className="absolute w-20 h-24 bottom-20 right-8 text-foreground/15"
      >
        <path
          d="M40 4L72 24V64L40 84L8 64V24L40 4Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M40 14L62 28V56L40 70L18 56V28L40 14Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* Tiny coral hexagon */}
      <svg 
        viewBox="0 0 60 70" 
        className="absolute w-12 h-14 bottom-8 right-24 text-coral/60"
      >
        <path
          d="M30 4L54 18V46L30 60L6 46V18L30 4Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}
