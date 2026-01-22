import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    title: "Строящаяся",
    titleSecondLine: "недвижимость",
    subtitle: "КВАРТИРЫ В СТРОЯЩИХСЯ ДОМАХ",
    href: "/novostroyki",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop",
    popularLinks: [
      { name: "Студии", href: "/novostroyki?rooms=studio" },
      { name: "1-комнатные", href: "/novostroyki?rooms=1" },
      { name: "2-комнатные", href: "/novostroyki?rooms=2" },
      { name: "3-комнатные", href: "/novostroyki?rooms=3" },
    ],
  },
  {
    title: "Готовая",
    titleSecondLine: "недвижимость",
    subtitle: "КВАРТИРЫ ОТ СОБСТВЕННИКА",
    href: "/vtorichnaya-nedvizhimost",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=400&fit=crop",
    popularLinks: [
      { name: "До 5 млн", href: "/vtorichnaya-nedvizhimost?price_to=5000000" },
      { name: "5-10 млн", href: "/vtorichnaya-nedvizhimost?price_from=5000000&price_to=10000000" },
      { name: "10-20 млн", href: "/vtorichnaya-nedvizhimost?price_from=10000000&price_to=20000000" },
      { name: "Свыше 20 млн", href: "/vtorichnaya-nedvizhimost?price_from=20000000" },
    ],
  },
];

export function PropertyMegaMenu({ isOpen, onClose }: PropertyMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay - closes menu on click */}
      <div 
        className="fixed inset-0 bg-black/20 z-[45]" 
        style={{ top: '108px' }}
        onClick={onClose}
      />
      
      {/* Menu panel - opens below header */}
      <div 
        className="fixed left-0 right-0 z-[55] bg-coral animate-fade-in shadow-lg"
        style={{ top: '108px' }}
      >
        {/* Close button */}
        <div className="flex justify-center pt-6 pb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            <X className="h-4 w-4" />
            <span>Закрыть</span>
          </button>
        </div>

        {/* Content */}
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.href} className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Category Card with Image */}
                <Link
                  to={category.href}
                  onClick={onClose}
                  className="block relative h-[220px] group overflow-hidden"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-3xl font-serif text-white leading-tight">
                      <span className="block border-b-2 border-white/50 pb-1 mb-1">{category.title}</span>
                      <span className="block border-b-2 border-white/50 pb-1">{category.titleSecondLine}</span>
                    </h3>
                    <p className="text-white/80 text-xs uppercase tracking-wider mt-3">
                      {category.subtitle}
                    </p>
                  </div>
                </Link>

                {/* Popular Links */}
                <div className="p-6">
                  <p className="text-xs text-coral uppercase tracking-wider mb-4">
                    Популярные запросы
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.popularLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={onClose}
                        className="px-4 py-2 border border-border rounded-full text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
