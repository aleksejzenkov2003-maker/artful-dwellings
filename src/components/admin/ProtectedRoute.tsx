import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: AppRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no role assigned, deny access
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Доступ запрещён</h2>
          <p className="text-muted-foreground">У вас нет назначенной роли. Обратитесь к администратору.</p>
        </div>
      </div>
    );
  }

  // Check specific required roles if provided
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Недостаточно прав</h2>
          <p className="text-muted-foreground">У вас нет доступа к этому разделу.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
