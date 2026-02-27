

## План: Перенос услуг на блок «О компании» + удаление страницы /uslugi

### Что делаем

1. **Переделываем `AboutServices`** — вместо захардкоженных данных, грузим услуги из БД через `useServices()`. Карточки в сетке 4 колонки. При наведении — инверсия (фон становится `#BA846E`, текст и иконка белые). При клике — переход на `/uslugi/{slug}`. Последняя карточка «Заинтересовали?» остаётся как CTA.

2. **Объединяем `AboutAdditionalServices` с `AboutServices`** — первые 4 услуги из референса (Дизайн, Отделка, Перепланировка, Приемка квартир) — это «дополнительные услуги», которые сейчас отдельным блоком. Добавляем их тоже в БД `services` (или оставляем как есть если они уже в таблице) и показываем все в одной сетке. Блок `AboutAdditionalServices` убираем.

3. **Убираем «Услуги» из хедера** — удаляем `{ name: "Услуги", href: "/uslugi" }` из `mainNavigation` в `Header.tsx`.

4. **Убираем роут `/uslugi`** — удаляем `<Route path="/uslugi" element={<Uslugi />} />` из `App.tsx`. Роут `/uslugi/:slug` (детальная страница услуги) **остаётся**.

5. **Иконки** — в БД уже есть поле `icon` (текстовое, хранит имя иконки lucide типа `home`, `shield`). В компоненте маппим их на реальные lucide-иконки. В админке (`AdminServices`) добавляем выбор иконки.

### Шаги реализации

1. **`src/components/about/AboutServices.tsx`** — полностью переписать:
   - Загружаем данные через `useServices()`
   - Рендерим сетку `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
   - Каждая карточка — `Link to={/uslugi/${slug}}`
   - Обычное состояние: белый фон, чёрный текст, терракотовая иконка
   - Hover: фон `#BA846E`, белый текст, белая иконка, подпись «Подробнее» внизу
   - Transition 300ms
   - Последняя карточка CTA «Заинтересовали?» — всегда терракотовая

2. **`src/components/about/AboutAdditionalServices.tsx`** — удалить компонент

3. **`src/components/about/index.ts`** — убрать экспорт `AboutAdditionalServices`

4. **`src/pages/OKompanii.tsx`** — убрать `<AboutAdditionalServices />`

5. **`src/components/layout/Header.tsx`** — убрать `{ name: "Услуги", href: "/uslugi" }` из массива `mainNavigation`

6. **`src/App.tsx`** — убрать импорт `Uslugi` и роут `/uslugi`

7. **`src/pages/admin/AdminServiceEdit.tsx`** — убедиться что поле `icon` редактируется (оно уже есть в таблице). Добавить селектор иконки если его нет.

### Технические детали

- Иконки из lucide-react: маппинг строки `icon` на компонент через объект `{ home: Home, shield: Shield, ... }`
- Hover-инверсия через CSS group-hover: `group-hover:bg-[#BA846E] group-hover:text-white`
- Данные грузятся из `services` таблицы, `is_published = true`, сортировка по `order_position`
- Детальные страницы `/uslugi/:slug` продолжают работать — убираем только листинговую страницу

