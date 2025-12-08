import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type CompanyStat = Tables<"company_stats">;

export default function AdminStats() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<CompanyStat | null>(null);
  const [formData, setFormData] = useState<Partial<TablesInsert<"company_stats">>>({});

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_stats")
        .select("*")
        .order("order_position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TablesInsert<"company_stats">) => {
      const { error } = await supabase.from("company_stats").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Показатель добавлен");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<"company_stats"> }) => {
      const { error } = await supabase.from("company_stats").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Показатель обновлён");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("company_stats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Показатель удалён");
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const resetForm = () => {
    setFormData({});
    setEditingStat(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (stat: CompanyStat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      icon: stat.icon,
      order_position: stat.order_position,
      is_published: stat.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label || !formData.value) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingStat) {
      updateMutation.mutate({ id: editingStat.id, data: formData });
    } else {
      createMutation.mutate(formData as TablesInsert<"company_stats">);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display mb-2">Статистика компании</h1>
            <p className="text-muted-foreground">Управление показателями на главной</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingStat(null); setFormData({ is_published: true, order_position: 0 }); }}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить показатель
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingStat ? "Редактировать показатель" : "Добавить показатель"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input
                    value={formData.label || ""}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Квартир продано"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Значение *</Label>
                    <Input
                      value={formData.value || ""}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="1500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Суффикс</Label>
                    <Input
                      value={formData.suffix || ""}
                      onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                      placeholder="+, ₽, % и т.д."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Иконка (Lucide)</Label>
                    <Input
                      value={formData.icon || ""}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Home, Users, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Позиция</Label>
                    <Input
                      type="number"
                      value={formData.order_position || 0}
                      onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_published ?? true}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label>Опубликован</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingStat ? "Сохранить" : "Создать"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Значение</TableHead>
                <TableHead>Суффикс</TableHead>
                <TableHead>Позиция</TableHead>
                <TableHead>Опубликован</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.map((stat) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.label}</TableCell>
                  <TableCell>{stat.value}</TableCell>
                  <TableCell>{stat.suffix || "—"}</TableCell>
                  <TableCell>{stat.order_position}</TableCell>
                  <TableCell>{stat.is_published ? "Да" : "Нет"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(stat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(stat.id)}
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
      </div>
    </AdminLayout>
  );
}
