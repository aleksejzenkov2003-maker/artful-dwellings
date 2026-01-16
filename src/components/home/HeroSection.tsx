import { useState } from "react";
import { TealButton } from "@/components/ui/teal-button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import heroTeamImage from "@/assets/hero-team.jpg";

const categories = [
  {
    title: "Квартиры",
    subtitle: "от застройщиков",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
    link: "/novostroyki",
  },
  {
    title: "Квартиры",
    subtitle: "по переуступке",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop",
    link: "/novostroyki",
  },
  {
    title: "Квартиры",
    subtitle: "на вторичном рынке",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&h=500&fit=crop",
    link: "/novostroyki",
  },
];

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative">
        {/* Main Hero Area */}
        <div className="relative min-h-[70vh] flex flex-col justify-center">
          {/* Background Image - team photo for all cities */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${heroTeamImage}')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy-dark))]/40 via-transparent to-[hsl(var(--navy-dark))]/60" />
          </div>

          {/* Content - bottom buttons */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Video presentation button */}
                <button 
                  onClick={() => setIsVideoOpen(true)}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <svg className="w-5 h-5 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium tracking-wide uppercase">Видео-презентация</p>
                    <p className="text-white text-sm font-medium tracking-wide uppercase">компании Art Estate</p>
                  </div>
                </button>
                
                {/* Consultation button */}
                <TealButton size="xl" className="uppercase tracking-wider">
                  Бесплатная консультация
                </TealButton>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards - Full width, edge-to-edge */}
        <div className="relative z-10 flex flex-col md:flex-row">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative flex-1 h-[200px] md:h-[240px] lg:h-[280px] overflow-hidden"
            >
              {/* Card Image */}
              <img
                src={category.image}
                alt={`${category.title} ${category.subtitle}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-dark))]/90 via-[hsl(var(--navy-dark))]/50 to-[hsl(var(--navy-dark))]/20" />
              
              {/* Diagonal separator - left side (not for first card) */}
              {index > 0 && (
                <div 
                  className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[hsl(var(--navy-dark))]/60 to-transparent hidden md:block"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                  }}
                />
              )}
              
              {/* Turquoise corner accent - top left */}
              <div className="absolute top-5 left-5 z-10">
                <div className="w-8 h-8 relative">
                  <div className="absolute top-0 left-0 w-6 h-[2px] bg-primary" />
                  <div className="absolute top-0 left-0 w-[2px] h-6 bg-primary" />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-serif leading-snug">
                  <span className="block">{category.title}</span>
                  <span className="block">{category.subtitle}</span>
                </p>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-none">
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="aspect-video">
            <video
              src="/videos/company-presentation.mp4"
              controls
              autoPlay
              className="w-full h-full"
            >
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
