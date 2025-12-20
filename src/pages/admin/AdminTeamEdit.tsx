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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MoveDown
} from "lucide-react";
import type { Tables, TablesUpdate, Json } from "@/integrations/supabase/types";
import { MediaUploader, type MediaItem } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type TeamMember = Tables<"team_members">;

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
            folder="team"
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
            folder="team"
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

export default function AdminTeamEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<TablesUpdate<"team_members">>>({});
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [specializationInput, setSpecializationInput] = useState("");

  // Fetch cities
  const { data: cities } = useQuery({
    queryKey: ["cities-all"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*").order("order_position");
      return data || [];
    },
  });

  // Fetch team member data
  const { data: member, isLoading } = useQuery({
    queryKey: ["admin-team-member", id],
    queryFn: async () => {
      if (isNew || !id) return null;
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!id,
  });

  // Initialize form when member loads
  useMemo(() => {
    if (member && Object.keys(formData).length === 0) {
      setFormData({
        name: member.name,
        slug: member.slug,
        role: member.role,
        bio: member.bio,
        photo_url: member.photo_url,
        video_url: member.video_url,
        city_id: member.city_id,
        order_position: member.order_position,
        is_published: member.is_published,
        phone: member.phone,
        email: member.email,
        telegram: member.telegram,
        whatsapp: member.whatsapp,
        experience_years: member.experience_years,
        seo_title: member.seo_title,
        seo_description: member.seo_description,
      });
      
      // Parse content blocks
      try {
        const parsed = member.content_blocks;
        if (Array.isArray(parsed)) {
          setContentBlocks(parsed as unknown as ContentBlock[]);
        }
      } catch {
        setContentBlocks([]);
      }
      
      // Parse specialization
      if (member.specialization && Array.isArray(member.specialization)) {
        setSpecializationInput(member.specialization.join(", "));
      }
    }
  }, [member]);

  // Initialize defaults for new member
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
        .from("team_members")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return created;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast.success("Сотрудник создан");
      navigate(`/admin/team/${data.id}`);
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
        .from("team_members")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-member", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      toast.success("Сотрудник сохранён");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
      setIsSaving(false);
    },
  });

  const handleSave = () => {
    if (!formData.name || !formData.role) {
      toast.error("Заполните обязательные поля (имя и должность)");
      return;
    }

    // Parse specialization
    const specialization = specializationInput
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const saveData = {
      ...formData,
      content_blocks: contentBlocks as unknown as Json,
      specialization: specialization,
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
              <Link to="/admin/team">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-display">
                {isNew ? "Новый сотрудник" : formData.name || "Редактирование"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isNew ? "Создание нового сотрудника" : "Редактирование профиля"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isNew && formData.slug && (
              <Button asChild variant="outline">
                <Link to={`/broker/${formData.slug}`} target="_blank">
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
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="content">Контент страницы</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Main Tab */}
          <TabsContent value="main" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя *</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Slug (URL) *</Label>
                  <Input
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ivan-petrov"
                  />
                  <p className="text-xs text-muted-foreground">
                    Будет использоваться в URL: /broker/{formData.slug || "slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Должность *</Label>
                  <Input
                    value={formData.role || ""}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                  <Label>Опыт работы (лет)</Label>
                  <Input
                    type="number"
                    value={formData.experience_years || ""}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Специализация</Label>
                  <Input
                    value={specializationInput}
                    onChange={(e) => setSpecializationInput(e.target.value)}
                    placeholder="Новостройки, Ипотека, Инвестиции (через запятую)"
                  />
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
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Фото</Label>
                  <MediaUploader
                    value={formData.photo_url ? [{ url: formData.photo_url, type: "image", isMain: true }] : []}
                    onChange={(items) => setFormData({ ...formData, photo_url: items[0]?.url || null })}
                    folder="team"
                    maxFiles={1}
                    acceptImages={true}
                    acceptVideos={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Видео</Label>
                  <Input
                    value={formData.video_url || ""}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="URL видео"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="broker@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Telegram</Label>
                <Input
                  value={formData.telegram || ""}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="@username или ссылка"
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={formData.whatsapp || ""}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+79991234567"
                />
              </div>
            </div>
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
                      Добавьте блоки контента для персональной страницы
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

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>SEO заголовок</Label>
                <Input
                  value={formData.seo_title || ""}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={`${formData.name || "Имя"} — брокер Art Estate`}
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
