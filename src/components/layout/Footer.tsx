import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCityContacts } from "@/hooks/useCityContacts";
import { useCity } from "@/contexts/CityContext";
import { CallbackDialog } from "./CallbackDialog";

const footerNavigation = {
  col1: [
    { name: "Новостройки", href: "/novostroyki" },
    { name: "Переуступка", href: "/novostroyki" },
    { name: "Эксклюзив", href: "/novostroyki" },
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
    { name: "Отзывы", href: "/otzyvy" },
    { name: "Контакты", href: "/kontakty" },
  ],
};

export function Footer() {
  const { data: contacts } = useCityContacts();
  const { currentCity } = useCity();

  const phoneNumber = contacts?.phone || "8 (812) 337-17-07";
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
  const address = contacts?.address || "г. Санкт-Петербург, ул. Пионерская, д. 34";

  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="container-wide py-12">
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
            <CallbackDialog>
              <Button 
                variant="outline" 
                className="border-white/40 text-white bg-white/10 hover:bg-white hover:text-navy"
              >
                Заказать звонок
              </Button>
            </CallbackDialog>
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
          {/* Social icons */}
          <div className="flex gap-4">
            {/* Telegram */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            {/* VK */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
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
        <div className="container-wide py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs">
            <p>
              © «Арт Истейт». Экспертное агентство по продаже недвижимости. Не является офертой.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-white/60 transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
