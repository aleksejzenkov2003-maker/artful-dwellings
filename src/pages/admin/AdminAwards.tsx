import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAwards, type Award } from "@/hooks/useAwards";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminAwards() {
  const { data: awards = [], isLoading } = useAwards(false);
  const { canCreate, canDelete, canEdit } = usePermissions();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Award | null>(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [orderPosition, setOrderPosition] = useState(0);

  const resetForm = () => {
    setTitle("");
    setImageUrl("");
    setOrderPosition(0);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (a: Award) => {
    setEditing(a);
    setTitle(a.title);
    setImageUrl(a.image_url);
    setOrderPosition(a.order_position);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !imageUrl) {
      toast.error("Заполните название и загрузите изображение");
      return;
    }

    const payload = { title, image_url: imageUrl, order_position: orderPosition };

    if (editing) {
      const { error } = await (supabase.from("awards" as any) as any)
        .update(payload)
        .eq("id", editing.id);
      if (error) { toast.error("Ошибка сохранения"); return; }
      toast.success("Награда обновлена");
    } else {
      const { error } = await (supabase.from("awards" as any) as any)
        .insert(payload);
      if (error) { toast.error("Ошибка создания"); return; }
      toast.success("Награда добавлена");
    }

    queryClient.invalidateQueries({ queryKey: ["awards"] });
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase.from("awards" as any) as any)
      .delete()
      .eq("id", id);
    if (error) { toast.error("Ошибка удаления"); return; }
    toast.success("Награда удалена");
    queryClient.invalidateQueries({ queryKey: ["awards"] });
  };

  const togglePublish = async (a: Award) => {
    const { error } = await (supabase.from("awards" as any) as any)
      .update({ is_published: !a.is_published })
      .eq("id", a.id);
    if (error) { toast.error("Ошибка"); return; }
    queryClient.invalidateQueries({ queryKey: ["awards"] });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Награды и сертификаты</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          {canCreate && (
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Добавить
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Редактировать" : "Новая награда"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название награды" />
              </div>
              <div>
                <Label>Изображение</Label>
                <SingleImageUploader value={imageUrl} onChange={setImageUrl} folder="awards" />
              </div>
              <div>
                <Label>Порядок</Label>
                <Input type="number" value={orderPosition} onChange={(e) => setOrderPosition(Number(e.target.value))} />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editing ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Загрузка...</p>
      ) : awards.length === 0 ? (
        <p className="text-muted-foreground">Нет наград</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="w-24">Порядок</TableHead>
              <TableHead className="w-28">Опубликовано</TableHead>
              <TableHead className="w-24">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awards.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <img src={a.image_url} alt={a.title} className="w-14 h-14 object-contain rounded" />
                </TableCell>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>{a.order_position}</TableCell>
                <TableCell>
                  <Switch checked={a.is_published} onCheckedChange={() => togglePublish(a)} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {canEdit && (
                      <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить награду?</AlertDialogTitle>
                            <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(a.id)}>Удалить</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
}
