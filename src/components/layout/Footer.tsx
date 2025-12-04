import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const footerNavigation = {
  company: [
    { name: "О компании", href: "/o-kompanii" },
    { name: "Команда", href: "/o-kompanii#team" },
    { name: "Партнёрам", href: "/partneram" },
    { name: "Контакты", href: "/kontakty" },
  ],
  services: [
    { name: "Новостройки", href: "/novostroyki" },
    { name: "Услуги", href: "/uslugi" },
    { name: "Ипотека", href: "/ipoteka" },
    { name: "Блог", href: "/blog" },
  ],
  social: [
    { name: "Telegram", href: "https://t.me/artestate", icon: "tg" },
    { name: "WhatsApp", href: "https://wa.me/74952552000", icon: "wa" },
    { name: "VK", href: "https://vk.com/artestate", icon: "vk" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-serif font-bold tracking-tight">
                Art<span className="text-primary">Estate</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Агентство премиальной недвижимости. Помогаем найти идеальный дом с 2015 года.
            </p>
            <div className="flex gap-4">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <span className="text-xs font-bold">{item.icon.toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Компания
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Услуги
            </h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Контакты
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+74952552000"
                  className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  +7 (495) 255-20-00
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@art-estate.top"
                  className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  info@art-estate.top
                </a>
              </li>
              <li>
                <a
                  href="https://yandex.ru/maps/-/CDUwrXMB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/70 hover:text-primary transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Москва, ул. Примерная, д. 1
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Art Estate. Все права защищены.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-white/50 hover:text-white/70 transition-colors text-sm"
              >
                Политика конфиденциальности
              </Link>
              <Link
                to="/terms"
                className="text-white/50 hover:text-white/70 transition-colors text-sm"
              >
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
