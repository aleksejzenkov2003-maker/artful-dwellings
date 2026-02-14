

## Доработка блока "Сертификаты"

### Что нужно изменить

**1. Уменьшить размер заголовка** -- чтобы текст помещался в 2 строки, как на макете
- Уменьшить с `text-3xl md:text-4xl lg:text-5xl` до примерно `text-2xl md:text-3xl lg:text-[38px]`

**2. Добавить эффект тени при наведении на награды**
- На каждое изображение награды добавить `transition` и `hover:drop-shadow` с мягким свечением (например, золотистый/белый glow)
- Также можно добавить легкий `hover:scale-105` для плавного увеличения

### Технические детали

Изменения только в `src/components/about/AboutCertificates.tsx`:

- Заголовок: `text-2xl md:text-3xl lg:text-[38px]`
- Изображения: добавить классы `transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105`

### Файлы
- `src/components/about/AboutCertificates.tsx` -- единственный файл
