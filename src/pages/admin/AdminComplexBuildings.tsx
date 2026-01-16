import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Map } from "lucide-react";
import { 
  useAllComplexBuildings, 
  useCreateBuilding, 
  useUpdateBuilding, 
  useDeleteBuilding,
  ComplexBuilding 
} from "@/hooks/useComplexBuildings";
import { BuildingPolygonEditor } from "@/components/admin/BuildingPolygonEditor";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";

const defaultColors = [
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#22c55e", // green
  "#3b82f6", // blue
  "#ec4899", // pink
  "#f97316", // orange
];

export default function AdminComplexBuildings() {
  const { complexId } = useParams<{ complexId: string }>();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPolygonEditorOpen, setIsPolygonEditorOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<ComplexBuilding | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#14b8a6",
    floors_count: "",
    plan_image: "",
    is_published: true,
    polygon_points: [] as { x: number; y: number }[],
    order_position: 0,
  });

  const { data: complex } = useQuery({
    queryKey: ["complex", complexId],
    queryFn: async () => {
      if (!complexId) return null;
      const { data, error } = await supabase
        .from("residential_complexes")
        .select("*")
        .eq("id", complexId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!complexId,
  });

  const { data: buildings, isLoading } = useAllComplexBuildings(complexId);
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

  // Get plan image - either specific to building or main complex image
  const getPlanImage = (): string | null => {
    if (formData.plan_image) return formData.plan_image;
    if (complex?.main_image) return complex.main_image;
    if (complex?.images && Array.isArray(complex.images) && complex.images.length > 0) {
      const firstItem = complex.images[0];
      // Handle both string and MediaItem object formats
      if (typeof firstItem === "string") {
        return firstItem;
      } else if (firstItem && typeof firstItem === "object" && "url" in firstItem) {
        return (firstItem as { url: string }).url;
      }
    }
    return null;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      color: defaultColors[(buildings?.length || 0) % defaultColors.length],
      floors_count: "",
      plan_image: "",
      is_published: true,
      polygon_points: [],
      order_position: buildings?.length || 0,
    });
    setEditingBuilding(null);
    setIsDialogOpen(false);
    setIsPolygonEditorOpen(false);
  };

  const handleEdit = (building: ComplexBuilding) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      color: building.color || "#14b8a6",
      floors_count: building.floors_count?.toString() || "",
      plan_image: building.plan_image || "",
      is_published: building.is_published,
      polygon_points: building.polygon_points || [],
      order_position: building.order_position,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complexId) return;

    const buildingData = {
      complex_id: complexId,
      name: formData.name,
      color: formData.color,
      floors_count: formData.floors_count ? parseInt(formData.floors_count) : null,
      plan_image: formData.plan_image || null,
      is_published: formData.is_published,
      polygon_points: formData.polygon_points,
      order_position: formData.order_position,
    };

    try {
      if (editingBuilding) {
        await updateMutation.mutateAsync({ id: editingBuilding.id, ...buildingData });
        toast.success("Корпус обновлён");
      } else {
        await createMutation.mutateAsync(buildingData);
        toast.success("Корпус добавлен");
      }
      resetForm();
    } catch (error) {
      toast.error("Ошибка сохранения");
      console.error(error);
    }
  };

  const handleDelete = async (building: ComplexBuilding) => {
    if (!confirm(`Удалить корпус "${building.name}"?`)) return;
    
    try {
      await deleteMutation.mutateAsync({ id: building.id, complexId: building.complex_id });
      toast.success("Корпус удалён");
    } catch (error) {
      toast.error("Ошибка удаления");
      console.error(error);
    }
  };

  const handlePolygonSave = (points: { x: number; y: number }[]) => {
    setFormData({ ...formData, polygon_points: points });
    setIsPolygonEditorOpen(false);
    toast.success("Полигон сохранён");
  };

  if (!complexId) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">ЖК не найден</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/complexes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Корпуса ЖК</h1>
              <p className="text-muted-foreground">{complex?.name}</p>
            </div>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить корпус
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
        ) : buildings && buildings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Цвет</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Этажей</TableHead>
                <TableHead>Полигон</TableHead>
                <TableHead>Опубликован</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell>
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: building.color }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{building.name}</TableCell>
                  <TableCell>{building.floors_count || "—"}</TableCell>
                  <TableCell>
                    {building.polygon_points && building.polygon_points.length > 0 ? (
                      <span className="text-green-600">
                        {building.polygon_points.length} точек
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Не задан</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {building.is_published ? (
                      <span className="text-green-600">Да</span>
                    ) : (
                      <span className="text-muted-foreground">Нет</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(building)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(building)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Корпуса ещё не добавлены
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Добавьте корпуса и разметьте их на генплане для интерактивного выбора квартир
            </p>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый корпус
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBuilding ? "Редактировать корпус" : "Добавить корпус"}
            </DialogTitle>
          </DialogHeader>

          {isPolygonEditorOpen ? (
            <BuildingPolygonEditor
              imageUrl={getPlanImage() || ""}
              initialPoints={formData.polygon_points}
              color={formData.color}
              onSave={handlePolygonSave}
              onCancel={() => setIsPolygonEditorOpen(false)}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название корпуса *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Корпус 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Количество этажей</Label>
                  <Input
                    type="number"
                    value={formData.floors_count}
                    onChange={(e) => setFormData({ ...formData, floors_count: e.target.value })}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Цвет корпуса</Label>
                <div className="flex gap-2 flex-wrap">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        formData.color === color ? "scale-110 border-foreground" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-8 h-8 p-0 border-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Изображение генплана (опционально)</Label>
                <SingleImageUploader
                  value={formData.plan_image}
                  onChange={(url) => setFormData({ ...formData, plan_image: url })}
                  bucket="complex-media"
                  folder="buildings"
                />
                <p className="text-xs text-muted-foreground">
                  Если не указано, будет использовано главное фото ЖК
                </p>
              </div>

              <div className="space-y-2 border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Полигон на генплане</Label>
                    <p className="text-xs text-muted-foreground">
                      {formData.polygon_points.length > 0 
                        ? `${formData.polygon_points.length} точек` 
                        : "Не задан — корпус не будет отображаться на интерактивной карте"
                      }
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsPolygonEditorOpen(true)}
                    disabled={!getPlanImage()}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {formData.polygon_points.length > 0 ? "Изменить" : "Нарисовать"}
                  </Button>
                </div>
                {!getPlanImage() && (
                  <p className="text-xs text-destructive">
                    Загрузите изображение генплана или добавьте фото ЖК
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label>Опубликован</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingBuilding ? "Сохранить" : "Добавить"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
