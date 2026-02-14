

## Замена фото команды экспертов

### Что будет сделано

Заменить 4 фото сотрудников на новые загруженные изображения:

- `1-3.png` → `src/assets/team-member-1.png` (Константин Назаров)
- `2-3.png` → `src/assets/team-member-2.png` (Сергей Чурганов)
- `3-3.png` → `src/assets/team-member-3.png` (Роман Рябец)
- `4-3.png` → `src/assets/team-member-4.png` (Александр Постолатий)

### Технические детали

Компонент `AboutTeamCarousel.tsx` уже импортирует эти файлы и использует их как фоллбэк. Нужно только перезаписать файлы изображений -- код менять не требуется.

### Файлы
- `src/assets/team-member-1.png` -- перезапись
- `src/assets/team-member-2.png` -- перезапись
- `src/assets/team-member-3.png` -- перезапись
- `src/assets/team-member-4.png` -- перезапись

