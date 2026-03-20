import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions, ROLE_LABELS } from "@/hooks/usePermissions";
import { Plus, Trash2, Shield } from "lucide-react";

interface UserEntry {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string | null;
}

export default function AdminUsers() {
  const { isSuperAdmin, canManageRoles } = usePermissions();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", full_name: "", role: "viewer" });

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "list_users" },
    });
    if (error) {
      toast.error("Ошибка загрузки пользователей");
    } else {
      setUsers(data.users || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newUser.email || !newUser.password || !newUser.role) {
      toast.error("Заполните все поля");
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "create_user", ...newUser },
    });
    setCreating(false);
    if (error || data?.error) {
      toast.error(data?.error || "Ошибка создания пользователя");
    } else {
      toast.success("Пользователь создан");
      setDialogOpen(false);
      setNewUser({ email: "", password: "", full_name: "", role: "viewer" });
      fetchUsers();
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "update_role", user_id: userId, role },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Ошибка смены роли");
    } else {
      toast.success("Роль обновлена");
      fetchUsers();
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Удалить пользователя?")) return;
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "delete_user", user_id: userId },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Ошибка удаления");
    } else {
      toast.success("Пользователь удалён");
      fetchUsers();
    }
  };

  const availableRoles = isSuperAdmin
    ? ["super_admin", "admin", "manager", "content", "viewer"]
    : ["manager", "content", "viewer"];

  const roleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "super_admin": return "destructive" as const;
      case "admin": return "default" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <p className="text-muted-foreground">Управление пользователями и ролями</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Создать пользователя</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый пользователь</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Имя</Label>
                <Input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="Иван Иванов" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@artestate.ru" />
              </div>
              <div className="space-y-2">
                <Label>Пароль</Label>
                <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Минимум 6 символов" />
              </div>
              <div className="space-y-2">
                <Label>Роль</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((r) => (
                      <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={creating}>
                {creating ? "Создание..." : "Создать"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Последний вход</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {canManageRoles && u.role !== "super_admin" ? (
                      <Select value={u.role || ""} onValueChange={(v) => handleRoleChange(u.id, v)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Без роли" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((r) => (
                            <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={roleBadgeVariant(u.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {u.role ? ROLE_LABELS[u.role] || u.role : "Без роли"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("ru") : "—"}
                  </TableCell>
                  <TableCell>
                    {u.role !== "super_admin" && isSuperAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
