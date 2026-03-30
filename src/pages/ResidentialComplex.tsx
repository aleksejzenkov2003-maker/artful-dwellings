import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useResidentialComplex } from "@/hooks/useResidentialComplexes";
import { useApartmentStats } from "@/hooks/useApartments";
import {
  ArrowLeft,
  Phone,
  MapPin,
  ChevronDown,
  Play,
  Share2,
  Clock,
  Train,
  Calendar,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResidentialComplex as ComplexType } from "@/hooks/useResidentialComplexes";
import type { PageContent } from "@/types/pageContent";
import { ComplexPresentationButton } from "@/components/complex/ComplexPresentationButton";

/* ─── helpers ─── */

function formatCompletionDate(date: string | null): string {
  if (!date) return "Уточняйте";
  const d = new Date(date);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `${q} квартал ${d.getFullYear()}`;
}

function formatPrice(price: number | null): string {
  if (!price) return "По запросу";
  if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(1).replace(".0", "") + " млн ₽";
  }
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

/* ─── Hero ─── */

function HeroSection({
  complex,
  content,
}: {
  complex: ComplexType;
  content: PageContent;
}) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: complex.name, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const phone = content.phone || "+7 (800) 000-00-00";

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${complex.main_image || "/placeholder.svg"})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/95 via-[#111]/50 to-[#111]/30" />

      {/* top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 lg:px-16 pt-6">
        <Link
          to="/novostroyki"
          className="flex items-center gap-2 text-white/60 hover:text-white transition text-xs uppercase tracking-[.15em]"
        >
          <ArrowLeft className="h-4 w-4" />
          Каталог
        </Link>
        <div className="flex items-center gap-6">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition text-sm"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <button
            onClick={handleShare}
            className="text-white/40 hover:text-white transition"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* main content */}
      <div className="relative z-10 mt-auto px-6 lg:px-16 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          {/* left */}
          <div className="lg:col-span-7 text-white">
            <span className="inline-block px-4 py-1.5 border border-white/20 text-[10px] uppercase tracking-[.2em] text-white/70 mb-8">
              {complex.status === "ready" || complex.status === "completed"
                ? "Сдан"
                : complex.status === "building"
                  ? "Строится"
                  : "В продаже"}
            </span>

            <p className="text-[10px] uppercase tracking-[.25em] text-white/40 mb-3">
              Жилой комплекс
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-4">
              {complex.name}
            </h1>

            {content.hero_title && (
              <p className="text-sm md:text-base text-white/50 max-w-lg mb-10 leading-relaxed">
                {content.hero_title}
              </p>
            )}

            <ComplexPresentationButton complex={complex} />
          </div>

          {/* right info grid */}
          <div className="lg:col-span-5 text-white">
            <div className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-5 text-sm">
              {complex.address && (
                <>
                  <span className="text-white/40 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> Адрес
                  </span>
                  <span>{complex.address}</span>
                </>
              )}
              {content.metro_station && (
                <>
                  <span className="text-white/40 flex items-center gap-2">
                    <Train className="h-3.5 w-3.5" /> Метро
                  </span>
                  <span>{content.metro_station}</span>
                </>
              )}
              <span className="text-white/40 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Сдача
              </span>
              <span>{formatCompletionDate(complex.completion_date)}</span>

              {complex.developer && (
                <>
                  <span className="text-white/40 flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Застройщик
                  </span>
                  <span>{complex.developer}</span>
                </>
              )}
              {content.work_hours && (
                <>
                  <span className="text-white/40 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Часы
                  </span>
                  <span>{content.work_hours}</span>
                </>
              )}
            </div>

            {/* price range */}
            {(complex.price_from || complex.price_to) && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[.2em] text-white/40 mb-2">
                  Цена
                </p>
                <p className="text-2xl font-light">
                  от {formatPrice(complex.price_from)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/30 hover:text-white/60 transition animate-bounce"
      >
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
}

/* ─── About ─── */

function AboutSection({
  complex,
  content,
}: {
  complex: ComplexType;
  content: PageContent;
}) {
  const text = content.about_text || complex.description;
  const images = content.about_images?.length
    ? content.about_images
    : (() => {
        const imgs: string[] = [];
        if (complex.main_image) imgs.push(complex.main_image);
        if (Array.isArray(complex.images)) {
          complex.images.forEach((item: unknown) => {
            if (typeof item === "string") imgs.push(item);
            else if (item && typeof item === "object" && "url" in item) {
              const u = (item as { url?: string }).url;
              if (u) imgs.push(u);
            }
          });
        }
        return imgs;
      })();

  if (!text && images.length === 0) return null;

  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* text */}
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-neutral-400 mb-3">
              О проекте
            </p>
            <h2 className="text-3xl md:text-4xl font-light leading-tight mb-8 text-neutral-900">
              {complex.name}
            </h2>
            {text && (
              <div
                className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}

            {/* key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-neutral-200">
              {complex.floors_count && (
                <div>
                  <p className="text-2xl font-light text-neutral-900">
                    {complex.floors_count}
                  </p>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">
                    Этажей
                  </p>
                </div>
              )}
              {complex.apartments_count && (
                <div>
                  <p className="text-2xl font-light text-neutral-900">
                    {complex.apartments_count}
                  </p>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">
                    Квартир
                  </p>
                </div>
              )}
              {(complex.area_from || complex.area_to) && (
                <div>
                  <p className="text-2xl font-light text-neutral-900">
                    {complex.area_from}–{complex.area_to}
                  </p>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">
                    м²
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* gallery grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {images.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className={`overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
                >
                  <img
                    src={src}
                    alt={`${complex.name} фото ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Video ─── */

function VideoSection({ content }: { content: PageContent }) {
  const [playing, setPlaying] = useState(false);

  if (!content.video_url) return null;

  const getEmbedUrl = (url: string): string => {
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    return url;
  };

  return (
    <section className="py-20 lg:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <p className="text-[10px] uppercase tracking-[.25em] text-neutral-400 mb-3">
          Видео
        </p>
        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-10 text-neutral-900">
          Посмотрите видео о проекте
        </h2>

        <div className="relative aspect-video bg-neutral-900 overflow-hidden">
          {playing ? (
            <iframe
              src={getEmbedUrl(content.video_url)}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full flex items-center justify-center group"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition backdrop-blur-sm">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Infrastructure ─── */

function InfrastructureSection({
  complex,
  content,
}: {
  complex: ComplexType;
  content: PageContent;
}) {
  const items =
    content.infrastructure_items && content.infrastructure_items.length > 0
      ? content.infrastructure_items
      : Array.isArray(complex.infrastructure)
        ? (complex.infrastructure as string[]).map((s) => ({
            title: s,
            description: "",
          }))
        : [];

  const text = content.infrastructure_text;

  if (!text && items.length === 0) return null;

  return (
    <section id="infrastructure" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-neutral-400 mb-3">
              Расположение
            </p>
            <h2 className="text-3xl md:text-4xl font-light leading-tight mb-8 text-neutral-900">
              Инфраструктура
            </h2>
            {text && (
              <div
                className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>

          {items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="p-6 border border-neutral-100 hover:border-neutral-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-900 text-sm mb-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Virtual Tour ─── */

function TourSection({ content }: { content: PageContent }) {
  if (!content.panorama_url) return null;

  return (
    <section id="tour" className="py-20 lg:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <p className="text-[10px] uppercase tracking-[.25em] text-neutral-400 mb-3">
          360°
        </p>
        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-10 text-neutral-900">
          Виртуальная прогулка
        </h2>
        <div className="relative aspect-video bg-neutral-200 overflow-hidden">
          <iframe
            src={content.panorama_url}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Apartments ─── */

const ROOM_NAMES: Record<string, string> = {
  studio: "Студии",
  "1": "1-комнатные",
  "2": "2-комнатные",
  "3": "3-комнатные",
  "4": "4-комнатные",
  "5+": "5+ комнат",
};

function ApartmentsSection({ complex }: { complex: ComplexType }) {
  const { data: stats } = useApartmentStats(complex.id);
  const types = ["studio", "1", "2", "3", "4", "5+"];
  const available = types.filter((t) => stats?.stats[t]?.count > 0);

  return (
    <section id="apartments" className="py-20 lg:py-32 bg-[#111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <p className="text-[10px] uppercase tracking-[.25em] text-white/40 mb-3">
          Планировки
        </p>
        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-12 text-white">
          Квартиры в продаже
        </h2>

        {available.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {available.map((type) => {
              const s = stats!.stats[type];
              return (
                <div
                  key={type}
                  className="border border-white/10 p-8 hover:border-amber-600/40 transition group"
                >
                  <p className="text-[10px] uppercase tracking-[.2em] text-white/40 mb-2">
                    {ROOM_NAMES[type]}
                  </p>
                  <p className="text-4xl font-light text-white mb-6">
                    {s.count}{" "}
                    <span className="text-base text-white/30">
                      {s.count === 1
                        ? "квартира"
                        : s.count < 5
                          ? "квартиры"
                          : "квартир"}
                    </span>
                  </p>
                  <div className="space-y-3 text-sm border-t border-white/10 pt-6">
                    <div className="flex justify-between">
                      <span className="text-white/40">Площадь</span>
                      <span className="text-white">
                        {s.minArea === s.maxArea
                          ? `${s.minArea} м²`
                          : `${s.minArea}–${s.maxArea} м²`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Цена от</span>
                      <span className="text-amber-500 font-medium">
                        {formatPrice(s.minPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-white/10">
            <p className="text-white/40 mb-2">Квартиры пока не добавлены</p>
            <p className="text-white/20 text-sm">
              Свяжитесь с нами для получения актуального каталога
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Mortgage ─── */

function MortgageSection({ content }: { content: PageContent }) {
  const text = content.mortgage_text;
  const conditions = content.mortgage_conditions;

  if (!text && (!conditions || conditions.length === 0)) return null;

  return (
    <section id="mortgage" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <p className="text-[10px] uppercase tracking-[.25em] text-neutral-400 mb-3">
          Покупка
        </p>
        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-10 text-neutral-900">
          Условия ипотеки
        </h2>

        {text && (
          <div
            className="prose prose-neutral max-w-3xl text-neutral-600 leading-relaxed mb-10"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}

        {conditions && conditions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((c, i) => (
              <div key={i} className="p-6 bg-neutral-50 border border-neutral-100">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                  {c.title}
                </p>
                <p className="text-xl font-light text-neutral-900">{c.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── FAQ ─── */

function FAQSection({ content }: { content: PageContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!content.faq || content.faq.length === 0) return null;

  return (
    <section id="faq" className="py-20 lg:py-32 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        <p className="text-[10px] uppercase tracking-[.25em] text-neutral-400 mb-3">
          Вопросы
        </p>
        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-12 text-neutral-900">
          Частые вопросы
        </h2>

        <div className="divide-y divide-neutral-200">
          {content.faq.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className="text-base font-medium text-neutral-900 pr-8 group-hover:text-amber-700 transition">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-96 pb-6" : "max-h-0"}`}
              >
                <p className="text-neutral-600 leading-relaxed text-sm">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contacts ─── */

function ContactsSection({
  complex,
  content,
}: {
  complex: ComplexType;
  content: PageContent;
}) {
  const phone = content.contact_phone || content.phone;
  const email = content.contact_email;

  return (
    <section id="contacts" className="py-20 lg:py-32 bg-[#111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-white/40 mb-3">
              Контакты
            </p>
            <h2 className="text-3xl md:text-4xl font-light leading-tight mb-8 text-white">
              Свяжитесь с нами
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-md">
              Оставьте заявку или позвоните нам — мы расскажем всё о проекте,
              подберём подходящую квартиру и организуем экскурсию.
            </p>
          </div>

          <div className="space-y-8">
            {phone && (
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] text-white/30 mb-2">
                  Телефон
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-2xl font-light text-white hover:text-amber-500 transition"
                >
                  {phone}
                </a>
              </div>
            )}
            {email && (
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] text-white/30 mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${email}`}
                  className="text-lg text-white/70 hover:text-white transition"
                >
                  {email}
                </a>
              </div>
            )}
            {complex.address && (
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] text-white/30 mb-2">
                  Адрес
                </p>
                <p className="text-lg text-white/70">
                  {complex.city ? `${complex.city}, ` : ""}
                  {complex.address}
                </p>
              </div>
            )}
            {content.work_hours && (
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] text-white/30 mb-2">
                  Режим работы
                </p>
                <p className="text-lg text-white/70">{content.work_hours}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-white/20 text-xs">
          © {new Date().getFullYear()} {complex.developer || "Art Estate"}. Все
          права защищены.
        </div>
      </div>
    </section>
  );
}

/* ─── Loading / Error states ─── */

function LoadingSkeleton() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#111]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-64 bg-white/10" />
        <Skeleton className="h-4 w-40 bg-white/5" />
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white">
      <h1 className="text-3xl font-light mb-4">ЖК не найден</h1>
      <p className="text-white/40 mb-8">
        Запрашиваемый жилой комплекс не существует или был удалён
      </p>
      <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
        <Link to="/novostroyki">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться к каталогу
        </Link>
      </Button>
    </section>
  );
}

/* ─── Page Component ─── */

const ResidentialComplex = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: complex, isLoading, error } = useResidentialComplex(slug || "");

  useEffect(() => {
    if (!document.getElementById("font-montserrat")) {
      const link = document.createElement("link");
      link.id = "font-montserrat";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&subset=latin,cyrillic";
      document.head.appendChild(link);
    }
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (error || !complex) return <NotFound />;

  const content: PageContent =
    ((complex as any).page_content as unknown as PageContent) || {};

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <HeroSection complex={complex} content={content} />
      <AboutSection complex={complex} content={content} />
      <VideoSection content={content} />
      <InfrastructureSection complex={complex} content={content} />
      <TourSection content={content} />
      <ApartmentsSection complex={complex} />
      <MortgageSection content={content} />
      <FAQSection content={content} />
      <ContactsSection complex={complex} content={content} />
    </div>
  );
};

export default ResidentialComplex;
