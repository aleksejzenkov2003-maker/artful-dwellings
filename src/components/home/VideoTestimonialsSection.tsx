import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

export function VideoTestimonialsSection() {
  const { data: reviews } = useReviews();
  const displayReviews = reviews?.slice(0, 2) || [];

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
          Слово нашим клиентам
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {displayReviews.length > 0 ? (
            displayReviews.map((review) => (
              <div key={review.id} className="relative group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={review.author_photo || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=450&fit=crop"}
                    alt={review.author_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg" />
                
                {/* Play Button - bottom right */}
                <div className="absolute bottom-4 right-4 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                </div>

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-serif mb-1">
                    {review.author_name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {review.author_role || "Покупка квартиры в новостройке"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Placeholder testimonials
            [
              { name: "Мария", role: "Покупка квартиры в новостройке" },
              { name: "Николай", role: "Покупка квартиры в новостройке" },
            ].map((testimonial, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1438761681033-6461ffad8d80' : '1507003211169-0a1dd7228f2d'
                    }?w=600&h=450&fit=crop`}
                    alt={testimonial.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg" />
                
                {/* Play Button - bottom right */}
                <div className="absolute bottom-4 right-4 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-serif mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background uppercase text-xs tracking-wider">
            <Link to="/otzyvy">Все отзывы</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
