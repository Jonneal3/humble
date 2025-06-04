"use client";

import { DesignSettings } from "@/types/design";

interface BrandHeaderProps {
  config: DesignSettings;
  containerWidth?: number;
}

export function BrandHeader({ config, containerWidth = 1024 }: BrandHeaderProps) {
  if (!config.header_enabled || (!config.logo_url && !config.brand_name)) {
    return null;
  }

  const headerAlignment = config.header_alignment || 'center'; // left, center, right
  
  const alignmentClasses = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right'
  };

  // Use minimal spacing that respects the configured padding
  const itemGap = Math.max(6, Math.min(16, containerWidth * 0.01));

  return (
    <div 
      className={`flex-shrink-0 flex ${alignmentClasses[headerAlignment as keyof typeof alignmentClasses]} w-full`}
    >
      <div 
        className="flex items-center"
        style={{ gap: `${itemGap}px` }}
      >
        {/* Logo - Always left of brand name */}
        {config.logo_enabled && config.logo_url && (
          <img 
            src={config.logo_url} 
            alt={config.brand_name || "Logo"} 
            className="object-contain flex-shrink-0"
            style={{
              height: `${config.logo_height || 48}px`,
              maxWidth: `${(config.logo_height || 48) * 2}px`, // Maintain aspect ratio
              border: `${config.logo_border_width || 0}px solid ${config.logo_border_color || '#e5e7eb'}`,
              borderRadius: `${config.logo_border_radius || 4}px`
            }}
          />
        )}
        
        {/* Brand Name - Right of logo */}
        {config.brand_name && (
          <h1 
            className="font-semibold leading-tight"
            style={{ 
              color: config.brand_name_color || '#000000',
              fontFamily: config.brand_name_font_family || 'inherit',
              fontSize: `${config.brand_name_font_size || 32}px`,
            }}
          >
            {config.brand_name}
          </h1>
        )}
      </div>
    </div>
  );
} 