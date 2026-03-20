import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Video, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { usePermissions } from "@/hooks/usePermissions";

type TeamMember = Tables<"team_members">;

export default function AdminTeam() {
  const queryClient = useQueryClient();
  const { canCreate, canDelete, canEdit } = usePermissions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TablesInsert<"team_members">>>({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("order_position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: cities } = useQuery({
    queryKey: ["cities-all"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*").order("order_position");
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TablesInsert<"team_members">) => {
      const { error } = await supabase.from("team_members").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast.success("Сотрудник добавлен");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<"team_members"> }) => {
      const { error } = await supabase.from("team_members").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast.success("Сотрудник обновлён");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast.success("Сотрудник удалён");
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const resetForm = () => {
    setFormData({});
    setEditingMember(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo_url: member.photo_url,
      video_url: member.video_url,
      city_id: member.city_id,
      order_position: member.order_position,
      is_published: member.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: formData });
    } else {
      createMutation.mutate(formData as TablesInsert<"team_members">);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Файл слишком большой. Максимум 50MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
      toast.error("Выберите видеофайл");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("team-videos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("team-videos")
        .getPublicUrl(fileName);

      setFormData({ ...formData, video_url: publicUrl });
      toast.success("Видео загружено");
    } catch (error: any) {
      toast.error("Ошибка загрузки: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display mb-2">Команда</h1>
            <p className="text-muted-foreground">Управление сотрудниками</p>
          </div>
          {canCreate && (
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/admin/team/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить сотрудника
                </Link>
              </Button>
            </div>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Редактировать сотрудника" : "Добавить сотрудника"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя *</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Должность *</Label>
                  <Input
                    value={formData.role || ""}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Город</Label>
                  <Select
                    value={formData.city_id || ""}
                    onValueChange={(value) => setFormData({ ...formData, city_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Биография</Label>
                  <Textarea
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL фото</Label>
                  <Input
                    value={formData.photo_url || ""}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  />
                </div>

                {/* Video Section */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Видео сотрудника
                  </Label>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">URL видео (YouTube, Vimeo или прямая ссылка)</Label>
                    <Input
                      value={formData.video_url || ""}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="text-center text-sm text-muted-foreground">или</div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Загрузить с компьютера</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={isUploading}
                        onClick={() => document.getElementById("video-upload")?.click()}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Загрузка...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Выбрать видео
                          </>
                        )}
                      </Button>
                      <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </div>
                  </div>

                  {formData.video_url && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Текущее видео:</p>
                      <p className="text-sm truncate">{formData.video_url}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Позиция сортировки</Label>
                  <Input
                    type="number"
                    value={formData.order_position || 0}
                    onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) })}
                  />
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
                    {editingMember ? "Сохранить" : "Создать"}
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
              <TableHead>Имя</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Город</TableHead>
              <TableHead>Видео</TableHead>
              <TableHead>Опубликован</TableHead>
              <TableHead className="w-[140px]">Действия</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    {member.slug ? (
                      <Link 
                        to={`/broker/${member.slug}`} 
                        target="_blank"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {member.slug}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {cities?.find(c => c.id === member.city_id)?.name || "—"}
                  </TableCell>
                  <TableCell>
                    {member.video_url ? (
                      <Video className="h-4 w-4 text-primary" />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{member.is_published ? "Да" : "Нет"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild size="icon" variant="ghost">
                        <Link to={`/admin/team/${member.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(member.id)}
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