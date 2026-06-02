import { useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplexPreviewPanelProps {
  slug: string;
  draftVersion: number;
}

export function ComplexPreviewPanel({ slug, draftVersion }: ComplexPreviewPanelProps) {
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setIframeKey((k) => k + 1);
  }, [draftVersion]);

  const previewSrc = `/novostroyki/${slug}?preview=1&draft=1&embed=1&v=${iframeKey}`;

  return (
    <div className="sticky top-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Eye className="h-4 w-4 text-primary" />
          Предпросмотр страницы
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => setIframeKey((k) => k + 1)}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Обновить
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Обновляется автоматически при редактировании. Жёлтая полоса сверху — режим черновика.
      </p>
      <div className="border rounded-lg overflow-hidden bg-muted/30 shadow-sm">
        <iframe
          key={iframeKey}
          title="Предпросмотр страницы ЖК"
          src={previewSrc}
          className="w-full bg-white"
          style={{ height: "min(70vh, 720px)" }}
        />
      </div>
    </div>
  );
}
