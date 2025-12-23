import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2, Check } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface BuildingPolygonEditorProps {
  imageUrl: string;
  initialPoints?: Point[];
  onSave: (points: Point[]) => void;
  onCancel: () => void;
  color?: string;
}

export function BuildingPolygonEditor({
  imageUrl,
  initialPoints = [],
  onSave,
  onCancel,
  color = "#14b8a6"
}: BuildingPolygonEditorProps) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPoints([...points, { x, y }]);
  };

  const handlePointDrag = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPoint = points[index];
    const rect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      const newPoints = [...points];
      newPoints[index] = {
        x: Math.max(0, Math.min(100, startPoint.x + deltaX)),
        y: Math.max(0, Math.min(100, startPoint.y + deltaY))
      };
      setPoints(newPoints);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const removeLastPoint = () => {
    setPoints(points.slice(0, -1));
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const polygonPath = points.length > 2
    ? `M ${points.map(p => `${p.x}% ${p.y}%`).join(" L ")} Z`
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Кликните на изображение чтобы добавить точки полигона. Минимум 3 точки.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeLastPoint}
            disabled={points.length === 0}
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Отменить
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearPoints}
            disabled={points.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Очистить
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative cursor-crosshair border rounded-lg overflow-hidden bg-muted"
        onClick={handleImageClick}
        style={{ aspectRatio: imageSize.width && imageSize.height ? `${imageSize.width}/${imageSize.height}` : "16/9" }}
      >
        <img 
          src={imageUrl} 
          alt="План комплекса" 
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        
        {/* SVG overlay for polygon */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Polygon fill */}
          {points.length > 2 && (
            <polygon
              points={points.map(p => `${p.x},${p.y}`).join(" ")}
              fill={color}
              fillOpacity={0.3}
              stroke={color}
              strokeWidth="0.3"
            />
          )}
          
          {/* Lines between points */}
          {points.length > 1 && (
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="0.3"
              strokeDasharray={points.length < 3 ? "0.5,0.5" : "none"}
            />
          )}
        </svg>

        {/* Draggable points */}
        {points.map((point, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white cursor-move shadow-md"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              backgroundColor: color
            }}
            onMouseDown={(e) => handlePointDrag(index, e)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-black/60 px-1 rounded">
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button 
          onClick={() => onSave(points)}
          disabled={points.length < 3}
        >
          <Check className="h-4 w-4 mr-1" />
          Сохранить полигон
        </Button>
      </div>
    </div>
  );
}
