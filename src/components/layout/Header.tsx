import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Phone, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CitySelector } from "./CitySelector";
import { useCityContacts } from "@/hooks/useCityContacts";
import { CallbackDialog } from "./CallbackDialog";
import { PropertyMegaMenu } from "./PropertyMegaMenu";
import logoImage from "@/assets/logo.png";
const mainNavigation = [{
  name: "Услуги",
  href: "/uslugi"
}, {
  name: "Ипотека",
  href: "/ipoteka"
}, {
  name: "Партнерам",
  href: "/partneram"
}, {
  name: "Статьи",
  href: "/blog"
}, {
  name: "О компании",
  href: "/o-kompanii"
}, {
  name: "Отзывы",
  href: "/otzyvy"
}, {
  name: "Акции",
  href: "/akcii"
}, {
  name: "Контакты",
  href: "/kontakty"
}];
const propertyDropdownItems = [{
  name: "Новостройки",
  href: "/novostroyki"
}, {
  name: "Вторичная недвижимость",
  href: "/vtorichnaya-nedvizhimost"
}, {
  name: "Эксклюзив",
  href: "/ekskluziv"
}];

// Logo component using uploaded image
const Logo = () => <Link to="/" className="flex items-center">
    <img alt="Art Estate - Агентство недвижимости" className="h-12 w-auto" src="/lovable-uploads/0283c99c-7b5c-45dc-8920-cb5b09be1c84.png" />
  </Link>;
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const location = useLocation();
  const {
    data: contacts
  } = useCityContacts();
  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };
  const phoneNumber = contacts?.phone || "8 (812) 389-33-56";
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
  return <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-sm">
      {/* Top bar - white solid background */}
      <div className="border-b border-white/10">
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
              <CitySelector />
              <a href={phoneHref} className="text-sm font-medium text-white hover:text-primary transition-colors flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {phoneNumber}
              </a>
              <CallbackDialog>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black uppercase text-xs tracking-wider px-6 font-medium">
                  Заказать звонок
                </Button>
              </CallbackDialog>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-black text-white">
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="mb-4">
                    <CitySelector />
                  </div>
                  <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 hover:text-primary transition-colors">
                    Главная
                  </Link>
                  
                  {/* Property section in mobile */}
                  <div className="space-y-2">
                    <span className="text-sm text-white/50 uppercase tracking-wider">Недвижимость</span>
                    {propertyDropdownItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className="block text-lg font-medium py-2 pl-4 transition-colors hover:text-primary">
                        {item.name}
                      </Link>)}
                  </div>
                  
                  {mainNavigation.map(item => <Link key={item.href + item.name} to={item.href} onClick={() => setIsOpen(false)} className={`text-lg font-medium py-2 transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-white/80"}`}>
                      {item.name}
                    </Link>)}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <a href={phoneHref} className="flex items-center gap-2 text-lg font-medium mb-4">
                      <Phone className="h-5 w-5" />
                      {phoneNumber}
                    </a>
                    <CallbackDialog>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Заказать звонок
                      </Button>
                    </CallbackDialog>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Secondary navigation - solid background */}
      <div className="hidden lg:block bg-black text-white border-t border-white/10">
        <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center h-11">
            {/* Category button - opens mega menu */}
            <button onClick={() => setIsMegaMenuOpen(true)} className="flex items-center gap-2 px-5 h-full bg-coral text-white cursor-pointer hover:bg-coral-light transition-colors outline-none">
              <Menu className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Вся недвижимость</span>
            </button>

            {/* Search */}
            <Link to="/novostroyki" className="flex items-center gap-2 px-4 text-white/50 cursor-pointer hover:text-white/80 transition-colors">
              <Search className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Поиск</span>
            </Link>

            {/* Main navigation */}
            <nav className="flex items-center ml-auto">
              {mainNavigation.map(item => <Link key={item.href + item.name} to={item.href} className={`px-4 h-11 flex items-center text-xs font-medium uppercase tracking-wider transition-colors hover:text-coral ${isActive(item.href) ? "text-coral" : "text-white/70"}`}>
                  {item.name}
                </Link>)}
            </nav>
          </div>
        </div>
      </div>

      {/* Property Mega Menu */}
      <PropertyMegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </header>;
}