import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string | null;
  image_url: string | null;
  order_position: number;
  is_published: boolean;
}

const emptyForm = {
  year: "",
  title: "",
  description: "",
  image_url: "",
  order_position: 0,
  is_published: true,
};

export default function AdminTimeline() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-timeline-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .order("order_position");
      if (error) throw error;
      return data as TimelineEvent[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: typeof form & { id?: string }) => {
      const payload = {
        year: values.year,
        title: values.title,
        description: values.description || null,
        image_url: values.image_url || null,
        order_position: values.order_position,
        is_published: values.is_published,
      };
      if (values.id) {
        const { error } = await supabase
          .from("timeline_events")
          .update(payload)
          .eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("timeline_events")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline-events"] });
      queryClient.invalidateQueries({ queryKey: ["timeline-events"] });
      toast.success(editingId ? "Событие обновлено" : "Событие добавлено");
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("timeline_events")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline-events"] });
      queryClient.invalidateQueries({ queryKey: ["timeline-events"] });
      toast.success("Событие удалено");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order_position: events.length });
    setDialogOpen(true);
  };

  const openEdit = (ev: TimelineEvent) => {
    setEditingId(ev.id);
    setForm({
      year: ev.year,
      title: ev.title,
      description: ev.description || "",
      image_url: ev.image_url || "",
      order_position: ev.order_position,
      is_published: ev.is_published,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.year || !form.title) {
      toast.error("Заполните год и заголовок");
      return;
    }
    saveMutation.mutate(editingId ? { ...form, id: editingId } : form);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Таймлайн — История компании</h1>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Добавить
          </Button>
        </div>

        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => (
              <Card key={ev.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <GripVertical className="w-5 h-5 text-muted-foreground shrink-0" />
                  {ev.image_url ? (
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      className="w-16 h-12 object-cover rounded shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-muted rounded shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent">{ev.year}</span>
                      <span className="font-medium truncate">{ev.title}</span>
                      {!ev.is_published && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          Скрыто
                        </span>
                      )}
                    </div>
                    {ev.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {ev.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(ev)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteMutation.mutate(ev.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Редактировать событие" : "Новое событие"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Год *</Label>
                <Input
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label>Порядок</Label>
                <Input
                  type="number"
                  value={form.order_position}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      order_position: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Заголовок *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Основание компании"
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div>
              <Label>Фото</Label>
              <SingleImageUploader
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url || "" })}
                bucket="complex-media"
                folder="timeline"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
              />
              <Label>Опубликовано</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeDialog}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
