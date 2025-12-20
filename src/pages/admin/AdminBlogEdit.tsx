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
  GripVertical,
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
import { cn } from "@/lib/utils";

type BlogPost = Tables<"blog_posts">;

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

const categories = [
  { value: "news", label: "Новости" },
  { value: "analytics", label: "Аналитика" },
  { value: "guides", label: "Гайды" },
  { value: "trends", label: "Тренды" },
  { value: "interior", label: "Интерьер" },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<TablesUpdate<"blog_posts">>>({});
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  // Fetch post data
  const { data: post, isLoading } = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: async () => {
      if (isNew || !id) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && !!id,
  });

  // Initialize form when post loads
  useMemo(() => {
    if (post && Object.keys(formData).length === 0) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author_name: post.author_name,
        cover_image: post.cover_image,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        is_published: post.is_published,
        tags: post.tags,
      });
      
      // Parse content blocks from content JSON
      try {
        const parsed = post.content ? JSON.parse(post.content) : [];
        if (Array.isArray(parsed)) {
          setContentBlocks(parsed);
        }
      } catch {
        // If not JSON, create a text block with the content
        if (post.content) {
          setContentBlocks([{ id: generateId(), type: "text", content: post.content }]);
        }
      }
      
      // Parse tags
      if (post.tags && Array.isArray(post.tags)) {
        setTagsInput((post.tags as string[]).join(", "));
      }
    }
  }, [post]);

  // Initialize defaults for new post
  useMemo(() => {
    if (isNew && Object.keys(formData).length === 0) {
      setFormData({
        is_published: false,
        category: "news",
      });
    }
  }, [isNew]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: TablesUpdate<"blog_posts">) => {
      const { data: created, error } = await supabase
        .from("blog_posts")
        .insert(data as any)
        .select()
        .single();
      if (error) throw error;
      return created;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Статья создана");
      navigate(`/admin/blog/${data.id}`);
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
      setIsSaving(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: TablesUpdate<"blog_posts">) => {
      if (!id || isNew) throw new Error("No ID");
      const { error } = await supabase
        .from("blog_posts")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-post", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Статья сохранена");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Ошибка: " + error.message);
      setIsSaving(false);
    },
  });

  const handleSave = () => {
    if (!formData.title || !formData.slug) {
      toast.error("Заполните обязательные поля");
      return;
    }

    // Parse tags
    const tags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const saveData = {
      ...formData,
      content: JSON.stringify(contentBlocks),
      tags: tags as unknown as Json,
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

  // Author media items
  const authorMedia = useMemo((): MediaItem[] => {
    // We'll store author photo in a custom field, for now use cover as example
    return [];
  }, []);

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
              <Link to="/admin/blog">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-display">
                {isNew ? "Новая статья" : formData.title || "Редактирование статьи"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isNew ? "Создание новой статьи" : "Редактирование статьи"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isNew && (
              <Button asChild variant="outline">
                <Link to={`/blog/${formData.slug || post?.slug}`} target="_blank">
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

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="author">Автор</TabsTrigger>
            <TabsTrigger value="media">Медиа</TabsTrigger>
            <TabsTrigger value="seo">SEO и теги</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main settings */}
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок *</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-статьи"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select
                    value={formData.category || "news"}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Краткое описание</Label>
                  <RichTextEditor
                    value={formData.excerpt || ""}
                    onChange={(value) => setFormData({ ...formData, excerpt: value })}
                    placeholder="Лид статьи..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Switch
                    checked={formData.is_published ?? false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label>Опубликована</Label>
                </div>
              </div>

              {/* Content blocks */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Блоки контента</Label>
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
                      <p className="text-muted-foreground mb-4">Добавьте блоки контента</p>
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
            </div>
          </TabsContent>

          {/* Author Tab */}
          <TabsContent value="author" className="space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>Имя автора</Label>
                <Input
                  value={formData.author_name || ""}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="Вероника Смирнова"
                />
              </div>

              <div className="space-y-2">
                <Label>Фото автора</Label>
                <p className="text-xs text-muted-foreground">
                  Загрузите фото автора статьи (будет отображаться рядом со статьёй)
                </p>
                <MediaUploader
                  value={authorMedia}
                  onChange={() => {}}
                  folder="authors"
                  maxFiles={1}
                  acceptImages={true}
                  acceptVideos={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Обложка статьи</Label>
                <p className="text-xs text-muted-foreground">
                  Главное изображение, которое будет отображаться в шапке статьи
                </p>
                {formData.cover_image && (
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden mb-2">
                    <img
                      src={formData.cover_image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, cover_image: null })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <MediaUploader
                  value={formData.cover_image ? [{ url: formData.cover_image, type: "image", isMain: true }] : []}
                  onChange={(items) => {
                    const mainImage = items.find(i => i.type === "image");
                    setFormData({ ...formData, cover_image: mainImage?.url || null });
                  }}
                  folder="blog"
                  maxFiles={1}
                  acceptImages={true}
                  acceptVideos={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="max-w-2xl space-y-4">
              <div className="space-y-2">
                <Label>SEO Заголовок</Label>
                <Input
                  value={formData.seo_title || ""}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder={formData.title || "Заголовок для поисковых систем"}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.seo_title || formData.title || "").length}/60 символов
                </p>
              </div>

              <div className="space-y-2">
                <Label>SEO Описание</Label>
                <Input
                  value={formData.seo_description || ""}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Описание для поисковых систем"
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.seo_description || "").length}/160 символов
                </p>
              </div>

              <div className="space-y-2">
                <Label>Теги</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="интерьер, дизайн, осень (через запятую)"
                />
                <p className="text-xs text-muted-foreground">
                  Введите теги через запятую
                </p>
                {tagsInput && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagsInput.split(",").map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-secondary text-sm rounded">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Content Block Editor Component
interface ContentBlockEditorProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function ContentBlockEditor({
  block,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ContentBlockEditorProps) {
  const { label, icon } = blockTypeLabels[block.type];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Block header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
        <div className="flex items-center gap-2 flex-1">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Block content */}
      <div className="p-4">
        {block.type === "text" && (
          <RichTextEditor
            value={block.content || ""}
            onChange={(value) => onUpdate({ content: value })}
            placeholder="Введите текст..."
          />
        )}

        {block.type === "heading" && (
          <div className="space-y-3">
            <Input
              value={block.heading || ""}
              onChange={(e) => onUpdate({ heading: e.target.value })}
              placeholder="Заголовок раздела"
              className="text-xl font-serif"
            />
            <Select
              value={block.alignment || "left"}
              onValueChange={(value) => onUpdate({ alignment: value as "left" | "center" | "right" })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Выравнивание" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">По левому краю</SelectItem>
                <SelectItem value="center">По центру</SelectItem>
                <SelectItem value="right">По правому краю</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {block.type === "image" && (
          <div className="space-y-3">
            <MediaUploader
              value={block.imageUrl ? [{ url: block.imageUrl, type: "image" }] : []}
              onChange={(items) => onUpdate({ imageUrl: items[0]?.url })}
              folder="blog"
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
            <div
              className="border-l-4 border-primary bg-primary/5 p-4"
            >
              <RichTextEditor
                value={block.content || ""}
                onChange={(value) => onUpdate({ content: value })}
                placeholder="Текст цитаты..."
              />
            </div>
            <Input
              value={block.quoteAuthor || ""}
              onChange={(e) => onUpdate({ quoteAuthor: e.target.value })}
              placeholder="Автор цитаты"
            />
          </div>
        )}

        {block.type === "colored-block" && (
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Цвет фона</Label>
                <input
                  type="color"
                  value={block.backgroundColor || "#c4a77d"}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Цвет текста</Label>
                <input
                  type="color"
                  value={block.textColor || "#ffffff"}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: block.backgroundColor || "#c4a77d",
                color: block.textColor || "#ffffff",
              }}
            >
              <RichTextEditor
                value={block.content || ""}
                onChange={(value) => onUpdate({ content: value })}
                placeholder="Текст в цветном блоке..."
                className="bg-transparent border-white/20"
              />
            </div>
          </div>
        )}

        {block.type === "two-columns" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Левая колонка</Label>
              <RichTextEditor
                value={block.leftContent || ""}
                onChange={(value) => onUpdate({ leftContent: value })}
                placeholder="Левая колонка..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Правая колонка</Label>
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
            <Select
              value={block.imagePosition || "left"}
              onValueChange={(value) => onUpdate({ imagePosition: value as "left" | "right" })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Позиция изображения" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Изображение слева</SelectItem>
                <SelectItem value="right">Изображение справа</SelectItem>
              </SelectContent>
            </Select>
            <div className={cn(
              "grid gap-4",
              block.imagePosition === "right" ? "grid-cols-[1fr_200px]" : "grid-cols-[200px_1fr]"
            )}>
              {block.imagePosition !== "right" && (
                <div className="space-y-2">
                  <MediaUploader
                    value={block.imageUrl ? [{ url: block.imageUrl, type: "image" }] : []}
                    onChange={(items) => onUpdate({ imageUrl: items[0]?.url })}
                    folder="blog"
                    maxFiles={1}
                    acceptImages={true}
                    acceptVideos={false}
                  />
                  <Input
                    value={block.imageCaption || ""}
                    onChange={(e) => onUpdate({ imageCaption: e.target.value })}
                    placeholder="Подпись"
                    className="text-xs"
                  />
                </div>
              )}
              <RichTextEditor
                value={block.content || ""}
                onChange={(value) => onUpdate({ content: value })}
                placeholder="Текст рядом с изображением..."
              />
              {block.imagePosition === "right" && (
                <div className="space-y-2">
                  <MediaUploader
                    value={block.imageUrl ? [{ url: block.imageUrl, type: "image" }] : []}
                    onChange={(items) => onUpdate({ imageUrl: items[0]?.url })}
                    folder="blog"
                    maxFiles={1}
                    acceptImages={true}
                    acceptVideos={false}
                  />
                  <Input
                    value={block.imageCaption || ""}
                    onChange={(e) => onUpdate({ imageCaption: e.target.value })}
                    placeholder="Подпись"
                    className="text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
