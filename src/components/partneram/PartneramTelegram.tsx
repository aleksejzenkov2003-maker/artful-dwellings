import { useHomepageContent } from "@/hooks/useHomepageContent";
import phoneImage from "@/assets/partneram-phone.svg";
import { ArrowUpRight } from "lucide-react";

const defaults = {
  telegram_url: "https://t.me/artestate_channel",
  left_title: "Закрытый Telegram-канал для наших партнёров",
  left_description:
    "Будьте первыми в курсе новостей, эксклюзивных предложений и обновлений нашей партнёрской программы.",
  right_title: "Наш Telegram-канал",
  right_description:
    "Подпишитесь на наш telegram-канал и получайте актуальную информацию о новостройках, акциях и аналитике рынка.",
};

export function PartneramTelegram() {
  const { data } = useHomepageContent("telegram_partner");
  const c = { ...defaults, ...(data?.content as Record<string, string>) };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(c.telegram_url)}&size=160x160&color=ffffff&bgcolor=333333`;

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#262626" }}>
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-stretch">
          {/* Left card */}
          <div
            className="p-8 lg:p-10 flex flex-col justify-between"
            style={{ backgroundColor: "#333333" }}
          >
            <div>
              <h3 className="text-white text-2xl lg:text-3xl font-bold leading-tight mb-4 font-serif">
                {c.left_title}
              </h3>
              <p className="text-white/70 text-sm lg:text-base mb-8">
                {c.left_description}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <img
                src={qrUrl}
                alt="QR-код Telegram"
                className="w-28 h-28 lg:w-36 lg:h-36"
              />
              <a
                href={c.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
              >
                <ArrowUpRight className="w-5 h-5 text-black" />
              </a>
            </div>
          </div>

          {/* Center phone */}
          <div className="hidden lg:flex items-stretch overflow-hidden" style={{ backgroundColor: "#262626" }}>
            <img
              src={phoneImage}
              alt="Telegram на телефоне"
              className="h-full w-auto object-cover"
            />
          </div>

          {/* Right card */}
          <div className="p-8 lg:p-10 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold leading-tight mb-4 font-serif">
                {c.right_title}
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base mb-8">
                {c.right_description}
              </p>
            </div>

            <a
              href={c.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-black text-white text-sm font-semibold tracking-wider uppercase px-8 py-4 hover:bg-black/90 transition-colors w-full lg:w-auto"
            >
              TELEGRAM-КАНАЛ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
