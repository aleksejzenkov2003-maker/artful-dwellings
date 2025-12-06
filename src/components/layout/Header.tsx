import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CitySelector } from "./CitySelector";
import { useCityContacts } from "@/hooks/useCityContacts";

const mainNavigation = [
  { name: "Услуги", href: "/uslugi" },
  { name: "Ипотека", href: "/ipoteka" },
  { name: "Статьи", href: "/blog" },
  { name: "О компании", href: "/o-kompanii" },
  { name: "Партнёрам", href: "/partneram" },
  { name: "Акции", href: "/akcii" },
  { name: "Контакты", href: "/kontakty" },
];

// Geometric logo component - white version for transparent header
const Logo = () => (
  <Link to="/" className="flex items-center gap-3">
    <div className="relative w-10 h-10">
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path
          d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/40"
        />
        <path
          d="M20 8L30 14V26L20 32L10 26V14L20 8Z"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-white/30"
        />
        <text
          x="20"
          y="24"
          textAnchor="middle"
          className="text-white fill-current"
          style={{ fontSize: '12px', fontFamily: 'Cormorant Garamond, serif' }}
        >
          A
        </text>
      </svg>
    </div>
    <span className="text-sm font-sans font-medium tracking-[0.2em] uppercase text-white">
      Art Estate
    </span>
  </Link>
);

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: contacts } = useCityContacts();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const phoneNumber = contacts?.phone || "8 (812) 389-33-56";
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar - transparent with subtle backdrop */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-1 text-sm text-white/70 cursor-pointer hover:text-white transition-colors">
                <span>RU</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <CitySelector variant="light" />
              <a
                href={phoneHref}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {phoneNumber}
              </a>
              <Button 
                variant="outline" 
                className="border-white text-white bg-transparent hover:bg-white hover:text-black uppercase text-xs tracking-wider px-6"
              >
                Заказать звонок
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-navy text-white">
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="mb-4">
                    <CitySelector />
                  </div>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                  >
                    Главная
                  </Link>
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.href + item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium py-2 transition-colors hover:text-primary ${
                        isActive(item.href) ? "text-primary" : "text-white/80"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <a
                      href={phoneHref}
                      className="flex items-center gap-2 text-lg font-medium mb-4"
                    >
                      <Phone className="h-5 w-5" />
                      {phoneNumber}
                    </a>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Заказать звонок
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Secondary navigation - no gap with top bar */}
      <div className="hidden lg:block bg-navy/80 backdrop-blur-sm text-white">
        <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center h-11">
            {/* Category dropdown */}
            <div className="flex items-center gap-2 px-5 h-full bg-coral text-white cursor-pointer hover:bg-coral/90 transition-colors">
              <Menu className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Вся недвижимость</span>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-4 text-white/50 cursor-pointer hover:text-white/80 transition-colors">
              <Search className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Поиск</span>
            </div>

            {/* Main navigation */}
            <nav className="flex items-center ml-auto">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href + item.name}
                  to={item.href}
                  className={`px-4 h-11 flex items-center text-xs font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-white/70"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
