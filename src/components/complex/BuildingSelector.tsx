import { useState } from "react";
import { useComplexBuildings, useBuildingFloors, useApartmentsByBuilding, ComplexBuilding } from "@/hooks/useComplexBuildings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Layers, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuildingSelectorProps {
  complexId: string;
  planImage: string;
  complexName: string;
}

export function BuildingSelector({ complexId, planImage, complexName }: BuildingSelectorProps) {
  const { data: buildings, isLoading } = useComplexBuildings(complexId);
  const [selectedBuilding, setSelectedBuilding] = useState<ComplexBuilding | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const { data: floors } = useBuildingFloors(selectedBuilding?.id);
  const { data: apartments } = useApartmentsByBuilding(selectedBuilding?.id, selectedFloor || undefined);

  // If no buildings configured, don't render
  if (isLoading || !buildings || buildings.length === 0) {
    return null;
  }

  const handleBuildingClick = (building: ComplexBuilding) => {
    setSelectedBuilding(building);
    setSelectedFloor(null);
  };

  const handleFloorClick = (floor: number) => {
    setSelectedFloor(floor);
  };

  const handleBack = () => {
    if (selectedFloor !== null) {
      setSelectedFloor(null);
    } else if (selectedBuilding) {
      setSelectedBuilding(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  // View: Building Selection
  if (!selectedBuilding) {
    return (
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1] mb-2">
              Выберите корпус
            </h2>
            <p className="text-muted-foreground">
              Наведите на корпус чтобы увидеть информацию
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,300px] gap-8">
            {/* Interactive Map */}
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-[16/10]">
              <img
                src={planImage}
                alt={complexName}
                className="w-full h-full object-cover"
              />
              
              {/* SVG overlay for polygons */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {buildings.map((building) => {
                  if (!building.polygon_points || building.polygon_points.length < 3) return null;
                  
                  const isHovered = hoveredBuilding === building.id;
                  
                  return (
                    <polygon
                      key={building.id}
                      points={building.polygon_points.map(p => `${p.x},${p.y}`).join(" ")}
                      fill={building.color}
                      fillOpacity={isHovered ? 0.6 : 0.35}
                      stroke={building.color}
                      strokeWidth={isHovered ? "0.5" : "0.3"}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredBuilding(building.id)}
                      onMouseLeave={() => setHoveredBuilding(null)}
                      onClick={() => handleBuildingClick(building)}
                    />
                  );
                })}
              </svg>

              {/* Building labels on hover */}
              {buildings.map((building) => {
                if (!building.polygon_points || building.polygon_points.length < 3) return null;
                if (hoveredBuilding !== building.id) return null;
                
                // Calculate center of polygon
                const centerX = building.polygon_points.reduce((sum, p) => sum + p.x, 0) / building.polygon_points.length;
                const centerY = building.polygon_points.reduce((sum, p) => sum + p.y, 0) / building.polygon_points.length;
                
                return (
                  <div
                    key={building.id}
                    className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border"
                    style={{ left: `${centerX}%`, top: `${centerY}%` }}
                  >
                    <p className="font-medium text-sm whitespace-nowrap">{building.name}</p>
                    {building.floors_count && (
                      <p className="text-xs text-muted-foreground">{building.floors_count} этажей</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Building List */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Корпуса
              </p>
              {buildings.map((building) => (
                <button
                  key={building.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                    hoveredBuilding === building.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onMouseEnter={() => setHoveredBuilding(building.id)}
                  onMouseLeave={() => setHoveredBuilding(null)}
                  onClick={() => handleBuildingClick(building)}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: building.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{building.name}</p>
                    {building.floors_count && (
                      <p className="text-sm text-muted-foreground">
                        {building.floors_count} этажей
                      </p>
                    )}
                  </div>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // View: Floor Selection
  if (!selectedFloor && floors && floors.length > 0) {
    return (
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              К выбору корпуса
            </Button>
            <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1] mb-2">
              {selectedBuilding.name}
            </h2>
            <p className="text-muted-foreground">
              Выберите этаж
            </p>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => handleFloorClick(floor)}
                className="aspect-square flex items-center justify-center border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors font-medium"
              >
                {floor}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // View: Apartments on Floor
  if (selectedFloor && apartments) {
    return (
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              К выбору этажа
            </Button>
            <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1] mb-2">
              {selectedBuilding.name}, {selectedFloor} этаж
            </h2>
            <p className="text-muted-foreground">
              {apartments.length} квартир в продаже
            </p>
          </div>

          {apartments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {apartments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {apt.room_type === "studio" ? "Студия" : `${apt.room_type}-комн`}
                      </span>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {apt.status === "available" ? "В продаже" : apt.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Площадь</span>
                      <span>{apt.area} м²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Этаж</span>
                      <span>{apt.floor}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-lg font-semibold text-primary">
                      {formatPrice(apt.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                На этом этаже нет доступных квартир
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Fallback - show simple apartment list if no floors
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          К выбору корпуса
        </Button>
        <h2 className="font-serif font-normal text-[36px] md:text-[48px] leading-[1.1]">
          {selectedBuilding.name}
        </h2>
        <p className="text-muted-foreground mt-2">
          Квартиры в этом корпусе пока не добавлены
        </p>
      </div>
    </section>
  );
}
