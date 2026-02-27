

## Plan: Replace services data + update AboutServices component

### 1. Database migration — replace all 8 old services with 11 from reference

Delete all existing rows from `services` and insert 11 new ones:

**Row 1 — Featured (is_featured=true, terracotta background):**
| # | Title | Slug | Icon | Short Description |
|---|-------|------|------|-------------------|
| 1 | Дизайн | dizain | Paintbrush | Дизайн-проект и ремонт высшего класса |
| 2 | Отделка | otdelka | PaintRoller | С нашей помощью вы получаете квартиру готовую к заселению |
| 3 | Перепланировка | pereplanirovka | LayoutDashboard | Согласуем и узаконим любую перепланировку |
| 4 | Приемка квартир | priemka-kvartir | Search | Экспертная помощь во время приема объекта у застройщика |

**Row 2 — Regular (white background):**
| # | Title | Slug | Icon | Short Description |
|---|-------|------|------|-------------------|
| 5 | Подбор недвижимости | podbor-nedvizhimosti | MousePointer2 | Подбор недвижимости из всех жилых комплексов на рынке, в одном месте. Без комиссии. |
| 6 | Расчет инвестиционной привлекательности | raschet-investicionnoy-privlekatelnosti | BarChart3 | По каждому из проектов. Профессионально, на высоком уровне |
| 7 | Спецпредложения и акции в одном месте | specpredlozheniya-i-akcii | Gift | Скидки, подарки для клиентов, розыгрыши призов и другое |
| 8 | Объективная информация по каждому из застройщиков | ob-ektivnaya-informaciya | FileText | Опыт компании, построенные дома, точность в исполнении обязательств, возможные риски |

**Row 3 — Regular (white background):**
| # | Title | Slug | Icon | Short Description |
|---|-------|------|------|-------------------|
| 9 | Организация экскурсии | organizaciya-ekskursii | Bus | Организация экскурсии по готовым и строящимся жилым комплексам |
| 10 | Одобрение ипотеки – от 1 часа | odobrenie-ipoteki | Percent | Благодаря нашему сотрудничеству с банками и ипотечными брокерами |
| 11 | Расчет вариантов платежей | raschet-variantov-platezhey | Calculator | Рассрочка, ипотека, зачет и др. |

12th cell = CTA «Заинтересовали?» (hardcoded in component).

### 2. Update `src/components/about/AboutServices.tsx`

Add **«Подробнее»** underlined text at the bottom of featured cards only (as shown in reference). Everything else stays as-is — featured cards have `#BA846E` background, regular cards white with shadow, hover adds shadow only, no inversion, no italic.

### Files changed
- `supabase/migrations/` — new migration to DELETE + INSERT 11 services
- `src/components/about/AboutServices.tsx` — add «Подробнее» to featured cards

