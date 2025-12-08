import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    title: "Большие квартиры в центре",
    subtitle: "Для тех кто понимает",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop",
  },
  {
    title: "Квартиры с террасой в готовых домах",
    subtitle: "Как в Европе",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=300&fit=crop",
  },
];

export function PropertyPromoBanner() {
  return (
    <div className="relative bg-[hsl(var(--navy-dark))] rounded-lg overflow-hidden">
      <div className="flex">
        {banners.map((banner, index) => (
          <div key={index} className="flex-1 relative group cursor-pointer">
            <div className="aspect-[2/1] overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                {banner.subtitle}
              </p>
              <h3 className="text-lg md:text-xl font-display text-white">
                {banner.title}
              </h3>
            </div>
            
            {/* Divider */}
            {index === 0 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-white/20" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
