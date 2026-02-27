

## Plan: Awards carousel with admin management

### 1. Database — create `awards` table

New table `awards` with columns:
- `id` (uuid, PK)
- `title` (text, not null) — alt text / name
- `image_url` (text, not null) — award image URL
- `order_position` (integer, default 0)
- `is_published` (boolean, default true)
- `created_at`, `updated_at` (timestamps)

RLS: public SELECT where `is_published = true`, full ALL access for admins via `is_admin()`.

Seed existing 4 awards from static assets into the table (upload manually or keep as initial data).

### 2. Hook — `useAwards.ts`

Fetch published awards ordered by `order_position`. Simple `useQuery` hook querying the `awards` table.

### 3. Update `AboutCertificates.tsx` — carousel

Replace static 4-image grid with Embla carousel (already installed):
- Show 4 items per slide on desktop, 2 on mobile
- Left/right navigation arrows (copper/accent outline circles as in reference)
- Dot pagination below
- Dark background preserved, same hover effects on images
- Fallback to existing static images if no DB data

### 4. Admin page — `AdminAwards.tsx`

CRUD interface for awards:
- Table listing all awards with thumbnail, title, order, published status
- Add/edit dialog with `SingleImageUploader` for image, text input for title, number for order
- Delete with confirmation
- Toggle publish status

### 5. Wire into admin navigation and routing

- Add `{ href: "/admin/awards", label: "Награды", icon: Award }` to `AdminLayout.tsx` nav items
- Add route `/admin/awards` in `App.tsx`

### Files changed
- `supabase/migrations/` — new migration for `awards` table + seed data
- `src/hooks/useAwards.ts` — new hook
- `src/components/about/AboutCertificates.tsx` — carousel implementation
- `src/pages/admin/AdminAwards.tsx` — new admin page
- `src/components/admin/AdminLayout.tsx` — add nav item
- `src/App.tsx` — add admin route

