import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Video, Star, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface MediaItem {
  url: string;
  type: "image" | "video";
  isMain?: boolean;
}

interface MediaUploaderProps {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  bucket?: string;
  folder?: string;
  maxFiles?: number;
  acceptImages?: boolean;
  acceptVideos?: boolean;
}

// Compress image on client side
async function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/webp",
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function MediaUploader({
  value = [],
  onChange,
  bucket = "complex-media",
  folder = "",
  maxFiles = 20,
  acceptImages = true,
  acceptVideos = true,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    if (value.length + files.length > maxFiles) {
      toast.error(`Максимум ${maxFiles} файлов`);
      return;
    }

    setIsUploading(true);
    const newItems: MediaItem[] = [];

    try {
      for (const file of Array.from(files)) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isImage && !acceptImages) continue;
        if (isVideo && !acceptVideos) continue;
        if (!isImage && !isVideo) continue;

        let uploadBlob: Blob = file;
        let fileName = `${folder ? folder + "/" : ""}${Date.now()}_${file.name}`;

        // Compress images
        if (isImage) {
          try {
            uploadBlob = await compressImage(file);
            fileName = fileName.replace(/\.[^.]+$/, ".webp");
          } catch (e) {
            console.warn("Image compression failed, using original:", e);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, uploadBlob, {
            contentType: isImage ? "image/webp" : file.type,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(`Ошибка загрузки ${file.name}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        newItems.push({
          url: urlData.publicUrl,
          type: isImage ? "image" : "video",
          isMain: value.length === 0 && newItems.length === 0,
        });
      }

      onChange([...value, ...newItems]);
      if (newItems.length > 0) {
        toast.success(`Загружено ${newItems.length} файлов`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Ошибка загрузки файлов");
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, bucket, folder, maxFiles, acceptImages, acceptVideos]);

  const handleAddVideoUrl = () => {
    if (!videoUrl.trim()) return;
    
    // Check if it's a YouTube or Rutube URL
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isRutube = videoUrl.includes("rutube.ru");
    
    if (!isYoutube && !isRutube && !videoUrl.startsWith("http")) {
      toast.error("Введите корректную ссылку на видео");
      return;
    }

    onChange([...value, { url: videoUrl.trim(), type: "video" }]);
    setVideoUrl("");
    setShowVideoInput(false);
    toast.success("Видео добавлено");
  };

  const handleSetMain = (index: number) => {
    const updated = value.map((item, i) => ({
      ...item,
      isMain: i === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const removed = value[index];
    const updated = value.filter((_, i) => i !== index);
    
    // If removed was main and there are still items, make first one main
    if (removed.isMain && updated.length > 0) {
      updated[0].isMain = true;
    }
    
    onChange(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

  const images = value.filter(item => item.type === "image");
  const videos = value.filter(item => item.type === "video");

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isUploading ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Загрузка и оптимизация...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {acceptImages && <ImageIcon className="h-8 w-8 text-muted-foreground" />}
              {acceptVideos && <Video className="h-8 w-8 text-muted-foreground" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Перетащите файлы сюда или
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept={[
                    ...(acceptImages ? ["image/*"] : []),
                    ...(acceptVideos ? ["video/*"] : []),
                  ].join(",")}
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Выбрать файлы
                  </span>
                </Button>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Изображения автоматически оптимизируются в WebP
            </p>
          </div>
        )}
      </div>

      {/* Video URL Input */}
      {acceptVideos && (
        <div className="space-y-2">
          {showVideoInput ? (
            <div className="flex gap-2">
              <Input
                placeholder="Ссылка на YouTube или Rutube видео"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddVideoUrl}>Добавить</Button>
              <Button type="button" variant="ghost" onClick={() => setShowVideoInput(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowVideoInput(true)}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Добавить видео по ссылке
            </Button>
          )}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Изображения ({images.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((item, index) => {
              const globalIndex = value.indexOf(item);
              return (
                <div
                  key={item.url}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 group",
                    item.isMain ? "border-primary ring-2 ring-primary/30" : "border-border"
                  )}
                >
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => handleSetMain(globalIndex)}
                      title="Сделать главной"
                    >
                      <Star className={cn("h-4 w-4", item.isMain && "fill-yellow-400 text-yellow-400")} />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => handleRemove(globalIndex)}
                      title="Удалить"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.isMain && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                      Главная
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Videos List */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Видео ({videos.length})</p>
          <div className="space-y-2">
            {videos.map((item) => {
              const globalIndex = value.indexOf(item);
              const isExternal = item.url.includes("youtube") || item.url.includes("youtu.be") || item.url.includes("rutube");
              return (
                <div
                  key={item.url}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Video className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate flex-1">{item.url}</span>
                  {isExternal && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {item.url.includes("youtube") || item.url.includes("youtu.be") ? "YouTube" : "Rutube"}
                    </span>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleRemove(globalIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
