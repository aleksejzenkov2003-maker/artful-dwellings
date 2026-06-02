import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  Car,
  CreditCard,
  FileText,
  HelpCircle,
  Image,
  MapPin,
  Megaphone,
  Phone,
  Send,
  Sparkles,
  Video,
} from "lucide-react";

export type ContentGuideSectionId =
  | "hero"
  | "about"
  | "video"
  | "map"
  | "documents"
  | "promotions"
  | "installments"
  | "driver"
  | "telegram"
  | "forms"
  | "infrastructure"
  | "mortgage"
  | "faq"
  | "contacts";

interface GuideSection {
  id: ContentGuideSectionId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  area: string;
  steps: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "hero",
    title: "1. Главный экран",
    icon: Sparkles,
    area: "Первый экран при открытии страницы",
    steps: [
      "Загрузите фоновое фото — оно заменит картинку за названием ЖК.",
      "Подзаголовок — короткий слоган под названием комплекса.",
      "Метро, телефон и часы работы — блок справа/снизу в шапке.",
      "Название ЖК берётся из вкладки «Основное».",
    ],
  },
  {
    id: "about",
    title: "2. О проекте",
    icon: Building2,
    area: "Секция с описанием и карточками преимуществ",
    steps: [
      "«Развёрнутое описание» — основной текст о проекте (можно форматировать).",
      "До 2 фото — дополнительные изображения в блоке.",
      "Карточки (до 4) — заголовок + текст, как «Архитектура», «Двор» и т.д.",
      "Число корпусов, квартир и площадей — из вкладки «Основное» и «Корпуса».",
    ],
  },
  {
    id: "video",
    title: "3. Видео и тур",
    icon: Video,
    area: "Видеоблок и виртуальная прогулка",
    steps: [
      "URL Vimeo/YouTube — вставьте ссылку на ролик о проекте.",
      "URL панорамы — ссылка на 3D-тур; без неё блок тура скрывается.",
      "Слайды (вкладка «Слайды») — фото и текст для блока «Виртуальная прогулка».",
    ],
  },
  {
    id: "map",
    title: "4. Карта и планировки",
    icon: MapPin,
    area: "Карта расположения и секция планировок",
    steps: [
      "«Карта / подложка» — изображение карты или схемы района.",
      "«Фон планировок» — фоновая картинка секции с типами квартир.",
      "Сами карточки планировок — вкладка «Квартиры» (тип, площадь, цена, фото).",
    ],
  },
  {
    id: "documents",
    title: "5. Документация",
    icon: FileText,
    area: "Список документов для скачивания",
    steps: [
      "Добавьте документ — укажите название и загрузите PDF/DOC.",
      "На странице появится список ссылок с ромбиками слева.",
      "Порядок в админке = порядок на сайте.",
    ],
  },
  {
    id: "promotions",
    title: "6. Акции",
    icon: Megaphone,
    area: "Блок акций и спецпредложений",
    steps: [
      "Заголовок секции — текст над списком акций (по умолчанию «Акции»).",
      "Каждая акция: заголовок (строка в списке), описание и опционально фото.",
      "Добавляйте столько акций, сколько нужно — до 5 слотов в шаблоне.",
    ],
  },
  {
    id: "installments",
    title: "7. Рассрочка и программы",
    icon: CreditCard,
    area: "Программы рассрочки и субсидированные ставки",
    steps: [
      "Заголовок секции и вступительный текст — верх блока.",
      "Субсидированные ставки — заголовок + HTML-список банков.",
      "Программы №1 и №2 — заголовок, примечание и 2 карточки в каждой.",
    ],
  },
  {
    id: "mortgage",
    title: "8. Ипотека",
    icon: CreditCard,
    area: "Условия ипотеки (текст и параметры)",
    steps: [
      "Заголовок секции — отображается над блоком условий.",
      "Описание — HTML-текст об ипотечных программах.",
      "Параметры — пары «название / значение» (ставка, срок, взнос).",
    ],
  },
  {
    id: "infrastructure",
    title: "9. Инфраструктура",
    icon: MapPin,
    area: "Расположение и инфраструктура района",
    steps: [
      "Описание — основной текст о расположении (HTML).",
      "Пункты списка — короткие строки (метро, парки, магазины).",
      "Большая картинка справа — загрузите в «Карта» или отдельное фото в описании.",
    ],
  },
  {
    id: "driver",
    title: "10. Личный водитель",
    icon: Car,
    area: "Блок бесплатного трансфера",
    steps: [
      "Фон и фото автомобиля — визуал блока.",
      "Заголовок, бейдж «БЕСПЛАТНО», описания и время ожидания.",
      "Текст кнопки — подпись на кнопке вызова.",
    ],
  },
  {
    id: "telegram",
    title: "11. Telegram",
    icon: Send,
    area: "Призыв подписаться на канал",
    steps: [
      "Заголовок и описание канала.",
      "Ссылка и текст кнопки «ПРИСОЕДИНИТЬСЯ».",
      "QR-код и фото телефона — загрузите изображения.",
    ],
  },
  {
    id: "forms",
    title: "12. Формы и дисклеймер",
    icon: FileText,
    area: "Настройки форм и юридическая плашка",
    steps: [
      "Redirect после отправки — куда перенаправить (обычно /thanks).",
      "Дисклеймер — жёлтая плашка про ипотеку внизу страницы.",
      "Поля форм (имя, телефон) заданы шаблоном и не редактируются.",
    ],
  },
  {
    id: "faq",
    title: "13. FAQ",
    icon: HelpCircle,
    area: "Часто задаваемые вопросы",
    steps: [
      "Добавьте вопрос и развёрнутый ответ для каждой строки.",
      "Порядок в админке = порядок аккордеона на странице.",
      "До 5+ вопросов — по числу слотов в шаблоне.",
    ],
  },
  {
    id: "contacts",
    title: "14. Контакты",
    icon: Phone,
    area: "Телефон и email на странице",
    steps: [
      "Контактный телефон и email — отображаются в блоках связи.",
      "Если не указаны — подставляется телефон из Hero.",
    ],
  },
];

interface ComplexPageContentGuideProps {
  activeSection: ContentGuideSectionId;
  onSectionSelect: (id: ContentGuideSectionId) => void;
}

export function ComplexPageContentGuide({
  activeSection,
  onSectionSelect,
}: ComplexPageContentGuideProps) {
  const active = GUIDE_SECTIONS.find((s) => s.id === activeSection) ?? GUIDE_SECTIONS[0];

  return (
    <div className="sticky top-4 space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-primary/10 p-2">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base">Инструкция по заполнению</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Выберите блок — откроется пошаговая подсказка и прокрутка к полям редактора.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {GUIDE_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionSelect(section.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {section.title.split(". ")[1] ?? section.title}
            </button>
          );
        })}
      </div>

      <div className="rounded-md border bg-muted/40 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Область на странице
          </span>
        </div>
        <p className="text-sm font-medium">{active.area}</p>

        <ol className="space-y-2 list-none">
          {active.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground leading-snug pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-muted-foreground border-t pt-3">
        После правок нажмите «Сохранить» — изменения попадут на сайт. Превью справа показывает черновик до сохранения.
      </p>
    </div>
  );
}
