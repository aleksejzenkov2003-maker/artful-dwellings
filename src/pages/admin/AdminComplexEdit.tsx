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
import { FileUploader } from "@/components/admin/FileUploader";
import {
  useAllComplexSlides,
  useCreateSlide,
  useUpdateSlide,
  useDeleteSlide,
  SLIDE_TYPES,
  type ComplexSlide,
} from "@/hooks/useComplexSlides";
import type { PageContent } from "@/types/pageContent";

type Complex = Tables<"residential_complexes">;
type Coordinates = { lat: number; lng: number };

export default function AdminComplexEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<TablesUpdate<"residential_complexes">> & { page_content?: any }>({});
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
        page_content: (complex as any).page_content || {},
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
      page_content: (complex as any).page_content || {},
    });
  }

  const pageContent: PageContent = ((formData as any).page_content as PageContent) || {};
  const updatePageContent = (patch: Partial<PageContent>) => {
    setFormData({
      ...formData,
      page_content: { ...pageContent, ...patch },
    } as any);
  };

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
            <TabsTrigger value="page-content">Контент страницы</TabsTrigger>
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

          {/* Page Content Tab */}
          <TabsContent value="page-content" className="space-y-8">
            {/* Hero */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Главный экран (Hero)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label>Фон первого экрана (изображение)</Label>
                  <SingleImageUploader
                    value={pageContent.hero_background_image || ""}
                    onChange={(url) => updatePageContent({ hero_background_image: url })}
                    folder={id}
                    placeholder="Загрузить фон"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Подзаголовок героя</Label>
                  <Input
                    value={pageContent.hero_title || ""}
                    onChange={(e) => updatePageContent({ hero_title: e.target.value })}
                    placeholder="Элитный клубный дом в историческом центре..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Станция метро</Label>
                  <Input
                    value={pageContent.metro_station || ""}
                    onChange={(e) => updatePageContent({ metro_station: e.target.value })}
                    placeholder="пл. Восстания"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input
                    value={pageContent.phone || ""}
                    onChange={(e) => updatePageContent({ phone: e.target.value })}
                    placeholder="+7 (812) 501-1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Часы работы</Label>
                  <Input
                    value={pageContent.work_hours || ""}
                    onChange={(e) => updatePageContent({ work_hours: e.target.value })}
                    placeholder="Ежедневно 10:00-20:00"
                  />
                </div>
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">О проекте</h3>
              <div className="space-y-2">
                <Label>Развёрнутое описание (HTML)</Label>
                <RichTextEditor
                  value={pageContent.about_text || ""}
                  onChange={(value) => updatePageContent({ about_text: value })}
                  placeholder="Подробное описание проекта..."
                />
              </div>
              <div className="space-y-2">
                <Label>Дополнительные изображения (URL через Enter)</Label>
                <Textarea
                  value={(pageContent.about_images || []).join("\n")}
                  onChange={(e) =>
                    updatePageContent({
                      about_images: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={4}
                  placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
                />
              </div>
            </div>

            {/* Video & Tour */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Видео и виртуальный тур</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL видео (YouTube / Vimeo)</Label>
                  <Input
                    value={pageContent.video_url || ""}
                    onChange={(e) => updatePageContent({ video_url: e.target.value })}
                    placeholder="https://vimeo.com/1017946140"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL панорамы (виртуальная прогулка)</Label>
                  <Input
                    value={pageContent.panorama_url || ""}
                    onChange={(e) => updatePageContent({ panorama_url: e.target.value })}
                    placeholder="https://example.com/tour/tour.html"
                  />
                </div>
              </div>
            </div>

            {/* Map / Layouts background images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Изображения блоков</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Карта / подложка (изображение)</Label>
                  <SingleImageUploader
                    value={pageContent.map_image || ""}
                    onChange={(url) => updatePageContent({ map_image: url })}
                    folder={id}
                    placeholder="Загрузить карту"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Фон секции «Планировки квартир» (изображение)</Label>
                  <SingleImageUploader
                    value={pageContent.layouts_background_image || ""}
                    onChange={(url) => updatePageContent({ layouts_background_image: url })}
                    folder={id}
                    placeholder="Загрузить фон планировок"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Планировки квартир берутся из таблицы квартир (апартаменты), здесь настраивается только фон секции.
              </p>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Документация</h3>
              <p className="text-xs text-muted-foreground">
                Добавляй документы (PDF/DOC/DOCX). На странице они появятся списком.
              </p>
              {(pageContent.documents || []).map((doc, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Документ {idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-7 w-7"
                      onClick={() => {
                        const documents = (pageContent.documents || []).filter((_, i) => i !== idx);
                        updatePageContent({ documents });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={doc.title}
                    onChange={(e) => {
                      const documents = [...(pageContent.documents || [])];
                      documents[idx] = { ...documents[idx], title: e.target.value };
                      updatePageContent({ documents });
                    }}
                    placeholder="Название документа"
                  />
                  <div className="space-y-2">
                    <Label>Файл</Label>
                    <FileUploader
                      value={doc.url}
                      onChange={(url) => {
                        const documents = [...(pageContent.documents || [])];
                        documents[idx] = { ...documents[idx], url };
                        updatePageContent({ documents });
                      }}
                      folder={id}
                      bucket="complex-documents"
                      accept=".pdf,.doc,.docx"
                      placeholder="Загрузить документ"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  updatePageContent({
                    documents: [...(pageContent.documents || []), { title: "", url: "" }],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Добавить документ
              </Button>
            </div>

            {/* Promotions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Акции</h3>
              <p className="text-xs text-muted-foreground">
                Эти карточки заменят блок «Акции» в шаблоне.
              </p>
              {(pageContent.promotions || []).map((p, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Акция {idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-7 w-7"
                      onClick={() => {
                        const promotions = (pageContent.promotions || []).filter((_, i) => i !== idx);
                        updatePageContent({ promotions });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={p.title}
                    onChange={(e) => {
                      const promotions = [...(pageContent.promotions || [])];
                      promotions[idx] = { ...promotions[idx], title: e.target.value };
                      updatePageContent({ promotions });
                    }}
                    placeholder="Заголовок"
                  />
                  <Textarea
                    value={p.text || ""}
                    onChange={(e) => {
                      const promotions = [...(pageContent.promotions || [])];
                      promotions[idx] = { ...promotions[idx], text: e.target.value };
                      updatePageContent({ promotions });
                    }}
                    rows={3}
                    placeholder="Описание"
                  />
                  <div className="space-y-2">
                    <Label>Изображение (опционально)</Label>
                    <SingleImageUploader
                      value={p.image_url || ""}
                      onChange={(url) => {
                        const promotions = [...(pageContent.promotions || [])];
                        promotions[idx] = { ...promotions[idx], image_url: url };
                        updatePageContent({ promotions });
                      }}
                      folder={id}
                      placeholder="Загрузить картинку"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  updatePageContent({
                    promotions: [...(pageContent.promotions || []), { title: "", text: "", image_url: "" }],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Добавить акцию
              </Button>
            </div>

            {/* Installments (template programs) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Программы рассрочки (как в шаблоне)</h3>
              <div className="space-y-2">
                <Label>Вступительный текст (HTML)</Label>
                <RichTextEditor
                  value={pageContent.installments_intro || ""}
                  onChange={(value) => updatePageContent({ installments_intro: value })}
                  placeholder="Беспроцентная рассрочка от застройщика…"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Подзаголовок: «Субсидированные ставки…»</Label>
                  <Input
                    value={pageContent.installments_subsidy_heading || ""}
                    onChange={(e) => updatePageContent({ installments_subsidy_heading: e.target.value })}
                    placeholder="Субсидированные ставки до 6% по СИ без удорожания"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Список ставок (HTML, можно &lt;br&gt;)</Label>
                  <Textarea
                    value={pageContent.installments_subsidy_rates_html || ""}
                    onChange={(e) => updatePageContent({ installments_subsidy_rates_html: e.target.value })}
                    rows={4}
                    placeholder={"БСПБ — 5,76%<br />Альфабанк — 4,9%<br />…"}
                  />
                </div>
              </div>

              <div className="space-y-3 border rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Подзаголовок программы №1</Label>
                    <Input
                      value={pageContent.installments_program1_heading || ""}
                      onChange={(e) => updatePageContent({ installments_program1_heading: e.target.value })}
                      placeholder="Рассрочка с первым взносом 30%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание программы №1</Label>
                    <Input
                      value={pageContent.installments_program1_note || ""}
                      onChange={(e) => updatePageContent({ installments_program1_note: e.target.value })}
                      placeholder="Предложение по базовой цене…"
                    />
                  </div>
                </div>

                <Label>Карточки программы №1 (2 шт. в шаблоне)</Label>
                {(pageContent.installments_program1_cards || []).map((card, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      value={card.title}
                      onChange={(e) => {
                        const cards = [...(pageContent.installments_program1_cards || [])];
                        cards[idx] = { ...cards[idx], title: e.target.value };
                        updatePageContent({ installments_program1_cards: cards });
                      }}
                      placeholder="Заголовок (например 30%)"
                      className="flex-1"
                    />
                    <Input
                      value={card.description}
                      onChange={(e) => {
                        const cards = [...(pageContent.installments_program1_cards || [])];
                        cards[idx] = { ...cards[idx], description: e.target.value };
                        updatePageContent({ installments_program1_cards: cards });
                      }}
                      placeholder="Описание"
                      className="flex-[2]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => {
                        const cards = (pageContent.installments_program1_cards || []).filter((_, i) => i !== idx);
                        updatePageContent({ installments_program1_cards: cards });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updatePageContent({
                      installments_program1_cards: [
                        ...(pageContent.installments_program1_cards || []),
                        { title: "", description: "" },
                      ],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить карточку
                </Button>
              </div>

              <div className="space-y-3 border rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Подзаголовок программы №2</Label>
                    <Input
                      value={pageContent.installments_program2_heading || ""}
                      onChange={(e) => updatePageContent({ installments_program2_heading: e.target.value })}
                      placeholder="Рассрочка с первым взносом 50%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание программы №2</Label>
                    <Input
                      value={pageContent.installments_program2_note || ""}
                      onChange={(e) => updatePageContent({ installments_program2_note: e.target.value })}
                      placeholder="Предложение по цене 100% оплаты…"
                    />
                  </div>
                </div>

                <Label>Карточки программы №2 (2 шт. в шаблоне)</Label>
                {(pageContent.installments_program2_cards || []).map((card, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      value={card.title}
                      onChange={(e) => {
                        const cards = [...(pageContent.installments_program2_cards || [])];
                        cards[idx] = { ...cards[idx], title: e.target.value };
                        updatePageContent({ installments_program2_cards: cards });
                      }}
                      placeholder="Заголовок (например 50%)"
                      className="flex-1"
                    />
                    <Input
                      value={card.description}
                      onChange={(e) => {
                        const cards = [...(pageContent.installments_program2_cards || [])];
                        cards[idx] = { ...cards[idx], description: e.target.value };
                        updatePageContent({ installments_program2_cards: cards });
                      }}
                      placeholder="Описание"
                      className="flex-[2]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => {
                        const cards = (pageContent.installments_program2_cards || []).filter((_, i) => i !== idx);
                        updatePageContent({ installments_program2_cards: cards });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updatePageContent({
                      installments_program2_cards: [
                        ...(pageContent.installments_program2_cards || []),
                        { title: "", description: "" },
                      ],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить карточку
                </Button>
              </div>
            </div>

            {/* Driver (template block) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Личный водитель (как в шаблоне)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <Label>Фон секции (изображение)</Label>
                  <SingleImageUploader
                    value={pageContent.driver_background_image || ""}
                    onChange={(url) => updatePageContent({ driver_background_image: url })}
                    folder={id}
                    placeholder="Загрузить фон секции"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input
                    value={pageContent.driver_title || ""}
                    onChange={(e) => updatePageContent({ driver_title: e.target.value })}
                    placeholder="Личный водитель"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Бейдж (например «БЕСПЛАТНО»)</Label>
                  <Input
                    value={pageContent.driver_badge || ""}
                    onChange={(e) => updatePageContent({ driver_badge: e.target.value })}
                    placeholder="БЕСПЛАТНО"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Описание (HTML)</Label>
                  <RichTextEditor
                    value={pageContent.driver_description || ""}
                    onChange={(value) => updatePageContent({ driver_description: value })}
                    placeholder="Забронируйте поездку…"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Текст справа (HTML)</Label>
                  <RichTextEditor
                    value={pageContent.driver_right_text || ""}
                    onChange={(value) => updatePageContent({ driver_right_text: value })}
                    placeholder="Запланируйте поездку…"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Время ожидания</Label>
                  <Input
                    value={pageContent.driver_wait_time || ""}
                    onChange={(e) => updatePageContent({ driver_wait_time: e.target.value })}
                    placeholder="время ожидания 15 минут"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Картинка автомобиля (PNG)</Label>
                  <SingleImageUploader
                    value={pageContent.driver_car_image || ""}
                    onChange={(url) => updatePageContent({ driver_car_image: url })}
                    folder={id}
                    placeholder="Загрузить изображение"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Текст кнопки формы</Label>
                  <Input
                    value={pageContent.driver_button_text || ""}
                    onChange={(e) => updatePageContent({ driver_button_text: e.target.value })}
                    placeholder="Вызвать личного водителя"
                  />
                </div>
              </div>
            </div>

            {/* Telegram (template block) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Telegram-канал (как в шаблоне)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input
                    value={pageContent.telegram_title || ""}
                    onChange={(e) => updatePageContent({ telegram_title: e.target.value })}
                    placeholder="Наш Telegram-канал"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ссылка кнопки</Label>
                  <Input
                    value={pageContent.telegram_button_url || ""}
                    onChange={(e) => updatePageContent({ telegram_button_url: e.target.value })}
                    placeholder="https://t.me/..."
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Описание (HTML)</Label>
                  <RichTextEditor
                    value={pageContent.telegram_description || ""}
                    onChange={(value) => updatePageContent({ telegram_description: value })}
                    placeholder="Будьте в курсе новостей…"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Текст кнопки</Label>
                  <Input
                    value={pageContent.telegram_button_text || ""}
                    onChange={(e) => updatePageContent({ telegram_button_text: e.target.value })}
                    placeholder="ПРИСОЕДИНИТЬСЯ"
                  />
                </div>
                <div className="space-y-2">
                  <Label>QR-код (изображение)</Label>
                  <SingleImageUploader
                    value={pageContent.telegram_qr_image || ""}
                    onChange={(url) => updatePageContent({ telegram_qr_image: url })}
                    folder={id}
                    placeholder="Загрузить QR"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Скрин телефона (изображение)</Label>
                  <SingleImageUploader
                    value={pageContent.telegram_phone_image || ""}
                    onChange={(url) => updatePageContent({ telegram_phone_image: url })}
                    folder={id}
                    placeholder="Загрузить скрин"
                  />
                </div>
              </div>
            </div>

            {/* Forms & Disclaimer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Формы и дисклеймер</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Redirect после отправки формы</Label>
                  <Input
                    value={pageContent.forms_success_url || "/thanks"}
                    onChange={(e) => updatePageContent({ forms_success_url: e.target.value })}
                    placeholder="/thanks"
                  />
                  <p className="text-xs text-muted-foreground">
                    Это заменит `data-success-url` у форм из шаблона (чтобы не уходили на чужой домен).
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Дисклеймер (HTML) — плашка внизу</Label>
                <RichTextEditor
                  value={pageContent.disclaimer_text || ""}
                  onChange={(value) => updatePageContent({ disclaimer_text: value })}
                  placeholder="Art Estate не является финансовой организацией…"
                />
              </div>
            </div>

            {/* Infrastructure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Инфраструктура</h3>
              <div className="space-y-2">
                <Label>Описание инфраструктуры (HTML)</Label>
                <RichTextEditor
                  value={pageContent.infrastructure_text || ""}
                  onChange={(value) => updatePageContent({ infrastructure_text: value })}
                  placeholder="Описание расположения и инфраструктуры..."
                />
              </div>
              <div className="space-y-2">
                <Label>Пункты инфраструктуры</Label>
                {(pageContent.infrastructure_items || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const items = [...(pageContent.infrastructure_items || [])];
                        items[idx] = { ...items[idx], title: e.target.value };
                        updatePageContent({ infrastructure_items: items });
                      }}
                      placeholder="Название"
                      className="flex-1"
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => {
                        const items = [...(pageContent.infrastructure_items || [])];
                        items[idx] = { ...items[idx], description: e.target.value };
                        updatePageContent({ infrastructure_items: items });
                      }}
                      placeholder="Описание"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => {
                        const items = (pageContent.infrastructure_items || []).filter(
                          (_, i) => i !== idx,
                        );
                        updatePageContent({ infrastructure_items: items });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updatePageContent({
                      infrastructure_items: [
                        ...(pageContent.infrastructure_items || []),
                        { title: "", description: "" },
                      ],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить пункт
                </Button>
              </div>
            </div>

            {/* Mortgage */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Ипотека</h3>
              <div className="space-y-2">
                <Label>Описание ипотеки (HTML)</Label>
                <RichTextEditor
                  value={pageContent.mortgage_text || ""}
                  onChange={(value) => updatePageContent({ mortgage_text: value })}
                  placeholder="Условия ипотеки, банки-партнёры..."
                />
              </div>
              <div className="space-y-2">
                <Label>Условия (параметры)</Label>
                {(pageContent.mortgage_conditions || []).map((cond, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      value={cond.title}
                      onChange={(e) => {
                        const list = [...(pageContent.mortgage_conditions || [])];
                        list[idx] = { ...list[idx], title: e.target.value };
                        updatePageContent({ mortgage_conditions: list });
                      }}
                      placeholder="Параметр (напр. Ставка)"
                      className="flex-1"
                    />
                    <Input
                      value={cond.value}
                      onChange={(e) => {
                        const list = [...(pageContent.mortgage_conditions || [])];
                        list[idx] = { ...list[idx], value: e.target.value };
                        updatePageContent({ mortgage_conditions: list });
                      }}
                      placeholder="Значение (напр. от 5.9%)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => {
                        const list = (pageContent.mortgage_conditions || []).filter(
                          (_, i) => i !== idx,
                        );
                        updatePageContent({ mortgage_conditions: list });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updatePageContent({
                      mortgage_conditions: [
                        ...(pageContent.mortgage_conditions || []),
                        { title: "", value: "" },
                      ],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить условие
                </Button>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">FAQ (Частые вопросы)</h3>
              {(pageContent.faq || []).map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Вопрос {idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-7 w-7"
                      onClick={() => {
                        const faq = (pageContent.faq || []).filter((_, i) => i !== idx);
                        updatePageContent({ faq });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.question}
                    onChange={(e) => {
                      const faq = [...(pageContent.faq || [])];
                      faq[idx] = { ...faq[idx], question: e.target.value };
                      updatePageContent({ faq });
                    }}
                    placeholder="Вопрос"
                  />
                  <Textarea
                    value={item.answer}
                    onChange={(e) => {
                      const faq = [...(pageContent.faq || [])];
                      faq[idx] = { ...faq[idx], answer: e.target.value };
                      updatePageContent({ faq });
                    }}
                    placeholder="Ответ"
                    rows={3}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  updatePageContent({
                    faq: [...(pageContent.faq || []), { question: "", answer: "" }],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Добавить вопрос
              </Button>
            </div>

            {/* Contacts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Контакты (на странице)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Контактный телефон</Label>
                  <Input
                    value={pageContent.contact_phone || ""}
                    onChange={(e) => updatePageContent({ contact_phone: e.target.value })}
                    placeholder="+7 (812) 501-1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={pageContent.contact_email || ""}
                    onChange={(e) => updatePageContent({ contact_email: e.target.value })}
                    placeholder="info@example.com"
                  />
                </div>
              </div>
            </div>
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
      {/* Slide Dialog */}
      <Dialog open={isSlideDialogOpen} onOpenChange={setIsSlideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Редактировать слайд" : "Добавить слайд"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Тип слайда</Label>
              <Select
                value={slideForm.slide_type || "architecture"}
                onValueChange={(value) => setSlideForm({ ...slideForm, slide_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLIDE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Заголовок *</Label>
              <Input
                value={slideForm.title || ""}
                onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={slideForm.description || ""}
                onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>URL изображения</Label>
              <Input
                value={slideForm.image_url || ""}
                onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Порядок</Label>
                <Input
                  type="number"
                  value={slideForm.order_position ?? 0}
                  onChange={(e) => setSlideForm({ ...slideForm, order_position: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={slideForm.is_published ?? true}
                  onCheckedChange={(checked) => setSlideForm({ ...slideForm, is_published: checked })}
                />
                <Label>Опубликован</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSlideDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => {
                if (!slideForm.title) {
                  toast.error("Введите заголовок");
                  return;
                }
                if (editingSlide) {
                  updateSlide.mutate({
                    id: editingSlide.id,
                    ...slideForm,
                  });
                } else {
                  createSlide.mutate({
                    complex_id: id!,
                    slide_type: slideForm.slide_type || "architecture",
                    title: slideForm.title!,
                    description: slideForm.description || null,
                    image_url: slideForm.image_url || null,
                    order_position: slideForm.order_position || 0,
                    is_published: slideForm.is_published ?? true,
                  });
                }
                setIsSlideDialogOpen(false);
                toast.success(editingSlide ? "Слайд обновлён" : "Слайд добавлен");
              }}>
                {editingSlide ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
