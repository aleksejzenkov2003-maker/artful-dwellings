import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { ResidentialComplex } from "@/hooks/useResidentialComplexes";
import { cn } from "@/lib/utils";
import { PropertyPreviewModal } from "./PropertyPreviewModal";

interface PropertyCardProps {
  property: ResidentialComplex;
  variant?: "image-top" | "image-bottom";
  enablePreview?: boolean;
}

export function PropertyCard({ property, variant = "image-top", enablePreview = true }: PropertyCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (enablePreview) {
      e.preventDefault();
      setPreviewOpen(true);
    }
  };

  const imageBlock = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
      <img
        src={property.main_image || "/placeholder.svg"}
        alt={property.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );

  const captionBlock = (
    <div className="py-6">
      {/* District and metro info */}
      <div className="flex flex-wrap items-center gap-x-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
        {property.district && (
          <span>РАЙОН {property.district.toUpperCase()}</span>
        )}
        {property.address && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
            {property.address.split(",")[0]} — 10 минут пешком
          </span>
        )}
      </div>
      
      {/* Complex name - Large serif */}
      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-2 group-hover:text-primary transition-colors leading-tight">
        {property.name}
      </h3>
      
      {/* Address */}
      {property.address && (
        <p className="text-muted-foreground text-sm">
          {property.address}
        </p>
      )}
    </div>
  );

  return (
    <>
      <div
        onClick={handleClick}
        className="group block cursor-pointer"
      >
        {variant === "image-top" ? (
          <>
            {imageBlock}
            {captionBlock}
          </>
        ) : (
          <>
            {captionBlock}
            {imageBlock}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {enablePreview && (
        <PropertyPreviewModal
          property={property}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      )}
    </>
  );
}
