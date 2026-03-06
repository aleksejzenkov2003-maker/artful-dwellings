import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, MapPin, Loader2, Save } from "lucide-react";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { 
  useAllApartmentsByComplex, 
  useCreateApartment, 
  useUpdateApartment, 
  useDeleteApartment,
  type Apartment 
} from "@/hooks/useApartments";
import { useAllComplexBuildings } from "@/hooks/useComplexBuildings";
import { MediaUploader, type MediaItem } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import {
  useAllComplexSlides,
  useCreateSlide,
  useUpdateSlide,
  useDeleteSlide,
  SLIDE_TYPES,
  type ComplexSlide,
} from "@/hooks/useComplexSlides";

type Complex = Tables<"residential_complexes">;
type Coordinates = { lat: number; lng: number };

export default function AdminComplexEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<TablesUpdate<"residential_complexes">>>({});
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Apartment dialog state
  const [isApartmentDialogOpen, setIsApartmentDialogOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [apartmentForm, setApartmentForm] = useState<Partial<Apartment>>({});

  // Fetch complex data
  const { data: complex, isLoading } = useQuery({
    queryKey: ["admin-complex", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("residential_complexes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch cities
  const { data: cities } = useQuery({
    queryKey: ["cities-all"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*").order("order_position");
      return data || [];
    },
  });

  // Fetch apartments
  const { data: apartments, isLoading: apartmentsLoading } = useAllApartmentsByComplex(id);
  const createApartment = useCreateApartment();
  const updateApartment = useUpdateApartment();
  const deleteApartment = useDeleteApartment();
  
  // Fetch buildings for this complex
  const { data: buildings } = useAllComplexBuildings(id);

  // Slides
  const { data: slides } = useAllComplexSlides(id);
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();
  const [isSlideDialogOpen, setIsSlideDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ComplexSlide | null>(null);
  const [slideForm, setSlideForm] = useState<Partial<ComplexSlide>>({});

  // Initialize form when complex loads
  useState(() => {
    if (complex && Object.keys(formData).length === 0) {
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
        completion_date: complex.completion_date,
        main_image: complex.main_image,
        presentation_url: complex.presentation_url,
        is_published: complex.is_published,
        is_featured: complex.is_featured,
        coordinates: complex.coordinates as Coordinates | null,
        features: complex.features,
        infrastructure: complex.infrastructure,
        seo_title: complex.seo_title,
        seo_description: complex.seo_description,
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: TablesUpdate<"residential_complexes">) => {
      if (!id) throw new Error("No ID");
      const { error } = await supabase.from("residential_complexes").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complex", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-complexes"] });
      toast.success("ЖК сохранён");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
      setIsSaving(false);
    },
  });

  const geocodeAddress = async () => {
    const fullAddress = formData.city 
      ? `${formData.city}, ${formData.address}` 
      : formData.address;
    
    if (!fullAddress) {
      toast.error("Введите адрес для определения координат");
      return;
    }

    setIsGeocoding(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { address: fullAddress }
      });

      if (error) throw error;

      if (data.coordinates) {
        setFormData({ 
          ...formData, 
          coordinates: data.coordinates 
        });
        toast.success(`Координаты определены`);
      } else {
        toast.error("Адрес не найден");
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error("Ошибка определения координат");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Media items from main_image and images array
  const mediaItems = useMemo((): MediaItem[] => {
    const items: MediaItem[] = [];
    
    // Add main image first
    if (formData.main_image) {
      items.push({ url: formData.main_image, type: "image", isMain: true });
    }
    
    // Add other images from images array
    const imagesArray = Array.isArray(formData.images) ? formData.images : [];
    imagesArray.forEach((img: unknown) => {
      if (typeof img === "string" && img !== formData.main_image) {
        items.push({ url: img, type: "image", isMain: false });
      } else if (typeof img === "object" && img !== null) {
        const mediaObj = img as { url?: string; type?: string; isMain?: boolean };
        if (mediaObj.url && mediaObj.url !== formData.main_image) {
          items.push({
            url: mediaObj.url,
            type: (mediaObj.type as "image" | "video") || "image",
            isMain: false,
          });
        }
      }
    });
    
    return items;
  }, [formData.main_image, formData.images]);

  const handleMediaChange = (items: MediaItem[]) => {
    const mainItem = items.find(item => item.isMain && item.type === "image");
    const otherItems = items.filter(item => !item.isMain || item.type !== "image" || item.url !== mainItem?.url);
    
    setFormData({
      ...formData,
      main_image: mainItem?.url || items.find(i => i.type === "image")?.url || null,
      images: otherItems.map(item => ({ url: item.url, type: item.type })),
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Заполните обязательные поля");
      return;
    }
    setIsSaving(true);
    updateMutation.mutate(formData);
  };

  // Apartment handlers
  const handleAddApartment = () => {
    setEditingApartment(null);
    setApartmentForm({
      complex_id: id,
      building_id: null,
      room_type: "1",
      area: 0,
      floor: 1,
      price: 0,
      status: "available",
      is_published: true,
    });
    setIsApartmentDialogOpen(true);
  };

  const handleEditApartment = (apt: Apartment) => {
    setEditingApartment(apt);
    setApartmentForm({
      building_id: apt.building_id,
      room_type: apt.room_type,
      area: apt.area,
      floor: apt.floor,
      price: apt.price,
      status: apt.status,
      layout_image: apt.layout_image,
      is_published: apt.is_published,
    });
    setIsApartmentDialogOpen(true);
  };

  const handleSaveApartment = () => {
    if (!apartmentForm.room_type || !apartmentForm.area || !apartmentForm.price) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (editingApartment) {
      updateApartment.mutate({
        id: editingApartment.id,
        ...apartmentForm,
      });
    } else {
      createApartment.mutate({
        complex_id: id!,
        building_id: apartmentForm.building_id || null,
        room_type: apartmentForm.room_type!,
        area: apartmentForm.area!,
        floor: apartmentForm.floor || 1,
        price: apartmentForm.price!,
        status: apartmentForm.status || "available",
        layout_image: apartmentForm.layout_image || null,
        is_published: apartmentForm.is_published ?? true,
      });
    }
    setIsApartmentDialogOpen(false);
  };

  const handleDeleteApartment = (apt: Apartment) => {
    if (confirm("Удалить квартиру?")) {
      deleteApartment.mutate({ id: apt.id, complexId: id! });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!complex) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">ЖК не найден</p>
          <Button asChild>
            <Link to="/admin/complexes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Initialize form data from complex
  if (Object.keys(formData).length === 0) {
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
      completion_date: complex.completion_date,
      main_image: complex.main_image,
      presentation_url: complex.presentation_url,
      is_published: complex.is_published,
      is_featured: complex.is_featured,
      coordinates: complex.coordinates as Coordinates | null,
      features: complex.features,
      infrastructure: complex.infrastructure,
      seo_title: complex.seo_title,
      seo_description: complex.seo_description,
    });
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/admin/complexes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-display">{complex.name}</h1>
              <p className="text-muted-foreground text-sm">Редактирование ЖК</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Сохранить
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Основное</TabsTrigger>
            <TabsTrigger value="apartments">Квартиры ({apartments?.length || 0})</TabsTrigger>
            <TabsTrigger value="slides">Слайды ({slides?.length || 0})</TabsTrigger>
            <TabsTrigger value="media">Медиа</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <RichTextEditor
                    value={formData.description || ""}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="Введите описание ЖК..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Город</Label>
                    <Select
                      value={formData.city_id || ""}
                      onValueChange={(value) => {
                        const city = cities?.find(c => c.id === value);
                        setFormData({ ...formData, city_id: value, city: city?.name });
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
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Адрес</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={geocodeAddress}
                      disabled={isGeocoding}
                    >
                      {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    </Button>
                  </div>
                  {(formData.coordinates as Coordinates | null) && (
                    <p className="text-xs text-muted-foreground">
                      Координаты: {(formData.coordinates as Coordinates).lat.toFixed(6)}, {(formData.coordinates as Coordinates).lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Застройщик</Label>
                    <Input
                      value={formData.developer || ""}
                      onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, price_from: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Цена до (₽)</Label>
                    <Input
                      type="number"
                      value={formData.price_to || ""}
                      onChange={(e) => setFormData({ ...formData, price_to: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Площадь от (м²)</Label>
                    <Input
                      type="number"
                      value={formData.area_from || ""}
                      onChange={(e) => setFormData({ ...formData, area_from: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Площадь до (м²)</Label>
                    <Input
                      type="number"
                      value={formData.area_to || ""}
                      onChange={(e) => setFormData({ ...formData, area_to: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Этажей</Label>
                    <Input
                      type="number"
                      value={formData.floors_count || ""}
                      onChange={(e) => setFormData({ ...formData, floors_count: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Дата сдачи</Label>
                    <Input
                      type="date"
                      value={formData.completion_date || ""}
                      onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
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
              </div>
            </div>
          </TabsContent>

          {/* Apartments Tab */}
          <TabsContent value="apartments" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Квартиры в продаже: {apartments?.filter(a => a.status === 'available').length || 0}
              </p>
              <Button onClick={handleAddApartment}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить квартиру
              </Button>
            </div>

            {apartmentsLoading ? (
              <div className="text-center py-8">Загрузка...</div>
            ) : apartments && apartments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тип</TableHead>
                    <TableHead>Площадь</TableHead>
                    <TableHead>Этаж</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Опубликована</TableHead>
                    <TableHead className="w-[100px]">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apartments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell>
                        {apt.room_type === "studio" ? "Студия" : `${apt.room_type}-комн.`}
                      </TableCell>
                      <TableCell>{apt.area} м²</TableCell>
                      <TableCell>{apt.floor}</TableCell>
                      <TableCell>{formatPrice(apt.price)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded ${
                          apt.status === "available" ? "bg-green-100 text-green-700" :
                          apt.status === "reserved" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {apt.status === "available" ? "В продаже" :
                           apt.status === "reserved" ? "Забронирована" : "Продана"}
                        </span>
                      </TableCell>
                      <TableCell>{apt.is_published ? "Да" : "Нет"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEditApartment(apt)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDeleteApartment(apt)}
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
              <div className="text-center py-12 text-muted-foreground">
                Квартиры не добавлены
              </div>
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-6">
              {/* Images and Videos Uploader */}
              <div className="space-y-2">
                <Label>Фотографии и видео</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Загрузите фото и видео с компьютера. Изображения автоматически оптимизируются. Отметьте звёздочкой главное фото.
                </p>
                <MediaUploader
                  value={mediaItems}
                  onChange={handleMediaChange}
                  folder={id}
                  acceptImages={true}
                  acceptVideos={true}
                />
              </div>

              {/* Presentation PDF */}
              <div className="space-y-2 pt-4 border-t">
                <Label>Презентация застройщика (PDF)</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.presentation_url || ""}
                    onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                    placeholder="URL презентации или загрузите файл"
                    className="flex-1"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const fileName = `${id}/${Date.now()}_${file.name}`;
                        const { error: uploadError } = await supabase.storage
                          .from("presentations")
                          .upload(fileName, file);
                        
                        if (uploadError) {
                          toast.error("Ошибка загрузки: " + uploadError.message);
                          return;
                        }
                        
                        const { data: urlData } = supabase.storage
                          .from("presentations")
                          .getPublicUrl(fileName);
                        
                        setFormData({ ...formData, presentation_url: urlData.publicUrl });
                        toast.success("Презентация загружена");
                      }}
                    />
                    <Button type="button" variant="outline" asChild>
                      <span>Загрузить PDF</span>
                    </Button>
                  </label>
                </div>
                {formData.presentation_url && (
                  <div className="flex items-center gap-2 mt-2">
                    <a 
                      href={formData.presentation_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline"
                    >
                      Просмотреть загруженную презентацию
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setFormData({ ...formData, presentation_url: null })}
                    >
                      Удалить
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Если презентация не загружена, будет автоматически сгенерирована из данных ЖК
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Slides Tab */}
          <TabsContent value="slides" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Слайды для секции «Концепция»
              </p>
              <Button onClick={() => {
                setEditingSlide(null);
                setSlideForm({
                  complex_id: id,
                  slide_type: "architecture",
                  title: "",
                  description: "",
                  image_url: "",
                  order_position: (slides?.length || 0),
                  is_published: true,
                });
                setIsSlideDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить слайд
              </Button>
            </div>

            {slides && slides.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тип</TableHead>
                    <TableHead>Заголовок</TableHead>
                    <TableHead>Изображение</TableHead>
                    <TableHead>Порядок</TableHead>
                    <TableHead>Опубликован</TableHead>
                    <TableHead className="w-[100px]">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slides.map((slide) => (
                    <TableRow key={slide.id}>
                      <TableCell>
                        {SLIDE_TYPES.find(t => t.value === slide.slide_type)?.label || slide.slide_type}
                      </TableCell>
                      <TableCell>{slide.title}</TableCell>
                      <TableCell>
                        {slide.image_url ? (
                          <img src={slide.image_url} alt="" className="w-16 h-10 object-cover rounded" />
                        ) : "—"}
                      </TableCell>
                      <TableCell>{slide.order_position}</TableCell>
                      <TableCell>{slide.is_published ? "Да" : "Нет"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => {
                            setEditingSlide(slide);
                            setSlideForm({
                              slide_type: slide.slide_type,
                              title: slide.title,
                              description: slide.description,
                              image_url: slide.image_url,
                              order_position: slide.order_position,
                              is_published: slide.is_published,
                            });
                            setIsSlideDialogOpen(true);
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                            if (confirm("Удалить слайд?")) deleteSlide.mutate(slide.id);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Слайды не добавлены. Добавьте слайды чтобы секция «Концепция» отображалась на странице ЖК.
              </div>
            )}
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label>SEO Заголовок</Label>
                <Input
                  value={formData.seo_title || ""}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={formData.name || ""}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Описание</Label>
                <Input
                  value={formData.seo_description || ""}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Краткое описание для поисковых систем"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Apartment Dialog */}
      <Dialog open={isApartmentDialogOpen} onOpenChange={setIsApartmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingApartment ? "Редактировать квартиру" : "Добавить квартиру"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Building selection */}
            {buildings && buildings.length > 0 && (
              <div className="space-y-2">
                <Label>Корпус</Label>
                <Select
                  value={apartmentForm.building_id || "none"}
                  onValueChange={(value) => setApartmentForm({ ...apartmentForm, building_id: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите корпус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не указан</SelectItem>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: building.color }}
                          />
                          {building.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Тип квартиры *</Label>
                <Select
                  value={apartmentForm.room_type || "1"}
                  onValueChange={(value) => setApartmentForm({ ...apartmentForm, room_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Студия</SelectItem>
                    <SelectItem value="1">1-комнатная</SelectItem>
                    <SelectItem value="2">2-комнатная</SelectItem>
                    <SelectItem value="3">3-комнатная</SelectItem>
                    <SelectItem value="4">4-комнатная</SelectItem>
                    <SelectItem value="5+">5+ комнат</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select
                  value={apartmentForm.status || "available"}
                  onValueChange={(value) => setApartmentForm({ ...apartmentForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">В продаже</SelectItem>
                    <SelectItem value="reserved">Забронирована</SelectItem>
                    <SelectItem value="sold">Продана</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Площадь (м²) *</Label>
                <Input
                  type="number"
                  value={apartmentForm.area || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, area: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Этаж</Label>
                <Input
                  type="number"
                  value={apartmentForm.floor || ""}
                  onChange={(e) => setApartmentForm({ ...apartmentForm, floor: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Цена (₽) *</Label>
              <Input
                type="number"
                value={apartmentForm.price || ""}
                onChange={(e) => setApartmentForm({ ...apartmentForm, price: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>URL планировки</Label>
              <Input
                value={apartmentForm.layout_image || ""}
                onChange={(e) => setApartmentForm({ ...apartmentForm, layout_image: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={apartmentForm.is_published ?? true}
                onCheckedChange={(checked) => setApartmentForm({ ...apartmentForm, is_published: checked })}
              />
              <Label>Опубликована</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApartmentDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveApartment}>
                {editingApartment ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
