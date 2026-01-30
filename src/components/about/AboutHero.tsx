import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Hexagon decoration component
function HexagonDecor() {
  return (
    <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden pointer-events-none">
      {/* Large gray hexagon - top right */}
      <svg 
        viewBox="0 0 120 140" 
        className="absolute w-40 h-48 top-8 right-32 text-muted-foreground/15"
      >
        <path
          d="M60 5L110 35V105L60 135L10 105V35L60 5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M60 20L95 42V98L60 120L25 98V42L60 20Z"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>

      {/* Medium orange hexagon - middle */}
      <svg 
        viewBox="0 0 100 116" 
        className="absolute w-28 h-32 top-32 right-56 text-accent"
      >
        <path
          d="M50 4L92 28V76L50 100L8 76V28L50 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M50 16L80 34V70L50 88L20 70V34L50 16Z"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>

      {/* Small teal hexagon - bottom right */}
      <svg 
        viewBox="0 0 80 92" 
        className="absolute w-20 h-24 bottom-16 right-16 text-primary"
      >
        <path
          d="M40 4L72 24V64L40 84L8 64V24L40 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M40 14L62 28V56L40 70L18 56V28L40 14Z"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>

      {/* Tiny gray hexagon - far right */}
      <svg 
        viewBox="0 0 60 70" 
        className="absolute w-14 h-16 top-48 right-8 text-muted-foreground/20"
      >
        <path
          d="M30 4L54 18V50L30 64L6 50V18L30 4Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
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
