// Geometric hexagon pattern component
interface HexagonPatternProps {
  className?: string;
  variant?: "light" | "dark";
}

export function HexagonPattern({ className = "", variant = "light" }: HexagonPatternProps) {
  const strokeColor = variant === "light" ? "text-foreground/10" : "text-foreground/20";
  
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {/* Large gray hexagon */}
      <svg 
        viewBox="0 0 120 140" 
        className={`absolute w-32 h-40 top-0 right-20 ${strokeColor}`}
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

      {/* Small gray hexagon bottom right */}
      <svg 
        viewBox="0 0 80 92" 
        className={`absolute w-20 h-24 bottom-20 right-8 ${strokeColor}`}
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
    </div>
  );
}
