import { HexagonPattern } from "@/components/ui/HexagonPattern";

interface ServiceHeroProps {
  title: string;
  introText?: string | null;
  mainImage?: string | null;
}

export function ServiceHero({ title, introText, mainImage }: ServiceHeroProps) {
  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80";

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={mainImage || defaultImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Decorative geometric element */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
        <HexagonPattern className="w-64 h-64 text-white" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
            {title}
          </h1>
          {introText && (
            <p className="text-lg md:text-xl text-white/90 leading-relaxed italic max-w-2xl">
              {introText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
