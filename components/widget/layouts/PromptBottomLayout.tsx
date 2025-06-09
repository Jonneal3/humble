"use client";

import { DesignSettings, getEffectivePadding, getPaddingCSS } from "@/types/design";
import { Suggestion } from "@/lib/suggestions";
import { BrandHeader } from "../BrandHeader";
import { ImageGallery } from "../ImageGallery";
import { UserInputSection } from "../UserInputSection";
import { PromptTopLayout } from "./PromptTopLayout";

interface PromptBottomLayoutProps {
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

export function PromptBottomLayout({
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
}: PromptBottomLayoutProps) {
  const isMobile = containerWidth < 768; // Use 768px as mobile breakpoint

  // For mobile, use PromptTopLayout
  if (isMobile) {
    return (
      <PromptTopLayout
        config={config}
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        suggestions={suggestions}
        referenceImages={referenceImages}
        generatedImages={generatedImages}
        fullPage={fullPage}
        deployment={deployment}
        containerWidth={containerWidth}
        onPromptSubmit={onPromptSubmit}
        onSuggestionClick={onSuggestionClick}
        onImageUpload={onImageUpload}
        onImageRemove={onImageRemove}
        onRefreshSuggestions={onRefreshSuggestions}
      />
    );
  }

  // Get configured container padding instead of hardcoded responsive padding
  const effectivePadding = getEffectivePadding(config);
  
  // Calculate scaling factor based on prompt section height for top/bottom layouts
  const heightScaleFactor = (config.prompt_section_height || 30) / 30; // 30% is the base scale

  // Calculate container padding
  const containerPadding = {
    paddingTop: `${effectivePadding.top}px`,
    paddingRight: `${effectivePadding.right}px`,
    paddingBottom: `${effectivePadding.bottom}px`,
    paddingLeft: `${effectivePadding.left}px`,
  };

  return (
    <div 
      className={`${fullPage || deployment ? 'h-screen' : 'h-full'} flex flex-col overflow-hidden`}
      style={!fullPage ? containerPadding : undefined}
    >
      <div className="flex-shrink-0">
        <BrandHeader config={config} containerWidth={containerWidth} />
      </div>

      <div className="flex flex-col flex-1 min-h-0 relative" style={{ gap: `${config.prompt_gallery_spacing || 24}px` }}>
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

        {/* UserInputSection - Fixed at bottom */}
        <div 
          className={`flex-shrink-0 w-full relative z-20 ${deployment ? 'sticky bottom-0 bg-white/95 backdrop-blur-sm shadow-lg' : ''}`}
          style={{ 
            height: `${config.prompt_section_height || 30}%`,
            minHeight: `${180 * heightScaleFactor}px`,
            maxHeight: '70%',
            backgroundColor: deployment ? 'transparent' : (config.background_color || '#ffffff'),
            borderRadius: deployment ? '0' : `${config.prompt_border_radius || 12}px`,
            ...(deployment ? {
              paddingTop: `${effectivePadding.top}px`,
              paddingRight: `${effectivePadding.right}px`,
              paddingBottom: `${effectivePadding.bottom}px`,
              paddingLeft: `${effectivePadding.left}px`,
            } : {})
          }}
        >
          <div 
            className="max-w-2xl mx-auto w-full h-full"
            style={{ 
              backgroundColor: config.prompt_background_color || 'transparent',
              borderRadius: `${config.prompt_border_radius || 12}px`,
              border: `${config.prompt_border_width || 1}px ${config.prompt_border_style || 'solid'} ${config.prompt_border_color || '#e5e7eb'}`
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
        </div>
      </div>
    </div>
  );
} 