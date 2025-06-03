"use client";

import React, { useEffect } from "react";
import { DesignSettings, defaultDesignSettings, loadGoogleFont } from "@/types/design";
import { Widget } from "@/components/widget/Widget";

interface WidgetPageViewProps {
  instanceId: string;
  liveConfig?: DesignSettings | null; // For live preview in designer
  className?: string;
  style?: React.CSSProperties;
  fullPage?: boolean; // When true, removes borders, radius, and shadows for full page view
}

export function WidgetPageView({ instanceId, liveConfig, className, style, fullPage = false }: WidgetPageViewProps) {
  // For live preview, merge the live config with defaults
  const config = liveConfig ? {
    ...defaultDesignSettings,
    ...liveConfig
  } : undefined; // Let Widget component load from database if no live config

  // Debug logging
  React.useEffect(() => {
    if (liveConfig) {
      console.log('WidgetPageView received liveConfig:', liveConfig);
    }
  }, [liveConfig]);

  // Load Google Fonts when config changes for live preview
  useEffect(() => {
    if (!config) return;

    // Load ALL fonts used in the configuration
    const fontsToLoad = [
      config.brand_name_font_family,
      config.prompt_font_family,
      config.suggestion_font_family,
      config.uploader_font_family,
      config.gallery_font_family,
      config.title_font_family,
      config.cta_font_family,
      config.overlay_font_family
    ].filter(Boolean); // Remove undefined/null values

    fontsToLoad.forEach(fontFamily => {
      if (fontFamily && fontFamily !== 'inherit' && fontFamily !== 'sans-serif' && fontFamily !== 'serif') {
        loadGoogleFont(fontFamily);
      }
    });
  }, [config]);

  return (
    <div 
      className={`w-full h-full ${className || ''}`}
      style={{
        backgroundColor: config?.background_color || '#ffffff',
        padding: fullPage ? 0 : (config?.container_padding ? `${config.container_padding}px` : undefined),
        borderRadius: fullPage ? 0 : (config?.border_radius ? `${config.border_radius}px` : undefined),
        boxShadow: fullPage ? 'none' : (
          config?.shadow_style === 'subtle' ? '0 1px 3px rgba(0,0,0,0.1)' :
          config?.shadow_style === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
          config?.shadow_style === 'large' ? '0 10px 15px rgba(0,0,0,0.1)' :
          config?.shadow_style === 'glow' ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none'
        ),
        overscrollBehavior: 'none', // Prevent elastic scrolling
        ...style
      }}
    >
      <Widget
        instanceId={instanceId}
        designConfig={config}
        className="w-full h-full"
        fullPage={fullPage}
      />
    </div>
  );
} 