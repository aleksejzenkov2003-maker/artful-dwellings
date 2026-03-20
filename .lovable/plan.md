

## Plan: Role-Based Access Control System with Audit Logs

### Current State
- `app_role` enum has only 3 values: `admin`, `moderator`, `user`
- `user_roles` table exists but only supports these 3 roles
- `AuthContext` only checks for `admin` role (binary admin/not-admin)
- No audit logging exists
- No user management UI in admin panel
- Auth page has public signup (should be admin-only user creation)

### Required Roles Mapping
| Role | Enum Value | Access |
|------|-----------|--------|
| Главный админ | `super_admin` | Full access, manage roles, delete anything, view logs |
| Админ | `admin` | Manage users (except super_admin), publish, edit, delete content |
| Менеджер | `manager` | Create/edit content, change project statuses. No delete, no publish (needs admin approval) |
| Команда контента | `content` | Create/edit texts, SEO, banners, view-only analytics/CRM |
| Viewer | `viewer` | Read-only access to reports/stats/analytics |

### Implementation Steps

#### 1. Database Migration
- Alter `app_role` enum to add: `super_admin`, `manager`, `content`, `viewer`
- Create `audit_logs` table:
  - `id`, `user_id`, `action` (create/update/delete), `table_name`, `record_id`, `old_data` (jsonb), `new_data` (jsonb), `created_at`
  - RLS: only `super_admin` can SELECT; INSERT open for authenticated users (logged via triggers)
- Create database trigger function `log_audit_action()` that auto-logs INSERT/UPDATE/DELETE on key tables (residential_complexes, blog_posts, promotions, services, team_members, reviews, leads, apartments, complex_slides, cities, awards, timeline_events, homepage_content)
- Create helper functions: `is_super_admin(uuid)`, `is_manager(uuid)`, `is_content(uuid)`, `is_viewer(uuid)`

#### 2. Update AuthContext
- Expand `isAdmin` to a `role` field storing the user's highest role
- Add helper booleans: `isSuperAdmin`, `isAdmin`, `isManager`, `isContent`, `isViewer`
- Add `canEdit`, `canDelete`, `canPublish`, `canManageUsers` permission helpers

#### 3. Remove Public Signup
- Remove the "Регистрация" tab from Auth page
- Add user management page at `/admin/users` where super_admin/admin can create users with email+password+role
- Use Supabase Edge Function to create users server-side (since `supabase.auth.admin.createUser` requires service role key)

#### 4. Admin Layout Updates
- Filter sidebar nav items based on role permissions
- Show "Пользователи" and "Логи" nav items only for super_admin
- Show "Заявки" for admin+ roles only

#### 5. Permission Guards in Admin Pages
- Create `usePermissions()` hook returning granular permissions per role
- Conditionally render edit/delete/publish buttons based on role
- For manager role: hide delete buttons, replace "Опубликовать" with "Отправить на модерацию"
- For content role: similar to manager but scoped to content tables only
- For viewer: hide all action buttons, read-only views

#### 6. User Management Page (`/admin/users`)
- List all profiles with their roles
- Super_admin can assign any role; admin can assign manager/content/viewer
- Edge function `create-user` to handle server-side user creation with service role key
- Edge function `update-user-role` to change roles securely

#### 7. Audit Logs Page (`/admin/logs`)
- Visible only to super_admin
- Table showing: timestamp, user email, action, table, record summary
- Filterable by user, action type, table, date range

### Technical Details

**New files:**
- `supabase/functions/create-user/index.ts` — edge function for user creation
- `src/pages/admin/AdminUsers.tsx` — user management page
- `src/pages/admin/AdminAuditLogs.tsx` — audit logs viewer
- `src/hooks/usePermissions.ts` — role-based permission hook

**Modified files:**
- `src/contexts/AuthContext.tsx` — expanded role support
- `src/components/admin/AdminLayout.tsx` — role-filtered navigation
- `src/components/admin/ProtectedRoute.tsx` — role-based route protection
- `src/pages/Auth.tsx` — remove signup tab
- `src/App.tsx` — add new admin routes
- Multiple admin pages — conditional UI based on permissions

