

## Аудит соответствия ТЗ по ролям

### Что уже реализовано ✓
- 5 ролей в enum: `super_admin`, `admin`, `manager`, `content`, `viewer`
- `usePermissions` хук с гранулярными правами (`canDelete`, `canPublish`, `canEdit`, etc.)
- Навигация в `AdminLayout` фильтруется по уровню роли
- Пользователей создает только админ через Edge Function (публичная регистрация убрана)
- Логи: `audit_logs` таблица + триггеры на 13 таблицах (ЖК, блог, акции, услуги, команда, отзывы, заявки, квартиры, города, награды, таймлайн, homepage_content, user_roles)
- Логи доступны только `super_admin` (RLS)
- Edge Function проверяет: только super_admin может создавать/удалять admin-ов

### Что НЕ реализовано — нужно доделать

#### 1. Кнопки удаления/публикации НЕ скрыты по ролям
Все админ-страницы (Блог, ЖК, Акции, Услуги, Отзывы, Команда и т.д.) показывают кнопки «Удалить», «Создать», «Редактировать» всем ролям одинаково. `usePermissions` создан, но **нигде не используется** в этих страницах.

**Нужно**: в каждой админ-странице добавить `usePermissions()` и:
- **Viewer**: скрыть все кнопки действий (только просмотр)
- **Content**: показать создание/редактирование, скрыть удаление и публикацию
- **Manager**: показать создание/редактирование, скрыть удаление; публикация → «На модерацию»
- **Admin/Super_admin**: показать всё

Затрагиваемые файлы (каждый нужно обновить):
- `AdminBlog.tsx` — скрыть Trash2 для manager/content, скрыть всё для viewer
- `AdminComplexes.tsx` — аналогично + статус-переключатель только для manager+
- `AdminPromotions.tsx`, `AdminServices.tsx`, `AdminReviews.tsx`, `AdminTeam.tsx`, `AdminAwards.tsx`, `AdminTimeline.tsx`, `AdminHomepage.tsx`, `AdminCities.tsx`, `AdminLeads.tsx`, `AdminStats.tsx`
- `AdminBlogEdit.tsx`, `AdminComplexEdit.tsx`, `AdminServiceEdit.tsx`, `AdminTeamEdit.tsx` — в формах редактирования скрыть кнопку «Опубликовать» для manager (заменить на «Отправить на модерацию»)

#### 2. Route-level protection не по ролям
Все `/admin/*` маршруты защищены только `<ProtectedRoute>` без `requiredRoles` (кроме `/admin/users` и `/admin/logs`). Viewer может зайти на `/admin/complexes` и попытаться удалить данные (хотя RLS может заблокировать, UI не защищен).

**Нужно**: добавить `requiredRoles` к маршрутам:
- `/admin/leads` → `["super_admin", "admin"]`
- `/admin/cities` → `["super_admin", "admin"]`
- `/admin/team` → `["super_admin", "admin"]`
- Остальные контентные маршруты → минимум `["super_admin", "admin", "manager", "content"]`

#### 3. RLS политики не учитывают новые роли
Многие таблицы имеют `is_admin(auth.uid())` в RLS (например `contacts`, `apartments`, `complex_slides`, `awards`, `timeline_events`, `homepage_content`, `complex_buildings`). Функция `is_admin()` проверяет только роль `admin`, но не `super_admin`, `manager`, `content`.

**Нужно**: обновить RLS-политики чтобы:
- `super_admin` и `admin` имели полный CRUD
- `manager` и `content` могли INSERT/UPDATE но не DELETE
- `viewer` — только SELECT

Создать новую helper-функцию `can_write(uuid)` = role in (super_admin, admin, manager, content) и `can_delete(uuid)` = role in (super_admin, admin).

#### 4. Логи — ТЗ говорит «только у админа», текущая реализация — только super_admin
По ТЗ логи должны быть доступны админу тоже. Нужно обновить RLS на `audit_logs` чтобы `admin` тоже мог SELECT.

### План реализации

**Шаг 1 — Миграция БД**: Создать функции `can_write()`, `can_delete()`. Обновить RLS-политики на таблицах с `is_admin()` чтобы включить новые роли. Обновить RLS на `audit_logs` — разрешить SELECT для admin.

**Шаг 2 — UI permissions**: Добавить `usePermissions()` во все админ-страницы. Условно скрывать кнопки удаления, создания, публикации в зависимости от роли.

**Шаг 3 — Route guards**: Добавить `requiredRoles` к маршрутам в `App.tsx`.

### Оценка объема
- 1 миграция (RLS + функции)
- ~12 админ-страниц нужно обновить для UI-permissions
- 1 файл `App.tsx` для route guards

