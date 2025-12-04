import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";

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
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4">
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
            {reviews[currentIndex]?.content}
          </p>
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
