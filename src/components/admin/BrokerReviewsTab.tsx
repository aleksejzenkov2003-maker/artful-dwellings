import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Star, MessageSquare } from "lucide-react";

interface BrokerReview {
  id: string;
  broker_id: string;
  author_name: string;
  author_role: string | null;
  author_photo: string | null;
  content: string;
  rating: number | null;
  is_published: boolean | null;
  order_position: number | null;
  created_at: string;
}

interface BrokerReviewsTabProps {
  brokerId: string | undefined;
  isNew: boolean;
}

export function BrokerReviewsTab({ brokerId, isNew }: BrokerReviewsTabProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<BrokerReview | null>(null);
  const [formData, setFormData] = useState({
    author_name: "",
    author_role: "",
    author_photo: "",
    content: "",
    rating: 5,
    is_published: true,
    order_position: 0,
  });

  // Fetch reviews for this broker
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["broker-reviews-admin", brokerId],
    queryFn: async () => {
      if (!brokerId) return [];
      const { data, error } = await supabase
        .from("broker_reviews")
        .select("*")
        .eq("broker_id", brokerId)
        .order("order_position")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BrokerReview[];
    },
    enabled: !isNew && !!brokerId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<BrokerReview, "id" | "created_at">) => {
      const { error } = await supabase.from("broker_reviews").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broker-reviews-admin", brokerId] });
      toast.success("Отзыв добавлен");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BrokerReview> }) => {
      const { error } = await supabase.from("broker_reviews").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broker-reviews-admin", brokerId] });
      toast.success("Отзыв обновлён");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("broker_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broker-reviews-admin", brokerId] });
      toast.success("Отзыв удалён");
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const resetForm = () => {
    setFormData({
      author_name: "",
      author_role: "",
      author_photo: "",
      content: "",
      rating: 5,
      is_published: true,
      order_position: 0,
    });
    setEditingReview(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (review: BrokerReview) => {
    setEditingReview(review);
    setFormData({
      author_name: review.author_name,
      author_role: review.author_role || "",
      author_photo: review.author_photo || "",
      content: review.content,
      rating: review.rating || 5,
      is_published: review.is_published ?? true,
      order_position: review.order_position || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.content) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingReview) {
      updateMutation.mutate({
        id: editingReview.id,
        data: formData,
      });
    } else {
      createMutation.mutate({
        broker_id: brokerId!,
        ...formData,
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isNew) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Сначала сохраните сотрудника, чтобы добавить отзывы
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Отзывы клиентов</h3>
          <p className="text-sm text-muted-foreground">
            Добавляйте отзывы, которые будут отображаться на странице брокера
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить отзыв
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Загрузка...</div>
      ) : reviews?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            У этого брокера пока нет отзывов
          </p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить первый отзыв
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Автор</TableHead>
              <TableHead>Рейтинг</TableHead>
              <TableHead>Текст</TableHead>
              <TableHead>Опубликован</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {review.author_photo ? (
                      <img
                        src={review.author_photo}
                        alt={review.author_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {review.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{review.author_name}</p>
                      {review.author_role && (
                        <p className="text-xs text-muted-foreground">{review.author_role}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{renderStars(review.rating || 5)}</TableCell>
                <TableCell>
                  <p className="line-clamp-2 max-w-xs">{review.content}</p>
                </TableCell>
                <TableCell>
                  {review.is_published ? (
                    <span className="text-green-600">Да</span>
                  ) : (
                    <span className="text-muted-foreground">Нет</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(review)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(review.id)}
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
            <DialogTitle>
              {editingReview ? "Редактировать отзыв" : "Новый отзыв"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Имя автора *</Label>
              <Input
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>

            <div className="space-y-2">
              <Label>Роль / описание</Label>
              <Input
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                placeholder="Клиент, Покупатель квартиры и т.д."
              />
            </div>

            <div className="space-y-2">
              <Label>Фото (URL)</Label>
              <Input
                value={formData.author_photo}
                onChange={(e) => setFormData({ ...formData, author_photo: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Текст отзыва *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                placeholder="Напишите текст отзыва..."
              />
            </div>

            <div className="space-y-2">
              <Label>Рейтинг</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= formData.rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted hover:fill-primary/50 hover:text-primary/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Позиция сортировки</Label>
                <Input
                  type="number"
                  value={formData.order_position}
                  onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Опубликован</Label>
                <div className="pt-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Отмена
              </Button>
              <Button type="submit">
                {editingReview ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
