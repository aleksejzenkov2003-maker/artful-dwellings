import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SingleImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  placeholder?: string;
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

export function SingleImageUploader({
  value,
  onChange,
  bucket = "complex-media",
  folder = "",
  placeholder = "Загрузить изображение",
}: SingleImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Можно загружать только изображения");
      return;
    }

    setIsUploading(true);

    try {
      let uploadBlob: Blob = file;
      let fileName = `${folder ? folder + "/" : ""}${Date.now()}_${file.name}`;

      // Compress image
      try {
        uploadBlob = await compressImage(file);
        fileName = fileName.replace(/\.[^.]+$/, ".webp");
      } catch (e) {
        console.warn("Image compression failed, using original:", e);
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, uploadBlob, {
          contentType: "image/webp",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Ошибка загрузки");
        return;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(urlData.publicUrl);
      toast.success("Изображение загружено");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Ошибка загрузки");
    } finally {
      setIsUploading(false);
    }
  }, [onChange, bucket, folder]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemove = () => {
    onChange("");
  };

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border group">
        <img
          src={value}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={handleRemove}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
        isUploading ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        </label>
      )}
    </div>
  );
}
