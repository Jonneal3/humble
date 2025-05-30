"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Eye, RotateCcw } from "lucide-react";
import { DesignSettings } from "@/types/design";

interface ImagePreviewProps {
  images: Array<{ image: string | null }>;
  isLoading: boolean;
  customStyles?: React.CSSProperties;
  config?: DesignSettings;
}

export function ImagePreview({
  images,
  isLoading,
  customStyles,
  config,
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

  // Get configuration values with defaults
  const galleryConfig = {
    columns: config?.gallery_columns || 2,
    spacing: config?.gallery_spacing ?? 16,
    maxImages: config?.gallery_max_images || 4,
    backgroundColor: config?.gallery_background_color || 'transparent',
    borderEnabled: config?.gallery_border_enabled ?? false,
    borderWidth: config?.gallery_border_width ?? 0,
    borderColor: config?.gallery_border_color || '#e5e7eb',
    containerBorderRadius: config?.gallery_border_radius ?? 12,
    imageBorderRadius: config?.gallery_image_border_radius ?? 8,
    shadowStyle: config?.gallery_shadow_style || 'medium',
    overlayEnabled: config?.overlay_enabled ?? true,
    scrollingEnabled: config?.gallery_scrolling_enabled ?? false,
  };

  // Shadow styles mapping
  const getShadowClass = (style: string) => {
    switch (style) {
      case 'none': return '';
      case 'subtle': return 'shadow-sm';
      case 'medium': return 'shadow-md';
      case 'large': return 'shadow-lg';
      case 'glow': return 'shadow-lg shadow-blue-500/25';
      default: return 'shadow-md';
    }
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

  const containerStyle: React.CSSProperties = {
    ...customStyles,
    backgroundColor: galleryConfig.backgroundColor === 'transparent' ? undefined : galleryConfig.backgroundColor,
    padding: `${galleryConfig.spacing}px`,
    borderRadius: `${galleryConfig.containerBorderRadius}px`,
    height: '100%',
    overflow: galleryConfig.scrollingEnabled ? 'auto' : 'hidden',
    ...customStyles,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${galleryConfig.columns}, 1fr)`,
    gap: `${galleryConfig.spacing}px`,
    height: galleryConfig.scrollingEnabled ? 'auto' : '100%',
  };

  const imageStyle: React.CSSProperties = {
    borderRadius: `${galleryConfig.imageBorderRadius}px`,
    border: galleryConfig.borderEnabled ? `${galleryConfig.borderWidth}px solid ${galleryConfig.borderColor}` : 'none',
  };

  return (
    <div style={containerStyle} className="w-full h-full">
      <div style={gridStyle}>
        {imageSlots.map((slot) => (
          <div
            key={slot.id}
            className={cn(
              "relative aspect-square overflow-hidden transition-all duration-300 group cursor-pointer",
              getShadowClass(galleryConfig.shadowStyle),
              !slot.hasImage && "hover:scale-105"
            )}
            style={imageStyle}
            onClick={() => slot.hasImage && setSelectedImage(slot.image)}
          >
            {slot.hasImage ? (
              <>
                {/* Generated Image */}
                <img
                  src={slot.image!}
                  alt={`Generated ${slot.id + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                {galleryConfig.overlayEnabled && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add download logic here
                      }}
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(slot.image);
                      }}
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add use as reference logic here
                      }}
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                
                {/* Enhanced AI Generated badge with pulsating dot */}
                <div className="absolute bottom-2 right-2 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1.5 text-xs text-white shadow-lg">
                  <span className="flex items-center gap-1.5">
                    <span 
                      className="h-2 w-2 rounded-full bg-white"
                      style={{
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    ></span>
                    <span className="font-medium">AI Generated</span>
                  </span>
                </div>
              </>
            ) : (
              /* Enhanced Placeholder with beautiful pulsating effects */
              <div className="w-full h-full relative">
                {isLoading ? (
                  <div className="relative w-full h-full">
                    {/* Base skeleton */}
                    <Skeleton className="w-full h-full" />
                    
                    {/* Beautiful pulsating overlay - inspired by Astria */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center rounded-lg"
                      style={{
                        animation: 'breathe 3s ease-in-out infinite'
                      }}
                    >
                      <div className="flex flex-col items-center gap-3 text-white">
                        {/* Spinning ring */}
                        <div 
                          className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full"
                          style={{
                            animation: 'spin 2s linear infinite'
                          }}
                        />
                        {/* Pulsating text */}
                        <div 
                          className="text-center"
                          style={{
                            animation: 'textPulse 2s ease-in-out infinite'
                          }}
                        >
                          <p className="text-sm font-medium">Generating...</p>
                          <p className="text-xs opacity-80">AI at work</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white/40 rounded-full"
                          style={{
                            left: `${20 + (i * 15)}%`,
                            top: `${30 + (i * 8)}%`,
                            animation: `float ${3 + (i * 0.5)}s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted/10 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="w-8 h-8 mx-auto mb-2 opacity-30">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                      </div>
                      <p className="text-xs opacity-70">Image {slot.id + 1}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Generated image full view"
              className="max-w-full max-h-full object-contain rounded-lg"
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

      {/* CSS animations */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        
        @keyframes textPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.8; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
} 