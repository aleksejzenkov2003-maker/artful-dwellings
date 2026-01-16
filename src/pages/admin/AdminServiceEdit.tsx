import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Plus, 
  Trash2,
  Type,
  Image as ImageIcon,
  Quote,
  Columns,
  Heading1,
  FileText,
  MoveUp,
  MoveDown,
  X
} from "lucide-react";
import type { Tables, TablesUpdate, Json } from "@/integrations/supabase/types";
import { MediaUploader, type MediaItem } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdvantagesEditor } from "@/components/admin/AdvantagesEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Service = Tables<"services">;

// Content block types
type BlockType = "text" | "heading" | "image" | "quote" | "colored-block" | "two-columns" | "image-text";

interface ContentBlock {
  id: string;
  type: BlockType;
  content?: string;
  heading?: string;
  imageUrl?: string;
  imageCaption?: string;
  imagePosition?: "left" | "right" | "full";
  backgroundColor?: string;
  textColor?: string;
  quoteAuthor?: string;
  leftContent?: string;
  rightContent?: string;
  alignment?: "left" | "center" | "right";
}

const blockTypeLabels: Record<BlockType, { label: string; icon: React.ReactNode }> = {
  text: { label: "Текст", icon: <Type className="h-4 w-4" /> },
  heading: { label: "Заголовок", icon: <Heading1 className="h-4 w-4" /> },
  image: { label: "Изображение", icon: <ImageIcon className="h-4 w-4" /> },
  quote: { label: "Цитата", icon: <Quote className="h-4 w-4" /> },
  "colored-block": { label: "Цветной блок", icon: <FileText className="h-4 w-4" /> },
  "two-columns": { label: "Две колонки", icon: <Columns className="h-4 w-4" /> },
  "image-text": { label: "Изображение + текст", icon: <Columns className="h-4 w-4" /> },
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// Content Block Editor Component
const ContentBlockEditor = ({
  block,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { label, icon } = blockTypeLabels[block.type];

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={onMoveUp} disabled={isFirst}>
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={onMoveDown} disabled={isLast}>
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="text-destructive" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {block.type === "heading" && (
        <Input
          value={block.heading || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          placeholder="Заголовок..."
        />
      )}

      {block.type === "text" && (
        <RichTextEditor
          value={block.content || ""}
          onChange={(value) => onUpdate({ content: value })}
          placeholder="Текст..."
        />
      )}

      {block.type === "image" && (
        <div className="space-y-3">
          <MediaUploader
            value={block.imageUrl ? [{ url: block.imageUrl, type: "image", isMain: true }] : []}
            onChange={(items) => onUpdate({ imageUrl: items[0]?.url || "" })}
            folder="services"
            maxFiles={1}
            acceptImages={true}
            acceptVideos={false}
          />
          <Input
            value={block.imageCaption || ""}
            onChange={(e) => onUpdate({ imageCaption: e.target.value })}
            placeholder="Подпись к изображению"
          />
        </div>
      )}

      {block.type === "quote" && (
        <div className="space-y-3">
          <Textarea
            value={block.content || ""}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Текст цитаты..."
            rows={3}
          />
          <Input
            value={block.quoteAuthor || ""}
            onChange={(e) => onUpdate({ quoteAuthor: e.target.value })}
            placeholder="Автор цитаты"
          />
        </div>
      )}

      {block.type === "colored-block" && (
        <div className="space-y-3">
          <RichTextEditor
            value={block.content || ""}
            onChange={(value) => onUpdate({ content: value })}
            placeholder="Текст блока..."
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-xs">Цвет фона</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={block.backgroundColor || "#c4a77d"}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={block.backgroundColor || "#c4a77d"}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                />
              </div>
            </div>
            <div className="flex-1">
              <Label className="text-xs">Цвет текста</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={block.textColor || "#ffffff"}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={block.textColor || "#ffffff"}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {block.type === "two-columns" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1">Левая колонка</Label>
            <RichTextEditor
              value={block.leftContent || ""}
              onChange={(value) => onUpdate({ leftContent: value })}
              placeholder="Левая колонка..."
            />
          </div>
          <div>
            <Label className="text-xs mb-1">Правая колонка</Label>
            <RichTextEditor
              value={block.rightContent || ""}
              onChange={(value) => onUpdate({ rightContent: value })}
              placeholder="Правая колонка..."
            />
          </div>
        </div>
      )}

      {block.type === "image-text" && (
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-xs">Позиция изображения</Label>
              <Select
                value={block.imagePosition || "left"}
                onValueChange={(value) => onUpdate({ imagePosition: value as "left" | "right" })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Слева</SelectItem>
                  <SelectItem value="right">Справа</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <MediaUploader
            value={block.imageUrl ? [{ url: block.imageUrl, type: "image", isMain: true }] : []}
            onChange={(items) => onUpdate({ imageUrl: items[0]?.url || "" })}
            folder="services"
            maxFiles={1}
            acceptImages={true}
            acceptVideos={false}
          />
          <Input
            value={block.imageCaption || ""}
            onChange={(e) => onUpdate({ imageCaption: e.target.value })}
            placeholder="Подпись к изображению"
          />
          <RichTextEditor
            value={block.content || ""}
            onChange={(value) => onUpdate({ content: value })}
            placeholder="Текст рядом с изображением..."
          />
        </div>
      )}
    </div>
  );
};

export default function AdminServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<TablesUpdate<"services">>>({});
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");
  const [advantages, setAdvantages] = useState<any[]>([]);
  const [introText, setIntroText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredText, setFeaturedText] = useState("");
  const [hoverText, setHoverText] = useState("");

  // Fetch service data
  const { data: service, isLoading } = useQuery({
    queryKey: ["admin-service", id],
    queryFn: async () => {
      if (isNew || !id) return null;
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!id,
  });

  // Initialize form when service loads
  useMemo(() => {
    if (service && Object.keys(formData).length === 0) {
      setFormData({
        title: service.title,
        slug: service.slug,
        short_description: service.short_description,
        description: service.description,
        icon: service.icon,
        main_image: service.main_image,
        order_position: service.order_position,
        seo_title: service.seo_title,
        seo_description: service.seo_description,
        is_published: service.is_published,
      });
      
      // Parse content blocks
      try {
        const parsed = (service as any).content_blocks;
        if (Array.isArray(parsed)) {
          setContentBlocks(parsed as unknown as ContentBlock[]);
        }
      } catch {
        setContentBlocks([]);
      }
      
      // Parse features
      if (service.features && Array.isArray(service.features)) {
        setFeaturesInput((service.features as string[]).join("\n"));
      }
      
      // Parse advantages
      try {
        const parsedAdvantages = (service as any).advantages;
        if (Array.isArray(parsedAdvantages)) {
          setAdvantages(parsedAdvantages);
        }
      } catch {
        setAdvantages([]);
      }
      
      // Load new fields
      setIntroText((service as any).intro_text || "");
      setIsFeatured((service as any).is_featured || false);
      setFeaturedText((service as any).featured_text || "");
      setHoverText((service as any).hover_text || "");
    }
  }, [service]);

  // Initialize defaults for new service
  useMemo(() => {
    if (isNew && Object.keys(formData).length === 0) {
      setFormData({
        is_published: true,
        order_position: 0,
      });
    }
  }, [isNew]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: created, error } = await supabase
        .from("services")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return created;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Услуга создана");
      navigate(`/admin/services/${data.id}`);
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
      setIsSaving(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id || isNew) throw new Error("No ID");
      const { error } = await supabase
        .from("services")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Услуга сохранена");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
      setIsSaving(false);
    },
  });

  const handleSave = () => {
    if (!formData.title || !formData.slug) {
      toast.error("Заполните обязательные поля (название и slug)");
      return;
    }

    // Parse features
    const features = featuresInput
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const saveData = {
      ...formData,
      content_blocks: contentBlocks as unknown as Json,
      features: features as unknown as Json,
      advantages: advantages as unknown as Json,
      intro_text: introText,
      is_featured: isFeatured,
      featured_text: featuredText,
      hover_text: hoverText,
    };

    setIsSaving(true);
    if (isNew) {
      createMutation.mutate(saveData);
    } else {
      updateMutation.mutate(saveData);
    }
  };

  // Block management
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
    };
    
    if (type === "colored-block") {
      newBlock.backgroundColor = "#c4a77d";
      newBlock.textColor = "#ffffff";
    }
    if (type === "image-text") {
      newBlock.imagePosition = "left";
    }
    
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(blocks =>
      blocks.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const removeBlock = (id: string) => {
    setContentBlocks(blocks => blocks.filter(b => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = contentBlocks.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= contentBlocks.length) return;
    
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  if (isLoading && !isNew) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/admin/services">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-display">
                {isNew ? "Новая услуга" : formData.title || "Редактирование услуги"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isNew ? "Создание новой услуги" : "Редактирование услуги"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isNew && formData.slug && (
              <Button asChild variant="outline">
                <Link to={`/uslugi/${formData.slug}`} target="_blank">
                  Просмотр
                </Link>
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Сохранить
            </Button>
          </div>
        </div>

        <Tabs defaultValue="main" className="space-y-6">
          <TabsList>
            <TabsTrigger value="main">Основное</TabsTrigger>
            <TabsTrigger value="advantages">Преимущества</TabsTrigger>
            <TabsTrigger value="content">Контент страницы</TabsTrigger>
            <TabsTrigger value="features">Что входит</TabsTrigger>
            <TabsTrigger value="media">Медиа</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Main Tab */}
          <TabsContent value="main" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Slug (URL) *</Label>
                  <Input
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="pokupka-kvartiry"
                  />
                  <p className="text-xs text-muted-foreground">
                    Будет использоваться в URL: /uslugi/{formData.slug || "slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Иконка (название из Lucide)</Label>
                  <Input
                    value={formData.icon || ""}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Building2, Home, Key..."
                  />
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
                  <Label>Опубликована</Label>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Switch
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label>Показывать как промо-карточку</Label>
                </div>

                {isFeatured && (
                  <div className="space-y-2">
                    <Label>Текст для промо-карточки</Label>
                    <Textarea
                      value={featuredText}
                      onChange={(e) => setFeaturedText(e.target.value)}
                      rows={3}
                      placeholder="Сопровождение перепланировки квартиры - одна из популярных услуг компании Art Estate"
                    />
                  </div>
                  )}

                <div className="space-y-2 pt-4 border-t">
                  <Label>Текст при наведении на карточку</Label>
                  <Textarea
                    value={hoverText}
                    onChange={(e) => setHoverText(e.target.value)}
                    rows={3}
                    placeholder="С компанией «Art Estate» вы станете не только владельцем лучшего жилья..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Текст, который появляется при наведении мыши на карточку услуги
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Вступительный текст</Label>
                  <Textarea
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    rows={4}
                    placeholder="Вступительный текст, который будет показан под заголовком на странице услуги..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Краткое описание</Label>
                  <Textarea
                    value={formData.short_description || ""}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    rows={3}
                    placeholder="Короткое описание для карточки услуги..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Полное описание</Label>
                  <RichTextEditor
                    value={formData.description || ""}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="Подробное описание услуги..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advantages Tab */}
          <TabsContent value="advantages" className="space-y-6">
            <AdvantagesEditor 
              advantages={advantages}
              onChange={setAdvantages}
            />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Блоки контента страницы</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(blockTypeLabels).map(([type, { label, icon }]) => (
                    <Button
                      key={type}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(type as BlockType)}
                    >
                      {icon}
                      <span className="ml-1 hidden sm:inline">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {contentBlocks.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      Добавьте блоки контента для страницы услуги
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addBlock("text")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить текстовый блок
                    </Button>
                  </div>
                ) : (
                  contentBlocks.map((block, index) => (
                    <ContentBlockEditor
                      key={block.id}
                      block={block}
                      onUpdate={(updates) => updateBlock(block.id, updates)}
                      onRemove={() => removeBlock(block.id)}
                      onMoveUp={() => moveBlock(block.id, "up")}
                      onMoveDown={() => moveBlock(block.id, "down")}
                      isFirst={index === 0}
                      isLast={index === contentBlocks.length - 1}
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>Что входит в услугу</Label>
                <p className="text-xs text-muted-foreground">
                  Введите каждый пункт с новой строки
                </p>
                <Textarea
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  rows={10}
                  placeholder="Консультация по выбору объекта&#10;Проверка юридической чистоты&#10;Сопровождение сделки&#10;..."
                />
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Главное изображение</Label>
                <p className="text-xs text-muted-foreground">
                  Изображение для шапки страницы услуги
                </p>
                <MediaUploader
                  value={formData.main_image ? [{ url: formData.main_image, type: "image", isMain: true }] : []}
                  onChange={(items) => setFormData({ ...formData, main_image: items[0]?.url || null })}
                  folder="services"
                  maxFiles={1}
                  acceptImages={true}
                  acceptVideos={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>SEO заголовок</Label>
                <Input
                  value={formData.seo_title || ""}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={`${formData.title || "Название"} — Art Estate`}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO описание</Label>
                <Textarea
                  value={formData.seo_description || ""}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Описание для поисковых систем..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
