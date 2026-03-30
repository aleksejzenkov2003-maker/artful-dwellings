import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "super_admin" | "admin" | "manager" | "content" | "viewer" | null;

const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 1,
  admin: 2,
  manager: 3,
  content: 4,
  viewer: 5,
};

export function usePermissions() {
  const { role } = useAuth();

  const level = role ? (ROLE_HIERARCHY[role] ?? 99) : 99;

  return {
    role,
    isSuperAdmin: role === "super_admin",
    isAdmin: level <= 2,
    isManager: level <= 3,
    isContent: level <= 4,
    isViewer: level <= 5,

    // Granular permissions
    canManageUsers: level <= 2,
    canManageRoles: role === "super_admin",
    canViewLogs: level <= 2,
    canPublish: level <= 2,
    canDelete: level <= 2,
    canEdit: level <= 4,
    canCreate: level <= 4,
    canViewLeads: level <= 4,
    canViewStats: level <= 5,
    canViewOnly: role === "viewer",
  };
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Главный админ",
  admin: "Админ",
  manager: "Менеджер",
  content: "Команда контента",
  viewer: "Viewer",
};
