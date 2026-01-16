import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ComplexQuiz } from "./ComplexQuiz";

interface ComplexQuizBannerProps {
  complexName?: string;
}

export function ComplexQuizBanner({ complexName }: ComplexQuizBannerProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[400px] lg:min-h-[450px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920)`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-[450px] text-center">
          {/* Label */}
          <p className="text-primary text-[13px] uppercase tracking-[0.15em] font-medium mb-6">
            Пройдите тест и узнайте
          </p>
          
          {/* Title */}
          <h2 className="font-serif font-normal text-[32px] md:text-[42px] lg:text-[48px] leading-[1.15] text-white mb-10 max-w-3xl">
            Какая квартира в новостройке подходит именно вам?
          </h2>
          
          {/* Button */}
          <Button 
            onClick={() => setIsQuizOpen(true)}
            variant="outline"
            className="bg-white text-foreground border-white hover:bg-white/90 uppercase tracking-wider text-[13px] px-8 py-6"
          >
            Пройти тест сейчас
          </Button>
        </div>
      </section>

      {/* Quiz Modal */}
      <ComplexQuiz 
        open={isQuizOpen} 
        onOpenChange={setIsQuizOpen}
        complexName={complexName}
      />
    </>
  );
}
