"use client";

import { DesignSettings, getEffectivePadding, getPaddingCSS } from "@/types/design";
import { Suggestion } from "@/lib/suggestions";
import { BrandHeader } from "../BrandHeader";
import { ImageGallery } from "../ImageGallery";
import { UserInputSection } from "../UserInputSection";

interface PromptTopLayoutProps {
  config: DesignSettings;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  suggestions: Suggestion[];
  referenceImages: string[];
  generatedImages: Array<{ image: string | null }>;
  fullPage?: boolean;
  deployment?: boolean;
  containerWidth?: number;
  onPromptSubmit: (prompt: string) => void;
  onSuggestionClick: (suggestion: Suggestion) => void;
  onImageUpload: (imageData: string | null) => void;
  onImageRemove: (index: number) => void;
  onRefreshSuggestions: () => void;
}

export function PromptTopLayout({
  config,
  prompt,
  setPrompt,
  isLoading,
  suggestions,
  referenceImages,
  generatedImages,
  fullPage = false,
  deployment = false,
  containerWidth = 1024,
  onPromptSubmit,
  onSuggestionClick,
  onImageUpload,
  onImageRemove,
  onRefreshSuggestions
}: PromptTopLayoutProps) {
  const isMobile = containerWidth < 768; // Use 768px as mobile breakpoint

  // Get configured container padding instead of hardcoded responsive padding
  const effectivePadding = getEffectivePadding(config);
  
  // Calculate scaling factor based on prompt section height for top/bottom layouts
  const heightScaleFactor = isMobile ? 1 : (config.prompt_section_height || 30) / 30; // 30% is the base scale

  // Calculate container padding
  const containerPadding = {
    paddingTop: `${effectivePadding.top}px`,
    paddingRight: `${effectivePadding.right}px`,
    paddingBottom: `${effectivePadding.bottom}px`,
    paddingLeft: `${effectivePadding.left}px`,
  };

  // Get alignment class based on config
  const getAlignmentClass = () => {
    switch (config.prompt_section_alignment) {
      case 'left':
        return 'mr-auto';
      case 'right':
        return 'ml-auto';
      case 'center':
      default:
        return 'mx-auto';
    }
  };

  return (
    <div 
      className={`${fullPage || deployment ? 'h-screen' : 'h-full'} flex flex-col overflow-hidden`}
      style={!fullPage ? containerPadding : undefined}
    >
      <div className="flex-shrink-0">
        <BrandHeader config={config} containerWidth={containerWidth} />
      </div>

      {/* Mobile Layout: Single Column */}
      {isMobile && (
        <div 
          className="flex-1 flex flex-col min-h-0 relative w-full" 
          style={{ 
            gap: `${config.prompt_gallery_spacing || 24}px`,
            maxWidth: '100vw',
            overflowX: 'hidden'
          }}
        >
          {/* Mobile content with responsive fonts */}
          <div 
            className="flex-shrink-0 relative w-full"
            style={{ 
              backgroundColor: config.prompt_background_color || 'transparent',
              borderRadius: `${config.prompt_border_radius || 12}px`,
              border: `${config.prompt_border_width || 1}px ${config.prompt_border_style || 'solid'} ${config.prompt_border_color || '#e5e7eb'}`
            }}
          >
            <UserInputSection
              config={{
                ...config,
                prompt_section_width: 100,
                prompt_font_size: Math.max(14, config.prompt_font_size ? config.prompt_font_size * 0.9 : 16),
                suggestion_font_size: Math.max(12, config.suggestion_font_size ? config.suggestion_font_size * 0.9 : 14)
              }}
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={isLoading}
              suggestions={suggestions}
              referenceImages={referenceImages}
              onPromptSubmit={onPromptSubmit}
              onSuggestionClick={onSuggestionClick}
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              onRefreshSuggestions={onRefreshSuggestions}
              variant="mobile"
              heightScaleFactor={heightScaleFactor}
              containerWidth={containerWidth}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-auto relative w-full">
            <ImageGallery
              images={generatedImages}
              isLoading={isLoading}
              config={{
                ...config,
                gallery_columns: containerWidth < 480 ? 1 : 2,
                gallery_spacing: Math.max(8, config.gallery_spacing ? config.gallery_spacing * 0.75 : 12)
              }}
              fullPage={fullPage}
              deployment={deployment}
              layoutContext="vertical"
              containerWidth={containerWidth}
            />
          </div>
        </div>
      )}

      {/* Desktop Layout: Prompt Top */}
      {!isMobile && (
        <div className="flex flex-col flex-1 min-h-0 relative" style={{ gap: `${config.prompt_gallery_spacing || 24}px` }}>
          {/* UserInputSection - Fixed at top */}
          <div 
            className={`flex-shrink-0 max-w-2xl w-full relative z-20 ${deployment ? 'sticky top-0' : ''} ${getAlignmentClass()}`}
            style={{ 
              height: `${config.prompt_section_height || 30}%`,
              minHeight: `${180 * heightScaleFactor}px`,
              maxHeight: '70%',
              backgroundColor: config.prompt_background_color || 'transparent',
              borderRadius: `${config.prompt_border_radius || 12}px`,
              border: `${config.prompt_border_width || 1}px ${config.prompt_border_style || 'solid'} ${config.prompt_border_color || '#e5e7eb'}`,
              ...(deployment ? {
                paddingTop: `${effectivePadding.top}px`,
                paddingRight: `${effectivePadding.right}px`,
                paddingBottom: `${effectivePadding.bottom}px`,
                paddingLeft: `${effectivePadding.left}px`,
              } : {})
            }}
          >
            <UserInputSection
              config={config}
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={isLoading}
              suggestions={suggestions}
              referenceImages={referenceImages}
              onPromptSubmit={onPromptSubmit}
              onSuggestionClick={onSuggestionClick}
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              onRefreshSuggestions={onRefreshSuggestions}
              variant="desktop"
              heightScaleFactor={heightScaleFactor}
              containerWidth={containerWidth}
              style={{ height: '100%' }}
            />
          </div>

          {/* Gallery Section - Scrollable */}
          <div className="flex-1 min-h-0 relative">
            <div className="absolute inset-0 overflow-auto">
              <ImageGallery
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                fullPage={fullPage}
                deployment={deployment}
                layoutContext="vertical"
                containerWidth={containerWidth}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 