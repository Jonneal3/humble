"use client";

import { ImagePreview } from "../ImagePreview";
import { DesignSettings } from "@/types/design";

interface ImageGalleryProps {
  images: Array<{ image: string | null }>;
  isLoading: boolean;
  config: DesignSettings;
  fullPage?: boolean;
  deployment?: boolean;
  className?: string;
}

export function ImageGallery({ 
  images, 
  isLoading, 
  config, 
  fullPage = false, 
  deployment = false,
  className = "" 
}: ImageGalleryProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <div className={`w-full h-full ${fullPage && deployment ? '' : 'rounded-xl 2xl:rounded-2xl'}`}>
        <ImagePreview
          images={images}
          isLoading={isLoading}
          config={config}
          customStyles={{
            backgroundColor: config.gallery_background_color || 'transparent',
            borderRadius: fullPage && deployment ? '0px' : `${config.gallery_border_radius || 12}px`,
            fontFamily: config.gallery_font_family || 'inherit',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
} 