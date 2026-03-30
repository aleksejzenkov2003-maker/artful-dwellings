import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions, ROLE_LABELS } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building2,
  FileText,
  Tag,
  Briefcase,
  Users,
  Star,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  BarChart3,
  MapPin,
  Home,
  Award,
  Clock,
  UserCog,
  ScrollText,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const allNavItems = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, minRole: "viewer" as const },
  { href: "/admin/homepage", label: "Главная", icon: Home, minRole: "content" as const },
  { href: "/admin/complexes", label: "ЖК", icon: Building2, minRole: "manager" as const },
  { href: "/admin/blog", label: "Блог", icon: FileText, minRole: "content" as const },
  { href: "/admin/promotions", label: "Акции", icon: Tag, minRole: "content" as const },
  { href: "/admin/services", label: "Услуги", icon: Briefcase, minRole: "content" as const },
  { href: "/admin/team", label: "Команда", icon: Users, minRole: "admin" as const },
  { href: "/admin/reviews", label: "Отзывы", icon: Star, minRole: "content" as const },
  { href: "/admin/leads", label: "Заявки", icon: MessageSquare, minRole: "admin" as const },
  { href: "/admin/stats", label: "Статистика", icon: BarChart3, minRole: "viewer" as const },
  { href: "/admin/cities", label: "Города", icon: MapPin, minRole: "admin" as const },
  { href: "/admin/awards", label: "Награды", icon: Award, minRole: "content" as const },
  { href: "/admin/timeline", label: "Таймлайн", icon: Clock, minRole: "content" as const },
  { href: "/admin/users", label: "Пользователи", icon: UserCog, minRole: "admin" as const },
  { href: "/admin/logs", label: "Логи", icon: ScrollText, minRole: "admin" as const },
];

const ROLE_LEVEL: Record<string, number> = {
  super_admin: 1,
  admin: 2,
  manager: 3,
  content: 4,
  viewer: 5,
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const userLevel = role ? (ROLE_LEVEL[role] ?? 99) : 99;

  const navItems = allNavItems.filter(
    (item) => userLevel <= (ROLE_LEVEL[item.minRole] ?? 99)
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="font-display text-lg">Art Estate</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Админ-панель</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/admin" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {role ? ROLE_LABELS[role] || role : "Без роли"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
