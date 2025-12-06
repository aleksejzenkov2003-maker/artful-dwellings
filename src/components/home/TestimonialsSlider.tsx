import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, ExternalLink } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";

// Source icons as simple SVG components
const YandexIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15h-2V7h2.5c2.5 0 4 1.5 4 3.5 0 1.5-.8 2.7-2 3.2l2.5 3.3h-2.3L12.5 14h-.5v3zm0-5h.5c1.1 0 2-.6 2-1.5S15.1 9 14 9h-.5v3z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const CianIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="#0468FF"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">C</text>
  </svg>
);

const AvitoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="#00AAFF"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
  </svg>
);

const getSourceIcon = (source: string | null) => {
  switch (source?.toLowerCase()) {
    case 'yandex':
      return <YandexIcon />;
    case 'google':
      return <GoogleIcon />;
    case 'cian':
      return <CianIcon />;
    case 'avito':
      return <AvitoIcon />;
    default:
      return null;
  }
};

const getSourceLabel = (source: string | null) => {
  switch (source?.toLowerCase()) {
    case 'yandex':
      return 'Яндекс Карты';
    case 'google':
      return 'Google Maps';
    case 'cian':
      return 'ЦИАН';
    case 'avito':
      return 'Авито';
    default:
      return null;
  }
};

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: reviews, isLoading } = useReviews();

  const nextSlide = () => {
    if (reviews) {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevSlide = () => {
    if (reviews) {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Skeleton className="h-4 w-48 mx-auto mb-8" />
        <div className="flex gap-6 justify-center">
          <Skeleton className="w-64 aspect-[3/4]" />
          <Skeleton className="w-64 aspect-[3/4]" />
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];
  const sourceIcon = getSourceIcon(currentReview?.source);
  const sourceLabel = getSourceLabel(currentReview?.source);

  return (
    <div className="relative">
      <div className="flex items-center justify-center mb-8">
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Слово нашим клиентам
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex gap-6 justify-center overflow-hidden">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`flex-shrink-0 w-full md:w-1/2 transition-all duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0 absolute"
              }`}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={review.author_photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"}
                    alt={review.author_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur p-4">
                  <h4 className="font-medium">{review.author_name}</h4>
                  <p className="text-xs text-primary uppercase tracking-wider">
                    {review.author_role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote text */}
        <div className="mt-8 text-center">
          <Quote className="h-8 w-8 text-primary/20 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {currentReview?.content}
          </p>
          
          {/* Source badge with link */}
          {currentReview?.source && (
            <div className="mt-6 flex items-center justify-center">
              {currentReview.source_url ? (
                <a
                  href={currentReview.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {sourceIcon}
                  <span>Отзыв на {sourceLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                  {sourceIcon}
                  <span>Отзыв с {sourceLabel}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="w-10 h-10 border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-10 h-10 border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
