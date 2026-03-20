import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { usePermissions } from "@/hooks/usePermissions";

type BlogPost = Tables<"blog_posts">;

const categories = [
  { value: "news", label: "Новости" },
  { value: "analytics", label: "Аналитика" },
  { value: "guides", label: "Гайды" },
  { value: "trends", label: "Тренды" },
  { value: "interior", label: "Интерьер" },
];

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const { canCreate, canDelete, canEdit, canViewOnly } = usePermissions();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Статья удалена");
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const handleDelete = (post: BlogPost) => {
    if (confirm(`Удалить статью "${post.title}"?`)) {
      deleteMutation.mutate(post.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display mb-2">Блог</h1>
            <p className="text-muted-foreground">Управление статьями</p>
          </div>
          {canCreate && (
            <Button asChild>
              <Link to="/admin/blog/new">
                <Plus className="h-4 w-4 mr-2" />
                Добавить статью
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : posts && posts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Опубликована</TableHead>
                <TableHead className="w-[120px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <Link 
                      to={`/admin/blog/${post.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {categories.find(c => c.value === post.category)?.label || post.category}
                  </TableCell>
                  <TableCell>{post.author_name || "—"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded ${
                      post.is_published 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {post.is_published ? "Да" : "Черновик"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {canEdit && (
                        <Button asChild size="icon" variant="ghost">
                          <Link to={`/admin/blog/${post.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Статьи не добавлены</p>
            <Button asChild>
              <Link to="/admin/blog/new">
                <Plus className="h-4 w-4 mr-2" />
                Создать первую статью
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
