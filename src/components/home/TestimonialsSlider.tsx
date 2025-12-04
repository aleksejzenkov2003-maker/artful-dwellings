import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Мария",
    role: "Клиент Art Estate",
    text: "Благодаря команде Art Estate мы нашли квартиру нашей мечты! Профессиональный подход и внимание к деталям — это то, что отличает эту компанию от других.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    id: 2,
    name: "Николай",
    role: "Клиент Art Estate",
    text: "Отличный сервис! Менеджеры помогли разобраться во всех нюансах ипотеки и подобрали оптимальные условия. Рекомендую всем, кто ищет надежного партнера.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    id: 3,
    name: "Елена",
    role: "Клиент Art Estate",
    text: "Работать с Art Estate — одно удовольствие. Команда профессионалов, которые действительно заботятся о клиенте и его интересах.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
];

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center mb-8">
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Слово нашим клиентам
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex gap-6 overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
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
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-xs text-primary uppercase tracking-wider">
                    {testimonial.role}
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
            {testimonials[currentIndex].text}
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
            {testimonials.map((_, index) => (
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
