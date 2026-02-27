

## Блок Telegram-канала после формы партнёра

### Что делаем

Создаём трёхколоночный блок на фоне `#262626` с:
- **Левая карточка** (тёмная, `#333`): заголовок «Закрытый Telegram-канал для наших партнёров», описание, QR-код (генерируется автоматически из ссылки), иконка-стрелка
- **Центр**: загруженное SVG-изображение телефона (копируем в `src/assets/partneram-phone.svg`)
- **Правая карточка** (белая): заголовок «Наш Telegram-канал», описание, кнопка «TELEGRAM-КАНАЛ» (чёрная)

QR-код генерируется динамически через API `https://api.qrserver.com/v1/create-qr-code/?data={URL}&size=120x120` — меняется автоматически при смене ссылки в админке.

### Хранение данных

Используем существующую таблицу `homepage_content` с `section_key = "telegram_partner"`. Контент:
```json
{
  "telegram_url": "https://t.me/artestate_channel",
  "left_title": "Закрытый Telegram-канал для наших партнёров",
  "left_description": "Будьте первыми в курсе новостей...",
  "right_title": "Наш Telegram-канал",
  "right_description": "Подпишитесь на наш telegram-канал..."
}
```

### Шаги реализации

1. **Скопировать SVG** телефона в `src/assets/partneram-phone.svg`

2. **Создать компонент** `src/components/partneram/PartneramTelegram.tsx`:
   - Загружает контент через `useHomepageContent("telegram_partner")`
   - Фоллбэк на дефолтные значения если нет данных в БД
   - Три колонки на десктопе, стек на мобильном
   - QR через `<img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(telegramUrl)}&size=120x120`} />`
   - Контейнер `max-w-[1800px]`, фон секции `#262626`, скруглённые карточки

3. **Добавить в страницу** `src/pages/Partneram.tsx` после `</div>` формы

4. **Добавить вкладку в админку** `src/pages/admin/AdminHomepage.tsx`:
   - Новая вкладка «Telegram» в TabsList
   - Поля: ссылка на Telegram, заголовки и описания для левой и правой карточек
   - Превью QR-кода прямо в админке
   - Сохранение через `handleSave("telegram_partner", ...)`

### Технические детали

- QR генерируется через внешний API `api.qrserver.com` — бесплатный, без ключей
- Никаких миграций БД не нужно — используем существующую `homepage_content`
- Все тексты редактируемые из админки, дефолтные значения зашиты в компонент

