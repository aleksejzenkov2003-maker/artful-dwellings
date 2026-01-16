import { Link } from "react-router-dom";

const banners = [
  {
    title: "Большие квартиры в центре",
    subtitle: "Для тех кто понимает",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop",
    link: "/novostroyki?area_from=80",
  },
  {
    title: "Квартиры с террасой в готовых домах",
    subtitle: "Как в Европе",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=300&fit=crop",
    link: "/novostroyki?status=ready",
  },
];

export function PropertyPromoBanner() {
  return (
    <div className="bg-[hsl(var(--navy-dark))] rounded-lg overflow-hidden">
      <div className="flex">
        {banners.map((banner, index) => (
          <Link 
            key={index} 
            to={banner.link}
            className="flex-1 relative group"
          >
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
              <h3 className="text-lg md:text-xl font-display text-white group-hover:underline underline-offset-4">
                {banner.title}
              </h3>
            </div>
            
            {/* Divider */}
            {index === 0 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-white/20" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
