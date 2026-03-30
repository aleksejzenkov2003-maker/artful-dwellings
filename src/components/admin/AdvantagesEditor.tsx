import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, ImageIcon } from "lucide-react";
import { SingleImageUploader } from "./SingleImageUploader";

interface Advantage {
  id: string;
  number: string;
  title: string;
  description: string;
  image_url?: string;
  background_type: "white" | "terracotta" | "image";
  size?: "small" | "medium" | "large";
}

interface AdvantagesEditorProps {
  advantages: Advantage[];
  onChange: (advantages: Advantage[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export function AdvantagesEditor({ advantages, onChange }: AdvantagesEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addAdvantage = () => {
    const newNumber = String(advantages.length + 1).padStart(2, "0");
    const newAdvantage: Advantage = {
      id: generateId(),
      number: newNumber,
      title: "",
      description: "",
      background_type: "white",
      size: "medium",
    };
    onChange([...advantages, newAdvantage]);
  };

  const updateAdvantage = (index: number, field: keyof Advantage, value: string) => {
    const updated = [...advantages];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeAdvantage = (index: number) => {
    const updated = advantages.filter((_, i) => i !== index);
    // Renumber remaining advantages
    const renumbered = updated.map((adv, i) => ({
      ...adv,
      number: String(i + 1).padStart(2, "0"),
    }));
    onChange(renumbered);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updated = [...advantages];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, removed);
    
    // Renumber
    const renumbered = updated.map((adv, i) => ({
      ...adv,
      number: String(i + 1).padStart(2, "0"),
    }));
    
    onChange(renumbered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Преимущества услуги</h3>
        <Button onClick={addAdvantage} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      {advantages.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">Преимущества пока не добавлены</p>
          <Button onClick={addAdvantage} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Добавить первое преимущество
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {advantages.map((advantage, index) => (
            <div
              key={advantage.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`border rounded-lg p-4 bg-background ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="cursor-grab pt-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Number and basic info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Номер</Label>
                      <Input
                        value={advantage.number}
                        onChange={(e) => updateAdvantage(index, "number", e.target.value)}
                        placeholder="01"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label>Заголовок</Label>
                      <Input
                        value={advantage.title}
                        onChange={(e) => updateAdvantage(index, "title", e.target.value)}
                        placeholder="ЗАГОЛОВОК ПРЕИМУЩЕСТВА"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label>Описание</Label>
                    <Textarea
                      value={advantage.description}
                      onChange={(e) => updateAdvantage(index, "description", e.target.value)}
                      placeholder="Описание преимущества..."
                      rows={2}
                    />
                  </div>

                  {/* Type and Size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Тип блока</Label>
                      <Select
                        value={advantage.background_type}
                        onValueChange={(value) => updateAdvantage(index, "background_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="white">Белый фон</SelectItem>
                          <SelectItem value="terracotta">Терракотовый фон</SelectItem>
                          <SelectItem value="image">Изображение</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Размер</Label>
                      <Select
                        value={advantage.size || "medium"}
                        onValueChange={(value) => updateAdvantage(index, "size", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Маленький</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="large">Большой (2 колонки)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Image uploader for image type */}
                  {advantage.background_type === "image" && (
                    <div>
                      <Label>Изображение</Label>
                      <SingleImageUploader
                        value={advantage.image_url || ""}
                        onChange={(url) => updateAdvantage(index, "image_url", url)}
                        bucket="complex-media"
                        folder="services"
                      />
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAdvantage(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
