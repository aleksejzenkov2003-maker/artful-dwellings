

## Обновление блока "Art Estate — это" по макету

### Что нужно сделать

**1. Скопировать 3 иконки 3D в проект**
- `user-uploads://Frame_33186_1.png` → `src/assets/advantage-icon-1.png` (сертификат)
- `user-uploads://Frame_33186_2.png` → `src/assets/advantage-icon-2.png` (мишень)
- `user-uploads://Frame_33186_3.png` → `src/assets/advantage-icon-3.png` (блокнот)

**2. Обновить `src/components/about/AboutAdvantages.tsx`**

По макету:
- Заменить эмодзи на 3D-иконки (импортировать как изображения)
- Карточки: светлый фон, тонкая граница, скругленные углы -- текущее оформление близко, оставляем
- Порядок внутри карточки: заголовок сверху → картинка по центру → описание внизу (как сейчас, только картинка вместо эмодзи)
- Иконки: примерно 140-160px высота, `object-contain`, по центру карточки

### Технические детали

Изменения в `src/components/about/AboutAdvantages.tsx`:
- Убрать поле `emoji` из массива, заменить на `icon` с импортированным изображением
- Заменить `<div className="text-6xl">` на `<img src={item.icon} className="h-[140px] object-contain mx-auto" />`
- Остальная структура и стили остаются

### Файлы
- `src/assets/advantage-icon-1.png` -- новый файл
- `src/assets/advantage-icon-2.png` -- новый файл
- `src/assets/advantage-icon-3.png` -- новый файл
- `src/components/about/AboutAdvantages.tsx` -- обновление
