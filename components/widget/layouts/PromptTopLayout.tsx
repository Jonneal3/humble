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

  return (
    <div 
      className={`${fullPage || deployment ? 'h-screen' : 'h-full'} flex flex-col overflow-hidden`}
    >
      <div className="flex-shrink-0">
        <BrandHeader config={config} containerWidth={containerWidth} />
      </div>

      {/* Mobile Layout: Single Column */}
      {isMobile && (
        <div className="flex-1 flex flex-col min-h-0 relative" style={{ gap: `${Math.max(0.5, Math.min(1.5, containerWidth * 0.003))}rem` }}>
          {/* Mobile content with responsive fonts */}
          <div className="flex-shrink-0 relative">
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
              variant="mobile"
              heightScaleFactor={heightScaleFactor}
              containerWidth={containerWidth}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-auto relative">
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
      )}

      {/* Desktop Layout: Prompt Top */}
      {!isMobile && (
        <div className="flex flex-col flex-1 min-h-0 relative">
          {/* UserInputSection - Fixed at top */}
          <div 
            className="flex-shrink-0 mb-6 max-w-2xl mx-auto w-full relative z-20"
            style={{ 
              height: `${config.prompt_section_height || 30}%`,
              minHeight: `${180 * heightScaleFactor}px`,
              maxHeight: '70%',
              backgroundColor: config.background_color || '#ffffff',
              marginLeft: config.prompt_section_alignment === 'left' ? '0' : 
                         config.prompt_section_alignment === 'right' ? 'auto' : 'auto',
              marginRight: config.prompt_section_alignment === 'left' ? 'auto' : 
                          config.prompt_section_alignment === 'right' ? '0' : 'auto'
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

          {/* Gallery Section - Extends under UIC */}
          <div className="flex-1 min-h-0 -mt-48 relative">
            <div className="absolute inset-0">
              {/* Fade effect at top of gallery */}
              <div 
                className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-10"
                style={{
                  background: `linear-gradient(180deg, 
                    ${config.background_color || '#ffffff'} 0%,
                    ${config.background_color || '#ffffff'}80 40%,
                    transparent 100%
                  )`
                }}
              ></div>
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