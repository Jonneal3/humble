"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DesignSettings } from "@/types/design";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Eye } from "lucide-react";

interface ImageGalleryProps {
  images: Array<{ image: string | null }>;
  isLoading: boolean;
  config: DesignSettings;
  fullPage?: boolean;
  deployment?: boolean;
  layoutContext?: 'vertical' | 'horizontal';
  containerWidth?: number;
}

export function ImageGallery({
  images,
  isLoading,
  config,
  fullPage = false,
  deployment = false,
  layoutContext = "vertical",
  containerWidth = 1024
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get configuration values with defaults
  const galleryConfig = {
    columns: config.gallery_columns || 3,
    spacing: config.gallery_spacing ?? 0, // Allow zero spacing
    maxImages: config.gallery_max_images || 12,
    backgroundColor: config.gallery_background_color || 'transparent',
    containerBorderEnabled: config.gallery_container_border_enabled ?? false,
    containerBorderWidth: config.gallery_container_border_width ?? 1,
    containerBorderColor: config.gallery_container_border_color || '#e5e7eb',
    containerBorderStyle: config.gallery_container_border_style || 'solid',
    containerBorderRadius: config.gallery_container_border_radius ?? 12,
    imageBorderEnabled: config.gallery_image_border_enabled ?? false,
    imageBorderWidth: config.gallery_image_border_width ?? 1,
    imageBorderColor: config.gallery_image_border_color || '#e5e7eb',
    imageBorderStyle: config.gallery_image_border_style || 'solid',
    imageBorderRadius: config.gallery_image_border_radius ?? 8,
    overlayEnabled: deployment && (config.overlay_enabled ?? true),
    overlayBackgroundColor: config.overlay_background_color || 'rgba(0, 0, 0, 0.5)',
    overlayIconColor: config.overlay_icon_color || '#ffffff',
  };

  // Create array of slots based on max images
  const imageSlots = Array.from({ length: galleryConfig.maxImages }, (_, index) => {
    const imageData = images[index]?.image;
    return {
      id: index,
      image: imageData,
      hasImage: !!imageData,
    };
  });

  // Container styles
  const galleryContainerStyles = {
    backgroundColor: galleryConfig.backgroundColor,
    // Only use border radius if container border is enabled
    ...(galleryConfig.containerBorderEnabled && {
      borderRadius: `${galleryConfig.containerBorderRadius}px`,
      border: `${galleryConfig.containerBorderWidth}px ${galleryConfig.containerBorderStyle} ${galleryConfig.containerBorderColor}`
    }),
    padding: `${galleryConfig.spacing}px`,
    gap: `${galleryConfig.spacing}px`,
  };

  // Individual image styles
  const imageStyles = {
    borderRadius: `${galleryConfig.imageBorderRadius}px`,
    border: galleryConfig.imageBorderEnabled ? `${galleryConfig.imageBorderWidth}px ${galleryConfig.imageBorderStyle} ${galleryConfig.imageBorderColor}` : 'none',
    overflow: 'hidden',
  };

  return (
    <div 
      data-tour="gallery-area"
      className="grid auto-rows-fr"
      style={{
        ...galleryContainerStyles,
        gridTemplateColumns: `repeat(${galleryConfig.columns}, 1fr)`
      }}
    >
      {isLoading ? (
        // Loading placeholders
        Array.from({ length: galleryConfig.columns }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="aspect-square relative"
            style={imageStyles}
          >
            <Skeleton className="absolute inset-0" />
          </div>
        ))
      ) : imageSlots.length > 0 ? (
        // Actual images
        imageSlots.map((slot) => (
          <div
            key={slot.id}
            className="relative aspect-square bg-gray-50 group"
            style={imageStyles}
          >
            {slot.hasImage ? (
              <>
                <Image
                  src={slot.image!}
                  alt={`Generated image ${slot.id + 1}`}
                  fill
                  className="object-cover"
                />
                {galleryConfig.overlayEnabled && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3"
                    style={{ backgroundColor: galleryConfig.overlayBackgroundColor }}
                  >
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add download logic here
                      }}
                    >
                      <Download 
                        className="w-4 h-4 transition-colors" 
                        style={{ color: galleryConfig.overlayIconColor }}
                      />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      onClick={() => setSelectedImage(slot.image)}
                    >
                      <Eye 
                        className="w-4 h-4 transition-colors" 
                        style={{ color: galleryConfig.overlayIconColor }}
                      />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p className="text-sm">Image {slot.id + 1}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        // Empty state
        <div
          className="col-span-full aspect-[2/1] flex items-center justify-center bg-gray-50 text-gray-400"
          style={imageStyles}
        >
          <p className="text-sm">Generated images will appear here</p>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Generated image full view"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 