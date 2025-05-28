"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  images: Array<{ image: string | null }>;
  isLoading: boolean;
  customStyles?: React.CSSProperties;
}

export function ImagePreview({
  images,
  isLoading,
  customStyles,
}: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      const firstImage = images[0]?.image;
      if (firstImage) {
        setSelectedImage(firstImage);
      }
    }
  }, [images]);

  return (
    <div className="w-full h-full flex flex-col gap-4" style={customStyles}>
      {/* Main Image Display */}
      <div className="flex-1 relative rounded-lg overflow-hidden bg-muted">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Generated"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {isLoading && "Generating..."}
          </div>
        )}
      </div>
    </div>
  );
} 