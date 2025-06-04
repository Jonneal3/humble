"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/homepage/theme-provider";
import { DesignSettings, getPaddingCSS } from "@/types/design";

interface WidgetLayoutProps {
  config: DesignSettings;
  promptSection?: ReactNode; // Keep for backwards compatibility but optional
  imagesSection?: ReactNode; // Keep for backwards compatibility but optional
  className?: string;
  children?: ReactNode; // New: accept complete layout as children
  fullPage?: boolean; // When true, removes container padding for full page view
  deployment?: boolean; // When true, indicates actual deployment vs design preview
}

// Simple layout switcher with clean minimal styling
const getLayoutStructure = (layoutMode: string, promptSection: ReactNode, imagesSection: ReactNode, config: DesignSettings) => {
  switch (layoutMode) {
    case "left-right":
      return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Prompt Section */}
          <div 
            className="lg:col-span-5 flex flex-col"
            style={{
              backgroundColor: config.prompt_background_color || 'transparent',
              borderRadius: `${config.prompt_border_radius || 8}px`,
              border: `1px solid ${config.prompt_border_color || '#e5e7eb'}`,
              padding: getPaddingCSS(config),
            }}
          >
            {promptSection}
          </div>
          
          {/* Right: Images Section */}
          <div 
            className="lg:col-span-7 flex flex-col"
            style={{
              backgroundColor: config.gallery_background_color || 'transparent',
              borderRadius: `${config.gallery_border_radius || 8}px`,
              border: `1px solid ${config.gallery_border_color || '#e5e7eb'}`,
              padding: getPaddingCSS(config),
            }}
          >
            {imagesSection}
          </div>
        </div>
      );

    case "prompt-top":
      return (
        <div className="h-full flex flex-col gap-4">
          {/* Top: Compact Prompt */}
          <div 
            className="flex-shrink-0"
            style={{
              backgroundColor: config.prompt_background_color || 'transparent',
              borderRadius: `${config.prompt_border_radius || 8}px`,
              border: `1px solid ${config.prompt_border_color || '#e5e7eb'}`,
              padding: getPaddingCSS(config),
            }}
          >
            {promptSection}
          </div>
          
          {/* Bottom: Images Area */}
          <div 
            className="flex-1 min-h-0"
            style={{
              backgroundColor: config.gallery_background_color || 'transparent',
              borderRadius: `${config.gallery_border_radius || 8}px`,
              border: `1px solid ${config.gallery_border_color || '#e5e7eb'}`,
              padding: getPaddingCSS(config),
            }}
          >
            {imagesSection}
          </div>
        </div>
      );

    case "prompt-bottom":
      return (
        <div className="h-full flex flex-col gap-3">
          {/* Top: Images Area */}
          <div 
            className="flex-1 min-h-0"
            style={{
              backgroundColor: config.gallery_background_color || 'transparent',
              borderRadius: `${config.gallery_border_radius || 8}px`,
              border: `1px solid ${config.gallery_border_color || '#e5e7eb'}`,
              padding: getPaddingCSS(config),
            }}
          >
            {imagesSection}
          </div>
          
          {/* Bottom: Input Bar */}
          <div 
            className="flex-shrink-0"
            style={{
              backgroundColor: config.prompt_background_color || 'transparent',
              borderRadius: `${config.prompt_border_radius || 12}px`,
              border: `1px solid ${config.prompt_border_color || '#e5e7eb'}`,
              padding: getPaddingCSS(config),
            }}
          >
            {promptSection}
          </div>
        </div>
      );

    default:
      return (
        <div className="h-full flex flex-col gap-3">
          <div className="flex-1 min-h-0 bg-white rounded-lg border border-gray-200 p-5">
            {imagesSection}
          </div>
          <div className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-4">
            {promptSection}
          </div>
        </div>
      );
  }
};

export function WidgetLayout({
  config,
  promptSection,
  imagesSection,
  className = "",
  children,
  fullPage = false,
  deployment = false,
}: WidgetLayoutProps) {
  console.log('WidgetLayout: Current layout mode:', config.layout_mode);

  // Base container styles - simplified since children now handle their own styling
  const containerStyles = {
    backgroundColor: (fullPage && deployment) ? 'transparent' : (config.background_color || '#ffffff'),
    borderRadius: (fullPage && deployment) ? 0 : `${config.border_radius || 0}px`,
    height: '100%', // Take full available height from parent (works in iframe and full page)
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
    boxShadow: (fullPage && deployment) ? 'none' : (
      config.shadow_style === 'subtle' ? '0 1px 3px rgba(0,0,0,0.1)' :
      config.shadow_style === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
      config.shadow_style === 'large' ? '0 10px 15px rgba(0,0,0,0.1)' :
      config.shadow_style === 'glow' ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none'
    ),
    // Remove padding from here since it's handled at the root level
    padding: 0
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div 
        className={`w-full h-full relative overflow-hidden ${className}`}
        style={containerStyles}
      >
        <div className="absolute inset-0 flex flex-col">
          {children || (
            <div className="flex-1 min-h-0 overflow-auto">
              {getLayoutStructure(config.layout_mode || "prompt-top", promptSection, imagesSection, config)}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
} 