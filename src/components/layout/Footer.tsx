import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCityContacts } from "@/hooks/useCityContacts";
import { useCity } from "@/contexts/CityContext";

const footerNavigation = {
  col1: [
    { name: "Новостройки", href: "/novostroyki" },
    { name: "Готовая недвижимость", href: "/gotovaya-nedvizhimost" },
  ],
  col2: [
    { name: "О компании", href: "/o-kompanii" },
    { name: "Партнёрам", href: "/partneram" },
  ],
  col3: [
    { name: "Услуги", href: "/uslugi" },
    { name: "Ипотека", href: "/ipoteka" },
    { name: "Новости", href: "/blog" },
  ],
  col4: [
    { name: "Акции", href: "/akcii" },
    { name: "Контакты", href: "/kontakty" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: "tw" },
  { name: "Instagram", icon: "ig" },
  { name: "Facebook", icon: "fb" },
];

export function Footer() {
  const { data: contacts } = useCityContacts();
  const { currentCity } = useCity();

  const phoneNumber = contacts?.phone || "8 (812) 337-17-07";
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
  const address = contacts?.address || "г. Санкт-Петербург, ул. Пионерская, д. 34";

  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Phone and CTA */}
          <div className="lg:col-span-2">
            <a
              href={phoneHref}
              className="text-2xl font-medium mb-2 block hover:text-primary transition-colors"
            >
              {phoneNumber}
            </a>
            <p className="text-white/50 text-sm mb-2">
              {contacts?.working_hours || "Работаем без выходных и праздников"}
            </p>
            {currentCity && (
              <p className="text-primary text-sm mb-6">
                {currentCity.name}, {currentCity.country}
              </p>
            )}
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:border-primary hover:text-primary"
            >
              Заказать звонок
            </Button>
          </div>

          {/* Navigation columns */}
          <div>
            <ul className="space-y-3">
              {footerNavigation.col1.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              {footerNavigation.col2.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              {footerNavigation.col3.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              {footerNavigation.col4.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company info and social */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-primary transition-colors"
              >
                <span className="text-xs font-medium">{item.icon}</span>
              </a>
            ))}
          </div>

          <div className="text-right text-white/50 text-sm">
            <p>ООО «Арт Истейт»</p>
            <p>{address}</p>
            <p>ИНН 7814539250 ОГРН 11 27847316024</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs">
            <p>
              © «Арт Истейт». Экспертное агентство по продаже недвижимости. Не является офертой.
            </p>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
