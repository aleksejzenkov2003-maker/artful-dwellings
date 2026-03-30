import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BrokerReviewsProps {
  brokerId: string;
  compact?: boolean;
}

export function BrokerReviews({ brokerId, compact = false }: BrokerReviewsProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["broker-reviews", brokerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("broker_reviews")
        .select("*")
        .eq("broker_id", brokerId)
        .eq("is_published", true)
        .order("order_position")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!brokerId,
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-serif mb-6">
          Отзывы клиентов ({reviews.length})
        </h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-4 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/10" />

              {/* Author row with rating */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {review.author_photo ? (
                    <img
                      src={review.author_photo}
                      alt={review.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {review.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{review.author_name}</p>
                    {review.author_role && (
                      <p className="text-xs text-muted-foreground">
                        {review.author_role}
                      </p>
                    )}
                  </div>
                </div>
                <div>{renderStars(review.rating || 5)}</div>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif mb-8">
          Отзывы клиентов
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                {review.author_photo ? (
                  <img
                    src={review.author_photo}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{review.author_name}</p>
                  {review.author_role && (
                    <p className="text-sm text-muted-foreground">
                      {review.author_role}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">{renderStars(review.rating || 5)}</div>

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed line-clamp-5">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
