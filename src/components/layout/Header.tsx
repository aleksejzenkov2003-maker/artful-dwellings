import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mainNavigation = [
  { name: "Услуги", href: "/uslugi" },
  { name: "Ипотека", href: "/ipoteka" },
  { name: "Новости", href: "/blog" },
  { name: "О компании", href: "/o-kompanii" },
  { name: "Статьи", href: "/blog" },
  { name: "Акции", href: "/akcii" },
  { name: "Контакты", href: "/kontakty" },
];

const categoryNavigation = [
  { name: "Новостройки", href: "/novostroyki" },
  { name: "Вторичная недвижимость", href: "/vtorichnaya" },
  { name: "Переуступка", href: "/pereustupka" },
  { name: "Эксклюзив", href: "/exclusive" },
];

// Geometric logo component
const Logo = () => (
  <Link to="/" className="flex items-center gap-3">
    <div className="relative w-10 h-10">
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path
          d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
        <path
          d="M20 8L30 14V26L20 32L10 26V14L20 8Z"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary/60"
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" className="text-primary" />
      </svg>
    </div>
    <span className="text-lg font-sans font-medium tracking-widest uppercase">
      Art Estate
    </span>
  </Link>
);

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>RU</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Санкт-Петербург</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <a
                href="tel:+78123893356"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                8 (812) 389-33-56
              </a>
              <Button 
                variant="outline" 
                className="border-foreground/20 hover:border-primary hover:text-primary"
              >
                Заказать звонок
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-navy text-white">
                <nav className="flex flex-col gap-4 mt-8">
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
                      href="tel:+78123893356"
                      className="flex items-center gap-2 text-lg font-medium mb-4"
                    >
                      <Phone className="h-5 w-5" />
                      8 (812) 389-33-56
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

      {/* Secondary navigation */}
      <div className="hidden lg:block bg-navy text-white">
        <div className="container mx-auto">
          <div className="flex items-center h-12">
            {/* Category dropdown */}
            <div className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
              <Menu className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Вся недвижимость</span>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-4 text-white/60">
              <Search className="h-4 w-4" />
              <span className="text-sm">Поиск</span>
            </div>

            {/* Main navigation */}
            <nav className="flex items-center ml-auto gap-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href + item.name}
                  to={item.href}
                  className={`px-4 py-3 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-white/80"
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
