import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertyFiltersState } from "@/pages/PropertyCatalog";

interface PropertyFiltersProps {
  filters: PropertyFiltersState;
  onFiltersChange: (filters: PropertyFiltersState) => void;
  districts: string[];
}

const roomOptions = ["СТ", "1", "2", "3", "4", "5+"];

// Mock metro stations - would come from database
const metroStations = [
  "Автово",
  "Балтийская",
  "Будапештская",
  "Владимирская",
  "Выборгская",
  "Горьковская",
  "Гражданский проспект",
];

export function PropertyFilters({
  filters,
  onFiltersChange,
  districts,
}: PropertyFiltersProps) {
  const [activeTab, setActiveTab] = useState<"metro" | "districts">("metro");
  const [isMetroOpen, setIsMetroOpen] = useState(false);

  const handleChange = <K extends keyof PropertyFiltersState>(
    key: K,
    value: PropertyFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleRoomToggle = (room: string) => {
    const newRooms = filters.rooms.includes(room)
      ? filters.rooms.filter((r) => r !== room)
      : [...filters.rooms, room];
    handleChange("rooms", newRooms);
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      district: "all",
      metro: "all",
      areaFrom: "",
      areaTo: "",
      rooms: [],
      priceFrom: "",
      hasBalcony: false,
      hasTerrace: false,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.district !== "all" ||
    filters.metro !== "all" ||
    filters.areaFrom ||
    filters.areaTo ||
    filters.rooms.length > 0 ||
    filters.priceFrom ||
    filters.hasBalcony ||
    filters.hasTerrace;

  return (
    <div className="space-y-6">
      {/* Search by address */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по адресу"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="pl-10 h-12 bg-card border-border"
        />
      </div>

      {/* Metro / Districts Tabs */}
      <div>
        <Collapsible open={isMetroOpen} onOpenChange={setIsMetroOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 bg-card border border-border rounded-lg text-left">
              <span className="text-sm">
                {filters.metro !== "all" ? filters.metro : "М. Автово"}
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isMetroOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-card border border-border rounded-lg p-4">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={activeTab === "metro" ? "default" : "outline"}
                  onClick={() => setActiveTab("metro")}
                  className="flex-1"
                >
                  Метро
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "districts" ? "default" : "outline"}
                  onClick={() => setActiveTab("districts")}
                  className="flex-1"
                >
                  Районы
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mb-3">Начинайте вводить:</p>

              {activeTab === "metro" ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {metroStations.map((station) => (
                    <label
                      key={station}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary"
                    >
                      <Checkbox
                        checked={filters.metro === station}
                        onCheckedChange={() => handleChange("metro", station)}
                      />
                      <span className="text-sm">{station}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {districts.map((district) => (
                    <label
                      key={district}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary"
                    >
                      <Checkbox
                        checked={filters.district === district}
                        onCheckedChange={() => handleChange("district", district)}
                      />
                      <span className="text-sm">{district}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleChange("metro", "all");
                    handleChange("district", "all");
                  }}
                >
                  × Сбросить
                </Button>
                <Button size="sm" onClick={() => setIsMetroOpen(false)}>
                  Применить
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Area Range */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            placeholder="от 20"
            value={filters.areaFrom}
            onChange={(e) => handleChange("areaFrom", e.target.value)}
            className="h-12 bg-card text-center"
            type="number"
          />
        </div>
        <span className="text-muted-foreground">—</span>
        <div className="flex-1">
          <Input
            placeholder="до 240"
            value={filters.areaTo}
            onChange={(e) => handleChange("areaTo", e.target.value)}
            className="h-12 bg-card text-center"
            type="number"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="flex gap-1">
        {roomOptions.map((room) => (
          <button
            key={room}
            onClick={() => handleRoomToggle(room)}
            className={cn(
              "flex-1 h-12 border rounded-md text-sm font-medium transition-colors",
              filters.rooms.includes(room)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary"
            )}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Price From */}
      <div>
        <div className="text-xs text-muted-foreground mb-2">от</div>
        <Input
          placeholder="5 000 000"
          value={filters.priceFrom}
          onChange={(e) => handleChange("priceFrom", e.target.value)}
          className="h-12 bg-card"
          type="number"
        />
      </div>

      {/* Features */}
      <div className="flex gap-2">
        <button
          onClick={() => handleChange("hasBalcony", !filters.hasBalcony)}
          className={cn(
            "flex-1 h-12 border rounded-md text-sm transition-colors",
            filters.hasBalcony
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary"
          )}
        >
          Балкон
        </button>
        <button
          onClick={() => handleChange("hasTerrace", !filters.hasTerrace)}
          className={cn(
            "flex-1 h-12 border rounded-md text-sm transition-colors",
            filters.hasTerrace
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary"
          )}
        >
          Терраса
        </button>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
          Сбросить фильтр
        </button>
      )}
    </div>
  );
}
