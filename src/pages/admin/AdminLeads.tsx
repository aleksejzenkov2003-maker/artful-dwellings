import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, Trash2, Phone, Mail, User } from "lucide-react";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";

type Lead = Tables<"leads">;

const statuses = [
  { value: "new", label: "Новая", color: "bg-blue-500" },
  { value: "in_progress", label: "В работе", color: "bg-yellow-500" },
  { value: "completed", label: "Завершена", color: "bg-green-500" },
  { value: "cancelled", label: "Отменена", color: "bg-red-500" },
];

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const { canDelete, canEdit } = usePermissions();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, broker:team_members(id, name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<"leads"> }) => {
      const { error } = await supabase.from("leads").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("Заявка обновлена");
      setIsDialogOpen(false);
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("Заявка удалена");
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setNotes(lead.notes || "");
    setStatus(lead.status || "new");
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedLead) return;
    updateMutation.mutate({
      id: selectedLead.id,
      data: { notes, status },
    });
  };

  const getStatusBadge = (statusValue: string | null) => {
    const s = statuses.find((st) => st.value === statusValue) || statuses[0];
    return (
      <Badge variant="secondary" className={`${s.color} text-white`}>
        {s.label}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Заявки</h1>
          <p className="text-muted-foreground">Управление входящими заявками</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead>Тип формы</TableHead>
                <TableHead>Брокер</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.map((lead: any) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{lead.form_type}</TableCell>
                  <TableCell>
                    {lead.broker ? (
                      <Link 
                        to={`/admin/team/${lead.broker.id}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <User className="h-3 w-3" />
                        {lead.broker.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleView(lead)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(lead.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Детали заявки</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Имя</Label>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Телефон</Label>
                    <p className="font-medium">{selectedLead.phone}</p>
                  </div>
                </div>

                {selectedLead.email && (
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Тип формы</Label>
                    <p className="font-medium">{selectedLead.form_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Источник</Label>
                    <p className="font-medium">{selectedLead.form_source || "—"}</p>
                  </div>
                </div>

                {selectedLead.message && (
                  <div>
                    <Label className="text-muted-foreground">Сообщение</Label>
                    <p className="font-medium">{selectedLead.message}</p>
                  </div>
                )}

                {selectedLead.utm_source && (
                  <div>
                    <Label className="text-muted-foreground">UTM-метки</Label>
                    <div className="text-sm space-y-1">
                      {selectedLead.utm_source && <p>Source: {selectedLead.utm_source}</p>}
                      {selectedLead.utm_medium && <p>Medium: {selectedLead.utm_medium}</p>}
                      {selectedLead.utm_campaign && <p>Campaign: {selectedLead.utm_campaign}</p>}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Заметки</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Добавьте заметки..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleSave}>Сохранить</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
