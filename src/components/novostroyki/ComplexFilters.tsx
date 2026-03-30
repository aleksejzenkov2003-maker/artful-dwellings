import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export interface FiltersState {
  district: string;
  status: string;
  priceFrom: string;
  priceTo: string;
}

interface ComplexFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  districts: string[];
  hideStatusFilter?: boolean;
}

const statusOptions = [
  { value: "all", label: "Все статусы" },
  { value: "building", label: "Строится" },
  { value: "completed", label: "Сдан" },
  { value: "soon", label: "Скоро старт" },
];

export function ComplexFilters({
  filters,
  onFiltersChange,
  districts,
  hideStatusFilter = false,
}: ComplexFiltersProps) {
  const handleChange = (key: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({
      district: "all",
      status: hideStatusFilter ? filters.status : "all",
      priceFrom: "",
      priceTo: "",
    });
  };

  const hasActiveFilters =
    filters.district !== "all" ||
    (!hideStatusFilter && filters.status !== "all") ||
    filters.priceFrom !== "" ||
    filters.priceTo !== "";

  return (
    <div className="bg-muted/30 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-xl">Фильтры</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
        )}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${hideStatusFilter ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
        <div className="space-y-3">
          <Label htmlFor="district" className="text-base">Район</Label>
          <Select
            value={filters.district}
            onValueChange={(v) => handleChange("district", v)}
          >
            <SelectTrigger id="district" className="h-12">
              <SelectValue placeholder="Все районы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все районы</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!hideStatusFilter && (
          <div className="space-y-3">
            <Label htmlFor="status" className="text-base">Статус</Label>
            <Select
              value={filters.status}
              onValueChange={(v) => handleChange("status", v)}
            >
              <SelectTrigger id="status" className="h-12">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="priceFrom" className="text-base">Цена от, ₽</Label>
          <Input
            id="priceFrom"
            type="number"
            placeholder="1 000 000"
            value={filters.priceFrom}
            onChange={(e) => handleChange("priceFrom", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="priceTo" className="text-base">Цена до, ₽</Label>
          <Input
            id="priceTo"
            type="number"
            placeholder="50 000 000"
            value={filters.priceTo}
            onChange={(e) => handleChange("priceTo", e.target.value)}
            className="h-12"
          />
        </div>
      </div>
    </div>
  );
}