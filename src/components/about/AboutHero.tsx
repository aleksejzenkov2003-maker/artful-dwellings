import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Hexagon decoration component - matching reference exactly
function HexagonDecor() {
  return (
    <div className="absolute right-0 top-0 h-full w-2/3 overflow-hidden pointer-events-none hidden lg:block">
      {/* Large gray wireframe hexagon - top right (complex geometry) */}
      <svg 
        viewBox="0 0 200 230" 
        className="absolute w-52 h-60 -top-4 right-24"
        style={{ color: '#9ca3af' }}
      >
        {/* Outer hexagon */}
        <path
          d="M100 10L180 56V164L100 210L20 164V56L100 10Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        {/* Middle hexagon */}
        <path
          d="M100 30L160 65V155L100 190L40 155V65L100 30Z"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.25"
        />
        {/* Inner hexagon */}
        <path
          d="M100 50L140 74V146L100 170L60 146V74L100 50Z"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="none"
          opacity="0.2"
        />
        {/* Cross lines inside */}
        <line x1="100" y1="10" x2="100" y2="210" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line x1="20" y1="110" x2="180" y2="110" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line x1="60" y1="56" x2="140" y2="164" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line x1="140" y1="56" x2="60" y2="164" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      </svg>

      {/* Medium coral/orange hexagon with A logo - middle right */}
      <svg 
        viewBox="0 0 140 162" 
        className="absolute w-36 h-40 top-16 right-0"
      >
        {/* Outer hexagon - coral color #BA846E */}
        <path
          d="M70 6L130 40V122L70 156L10 122V40L70 6Z"
          stroke="#BA846E"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Inner hexagon */}
        <path
          d="M70 22L112 48V114L70 140L28 114V48L70 22Z"
          stroke="#BA846E"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        {/* Letter A inside */}
        <text
          x="70"
          y="95"
          textAnchor="middle"
          fill="#BA846E"
          fontSize="42"
          fontFamily="serif"
          fontStyle="italic"
        >
          A
        </text>
      </svg>

      {/* Small teal hexagon - bottom right corner */}
      <svg 
        viewBox="0 0 100 116" 
        className="absolute w-28 h-32 bottom-0 right-8"
      >
        {/* Outer hexagon */}
        <path
          d="M50 6L90 30V86L50 110L10 86V30L50 6Z"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Inner hexagon */}
        <path
          d="M50 18L78 38V78L50 98L22 78V38L50 18Z"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        {/* Cross lines */}
        <line x1="50" y1="6" x2="50" y2="110" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
        <line x1="10" y1="58" x2="90" y2="58" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
      </svg>

      {/* Additional tiny gray hexagon - far bottom right */}
      <svg 
        viewBox="0 0 80 92" 
        className="absolute w-20 h-24 bottom-24 right-48"
        style={{ color: '#9ca3af' }}
      >
        <path
          d="M40 6L72 26V66L40 86L8 66V26L40 6Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
        />
        <line x1="40" y1="6" x2="40" y2="86" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line x1="8" y1="46" x2="72" y2="46" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      </svg>
    </div>
  );
}

export function AboutHero() {
  return (
    <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link 
            to="/" 
            className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Главная
          </Link>
        </div>

        {/* Label */}
        <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
          О компании
        </p>

        {/* Main headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif leading-tight max-w-3xl">
          Art Estate — команда, созданная профессионалами рынка недвижимости.
        </h1>
      </div>

      {/* Hexagon decorations */}
      <HexagonDecor />
    </section>
  );
}
