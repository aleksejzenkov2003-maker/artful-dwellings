import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Loader2,
  ExternalLink,
  Building2, // ✅ FIX: добавили импорт
} from "lucide-react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { usePermissions } from "@/hooks/usePermissions";

type Complex = Tables<"residential_complexes">;
type Coordinates = { lat: number; lng: number };

export default function AdminComplexes() {
  const queryClient = useQueryClient();
  const { canCreate, canDelete, canEdit } = usePermissions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComplex, setEditingComplex] = useState<Complex | null>(null);
  const [formData, setFormData] = useState<Partial<TablesInsert<"residential_complexes">>>({});
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGeocodingAll, setIsGeocodingAll] = useState(false);

  const { data: complexes, isLoading } = useQuery({
    queryKey: ["admin-complexes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("residential_complexes")
        .select("*")
        .order("created_at", { ascending: false });
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
    mutationFn: async (data: TablesInsert<"residential_complexes">) => {
      const { error } = await supabase.from("residential_complexes").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complexes"] });
      toast.success("ЖК добавлен");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<"residential_complexes"> }) => {
      const { error } = await supabase.from("residential_complexes").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complexes"] });
      toast.success("ЖК обновлён");
      resetForm();
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("residential_complexes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complexes"] });
      toast.success("ЖК удалён");
    },
    onError: (error) => toast.error("Ошибка: " + error.message),
  });

  const resetForm = () => {
    setFormData({});
    setEditingComplex(null);
    setIsDialogOpen(false);
  };

  const geocodeAddress = async () => {
    const fullAddress = formData.city ? `${formData.city}, ${formData.address}` : formData.address;

    if (!fullAddress) {
      toast.error("Введите адрес для определения координат");
      return;
    }

    setIsGeocoding(true);
    try {
      const { data, error } = await supabase.functions.invoke("geocode", {
        body: { address: fullAddress },
      });

      if (error) throw error;

      if (data.coordinates) {
        setFormData({
          ...formData,
          coordinates: data.coordinates,
        });
        toast.success(`Координаты определены: ${data.coordinates.lat.toFixed(6)}, ${data.coordinates.lng.toFixed(6)}`);
      } else {
        toast.error("Адрес не найден");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Ошибка определения координат");
    } finally {
      setIsGeocoding(false);
    }
  };

  const geocodeAllAddresses = async () => {
    setIsGeocodingAll(true);
    try {
      const { data, error } = await supabase.functions.invoke("geocode-all");

      if (error) throw error;

      toast.success(`Геокодирование завершено: ${data.success} из ${data.total} объектов`);
      queryClient.invalidateQueries({ queryKey: ["admin-complexes"] });
    } catch (error) {
      console.error("Geocode-all error:", error);
      toast.error("Ошибка массового геокодирования");
    } finally {
      setIsGeocodingAll(false);
    }
  };

  const handleEdit = (complex: Complex) => {
    setEditingComplex(complex);
    setFormData({
      name: complex.name,
      slug: complex.slug,
      description: complex.description,
      address: complex.address,
      district: complex.district,
      city: complex.city,
      city_id: complex.city_id,
      developer: complex.developer,
      status: complex.status,
      price_from: complex.price_from,
      price_to: complex.price_to,
      area_from: complex.area_from,
      area_to: complex.area_to,
      floors_count: complex.floors_count,
      apartments_count: complex.apartments_count,
      main_image: complex.main_image,
      is_published: complex.is_published,
      is_featured: complex.is_featured,
      coordinates: complex.coordinates as Coordinates | null,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingComplex) {
      updateMutation.mutate({ id: editingComplex.id, data: formData });
    } else {
      createMutation.mutate(formData as TablesInsert<"residential_complexes">);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display mb-2">Жилые комплексы</h1>
            <p className="text-muted-foreground">Управление каталогом ЖК</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={geocodeAllAddresses} disabled={isGeocodingAll}>
              {isGeocodingAll ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
              Геокодировать все
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingComplex(null);
                    setFormData({ is_published: true });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить ЖК
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingComplex ? "Редактировать ЖК" : "Добавить ЖК"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Название *</Label>
                      <Input
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input
                        value={formData.slug || ""}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Город</Label>
                      <Select
                        value={formData.city_id || ""}
                        onValueChange={(value) => {
                          const city = cities?.find((c) => c.id === value);
                          setFormData({
                            ...formData,
                            city_id: value,
                            city: city?.name,
                          });
                        }}
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
                      <Label>Район</Label>
                      <Input
                        value={formData.district || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            district: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Адрес</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="ул. Примерная, 1"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={geocodeAddress}
                        disabled={isGeocoding || !formData.address}
                      >
                        {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                      </Button>
                    </div>

                    {(formData.coordinates as Coordinates | null) && (
                      <p className="text-xs text-muted-foreground">
                        Координаты: {(formData.coordinates as Coordinates).lat.toFixed(6)},{" "}
                        {(formData.coordinates as Coordinates).lng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Застройщик</Label>
                      <Input
                        value={formData.developer || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            developer: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Статус</Label>
                      <Select
                        value={formData.status || "building"}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="building">Строится</SelectItem>
                          <SelectItem value="ready">Сдан</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Цена от (₽)</Label>
                      <Input
                        type="number"
                        value={formData.price_from || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_from: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Цена до (₽)</Label>
                      <Input
                        type="number"
                        value={formData.price_to || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_to: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Площадь от (м²)</Label>
                      <Input
                        type="number"
                        value={formData.area_from || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            area_from: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Площадь до (м²)</Label>
                      <Input
                        type="number"
                        value={formData.area_to || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            area_to: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Этажей</Label>
                      <Input
                        type="number"
                        value={formData.floors_count || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            floors_count: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Квартир</Label>
                      <Input
                        type="number"
                        value={formData.apartments_count || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apartments_count: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>URL главного изображения</Label>
                    <Input
                      value={formData.main_image || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          main_image: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_published ?? true}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                      <Label>Опубликован</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_featured ?? false}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label>В избранном</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Отмена
                    </Button>
                    <Button type="submit">{editingComplex ? "Сохранить" : "Создать"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Опубликован</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {complexes?.map((complex) => (
                <TableRow key={complex.id}>
                  <TableCell className="font-medium">{complex.name}</TableCell>
                  <TableCell>{complex.city}</TableCell>
                  <TableCell>{complex.status === "ready" ? "Сдан" : "Строится"}</TableCell>
                  <TableCell>{complex.is_published ? "Да" : "Нет"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" asChild title="Редактировать">
                        <Link to={`/admin/complexes/${complex.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button size="icon" variant="ghost" asChild title="Корпуса">
                        <Link to={`/admin/complexes/${complex.id}/buildings`}>
                          <Building2 className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button size="icon" variant="ghost" asChild title="Просмотр">
                        <Link to={`/novostroyki/${complex.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(complex.id)}
                        title="Удалить"
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
