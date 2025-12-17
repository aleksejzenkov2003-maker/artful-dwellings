import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { HexagonPattern } from "@/components/ui/HexagonPattern";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/useReviews";
import { Play, ChevronDown, Star } from "lucide-react";
import { ReviewSourceBadge } from "@/components/reviews/ReviewSourceBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REVIEWS_PER_PAGE = 10;

// Featured video testimonials data
const videoTestimonials = [
  {
    id: "1",
    name: "Мария",
    role: "покупка квартиры в новостройке",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
    videoUrl: "#",
  },
  {
    id: "2", 
    name: "Николай",
    role: "покупка вторичной недвижимости",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    videoUrl: "#",
  },
];

export default function Otzyvy() {
  const { data: reviews, isLoading } = useReviews();
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
  const [filter, setFilter] = useState("all");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const displayedReviews = reviews?.slice(0, visibleCount) || [];
  const hasMore = reviews && visibleCount < reviews.length;
  const totalCount = reviews?.length || 0;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + REVIEWS_PER_PAGE);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-[hsl(var(--navy-dark))] text-white py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=800&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy-dark))]/80 to-[hsl(var(--navy-dark))]/95" />
        </div>
        
        {/* Hexagon Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
          <HexagonPattern />
        </div>

        <div className="container-wide relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6">
            Отзывы
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Мы всегда рады получить от наших покупателей и партнеров отзывы о качестве продукции и сервиса.
            <br />
            Читайте истории наших клиентов и присылайте нам свои.
          </p>

          {/* Filter */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-white/60 text-sm uppercase tracking-wider">
              Отзывы по типу недвижимости
            </span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="novostroyki">Новостройки</SelectItem>
                <SelectItem value="vtorichnoe">Вторичное жильё</SelectItem>
                <SelectItem value="ipoteka">Ипотека</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Floating CTA Widget */}
      <div className="fixed left-0 top-1/3 z-40 hidden lg:block">
        <div className="bg-primary text-primary-foreground p-4 rounded-r-lg shadow-lg max-w-[180px]">
          <button className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full text-foreground text-sm flex items-center justify-center shadow">
            ×
          </button>
          <p className="text-xs mb-2">А вы довольны нашей работой?</p>
          <p className="text-sm font-medium mb-3">Пожалуйста, оставьте отзыв.</p>
          <Button size="sm" variant="secondary" className="w-full text-xs">
            Оставить отзыв
          </Button>
        </div>
      </div>

      {/* Video Testimonials */}
      <section className="py-0 -mt-16 relative z-20">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-6">
            {videoTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* Teal corner accent */}
                <div className="absolute bottom-0 right-0 w-24 h-24">
                  <div className="absolute bottom-0 right-0 w-full h-full border-r-4 border-b-4 border-primary" />
                </div>

                {/* Info */}
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-display text-white mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs text-white/70 uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Reviews Grid */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-wide">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {displayedReviews.map((review, index) => {
                  // Make every 3rd review full width
                  const isFullWidth = (index + 1) % 5 === 0;
                  
                  return (
                    <div
                      key={review.id}
                      className={`bg-card rounded-lg p-8 relative border border-border/50 ${
                        isFullWidth ? "md:col-span-2" : ""
                      }`}
                    >
                      {/* Decorative Quote */}
                      <div className="absolute top-6 right-8 text-primary/30 select-none">
                        <svg
                          width="60"
                          height="48"
                          viewBox="0 0 60 48"
                          fill="currentColor"
                          className="opacity-50"
                        >
                          <path d="M0 24.84C0 11.16 9 2.04 22.32 0L24 5.4C14.64 8.04 10.08 13.8 9.36 21.12C10.44 20.64 11.88 20.4 13.44 20.4C19.32 20.4 24 25.08 24 31.44C24 38.16 18.84 43.44 12 43.44C5.04 43.44 0 37.44 0 28.68V24.84ZM36 24.84C36 11.16 45 2.04 58.32 0L60 5.4C50.64 8.04 46.08 13.8 45.36 21.12C46.44 20.64 47.88 20.4 49.44 20.4C55.32 20.4 60 25.08 60 31.44C60 38.16 54.84 43.44 48 43.44C41.04 43.44 36 37.44 36 28.68V24.84Z" />
                        </svg>
                      </div>

                      <div className="relative">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-2xl font-display">
                              {review.author_name}
                            </h3>
                            <p className="text-xs text-primary uppercase tracking-wider">
                              {review.author_role}
                            </p>
                          </div>
                          {/* Rating Stars */}
                          {review.rating && (
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating!
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                          {review.content}
                        </p>
                        
                        {/* Source Badge */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-foreground/20 hover:border-primary hover:text-primary"
                            onClick={() => setExpandedReview(review.id)}
                          >
                            Читать полностью
                          </Button>
                          
                          <ReviewSourceBadge 
                            source={review.source} 
                            sourceUrl={review.source_url}
                            variant="compact"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Показать ещё 10 отзывов
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Показано {Math.min(visibleCount, totalCount)} из {totalCount}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Leave Review Form Section */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-wider mb-2 opacity-70">
              Оставить отзыв
            </p>
            <h2 className="text-2xl md:text-3xl font-display mb-8">
              Что вы думаете о нашей работе?
            </h2>
            
            <form className="space-y-4">
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/30" />
                  <span className="text-sm">Покупка квартиры в новостройке</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/30" />
                  <span className="text-sm">Покупка вторичной недвижимости</span>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Имя"
                  className="bg-white/10 border border-white/20 rounded px-4 py-3 placeholder:text-white/50 focus:outline-none focus:border-white/50"
                />
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Телефон"
                    className="flex-1 bg-white/10 border border-white/20 rounded px-4 py-3 placeholder:text-white/50 focus:outline-none focus:border-white/50"
                  />
                  <span className="flex items-center text-white/50 text-sm">или</span>
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="flex-1 bg-white/10 border border-white/20 rounded px-4 py-3 placeholder:text-white/50 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Что вы думаете о нашей работе?"
                className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 placeholder:text-white/50 focus:outline-none focus:border-white/50 resize-none"
              />

              <div className="flex items-start gap-2 mb-4">
                <input type="checkbox" id="agree" className="mt-1 rounded border-white/30" />
                <label htmlFor="agree" className="text-xs text-white/70 leading-relaxed">
                  Я согласен с политикой обработки персональных данных и принимаю условия политики конфиденциальности сайта Art Estate.
                </label>
              </div>

              <Button variant="secondary" size="lg">
                Отправить отзыв
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Expanded Review Modal */}
      <Dialog open={!!expandedReview} onOpenChange={() => setExpandedReview(null)}>
        <DialogContent className="max-w-2xl">
          {(() => {
            const review = reviews?.find((r) => r.id === expandedReview);
            if (!review) return null;
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="font-display text-2xl">
                        {review.author_name}
                      </DialogTitle>
                      <p className="text-xs text-primary uppercase tracking-wider mt-1">
                        {review.author_role}
                      </p>
                    </div>
                    {review.rating && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating!
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </DialogHeader>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {review.content}
                </p>
                {review.source && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <ReviewSourceBadge 
                      source={review.source} 
                      sourceUrl={review.source_url}
                    />
                  </div>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
