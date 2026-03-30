import { useCallback, useState } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  accept?: string;
  placeholder?: string;
}

export function FileUploader({
  value,
  onChange,
  bucket = "complex-documents",
  folder = "",
  accept = ".pdf,.doc,.docx",
  placeholder = "Загрузить файл",
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      setIsUploading(true);
      try {
        const fileName = `${folder ? folder + "/" : ""}${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
          contentType: file.type || "application/octet-stream",
        });

        if (uploadError) {
          toast.error("Ошибка загрузки: " + uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        onChange(urlData.publicUrl);
        toast.success("Файл загружен");
      } catch (e) {
        console.error(e);
        toast.error("Ошибка загрузки");
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, folder, onChange],
  );

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 border rounded-lg p-3">
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
        >
          <FileText className="h-4 w-4 shrink-0" />
          {value}
        </a>
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")} className="shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <label className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer hover:border-primary/60 transition">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      {isUploading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Загрузка…</span>
        </>
      ) : (
        <>
          <Upload className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        </>
      )}
    </label>
  );
}

