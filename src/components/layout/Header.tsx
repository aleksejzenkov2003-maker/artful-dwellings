import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Главная", href: "/" },
  { name: "Новостройки", href: "/novostroyki" },
  { name: "Услуги", href: "/uslugi" },
  { name: "Ипотека", href: "/ipoteka" },
  { name: "О компании", href: "/o-kompanii" },
  { name: "Партнёрам", href: "/partneram" },
  { name: "Блог", href: "/blog" },
  { name: "Контакты", href: "/kontakty" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold tracking-tight">
              Art<span className="text-primary">Estate</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Phone & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+74952552000"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              +7 (495) 255-20-00
            </a>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Обратный звонок
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium py-2 transition-colors hover:text-primary ${
                      isActive(item.href) ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t border-border">
                  <a
                    href="tel:+74952552000"
                    className="flex items-center gap-2 text-lg font-medium mb-4"
                  >
                    <Phone className="h-5 w-5" />
                    +7 (495) 255-20-00
                  </a>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Обратный звонок
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
