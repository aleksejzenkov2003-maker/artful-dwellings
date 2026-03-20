import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface AuditLog {
  id: string;
  user_email: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
  old_data: any;
  new_data: any;
}

const ACTION_LABELS: Record<string, string> = {
  create: "Создание",
  update: "Изменение",
  delete: "Удаление",
};

const ACTION_COLORS: Record<string, "default" | "secondary" | "destructive"> = {
  create: "default",
  update: "secondary",
  delete: "destructive",
};

const TABLE_LABELS: Record<string, string> = {
  residential_complexes: "ЖК",
  blog_posts: "Блог",
  promotions: "Акции",
  services: "Услуги",
  team_members: "Команда",
  reviews: "Отзывы",
  leads: "Заявки",
  apartments: "Квартиры",
  cities: "Города",
  awards: "Награды",
  timeline_events: "Таймлайн",
  homepage_content: "Главная",
  user_roles: "Роли",
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterTable, setFilterTable] = useState<string>("all");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (filterAction !== "all") query = query.eq("action", filterAction);
      if (filterTable !== "all") query = query.eq("table_name", filterTable);

      const { data, error } = await query;
      if (error) {
        toast.error("Ошибка загрузки логов");
      } else {
        setLogs((data as AuditLog[]) || []);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [filterAction, filterTable]);

  const filtered = logs.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      l.user_email?.toLowerCase().includes(s) ||
      l.table_name.toLowerCase().includes(s) ||
      l.record_id?.toLowerCase().includes(s)
    );
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Логи действий</h1>
        <p className="text-muted-foreground">История всех изменений в системе</p>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по email, таблице..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Действие" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все действия</SelectItem>
            <SelectItem value="create">Создание</SelectItem>
            <SelectItem value="update">Изменение</SelectItem>
            <SelectItem value="delete">Удаление</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTable} onValueChange={setFilterTable}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Раздел" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все разделы</SelectItem>
            {Object.entries(TABLE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                <TableHead>Дата</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Раздел</TableHead>
                <TableHead>ID записи</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Нет записей
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("ru")}
                    </TableCell>
                    <TableCell className="text-sm">{log.user_email || "Система"}</TableCell>
                    <TableCell>
                      <Badge variant={ACTION_COLORS[log.action] || "secondary"}>
                        {ACTION_LABELS[log.action] || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {TABLE_LABELS[log.table_name] || log.table_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {log.record_id ? log.record_id.substring(0, 8) + "..." : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
