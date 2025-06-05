"use client";

import { DesignSettings, getEffectivePadding, getPaddingCSS } from "@/types/design";
import { Suggestion } from "@/lib/suggestions";
import { BrandHeader } from "../BrandHeader";
import { ImageGallery } from "../ImageGallery";
import { UserInputSection } from "../UserInputSection";

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
          {/* Mobile: Images Gallery */}
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

          {/* Mobile: Compact Prompt Input */}
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
        </div>
      )}

      {/* Desktop Layout: Prompt Bottom */}
      {!isMobile && (
        <div className="flex flex-col flex-1 min-h-0 relative">
          {/* Gallery Section - Extends under UIC */}
          <div className="flex-1 min-h-0 -mb-48 relative">
            <div className="absolute inset-0">
              {/* Fade effect at bottom of gallery */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
                style={{
                  background: `linear-gradient(0deg, 
                    ${config.background_color || '#ffffff'}55 0%,
                    ${config.background_color || '#ffffff'}30 50%,
                    ${config.background_color || '#ffffff'}10 85%,
                    ${config.background_color || '#ffffff'}00 100%
                  )`,
                  borderRadius: `${config.prompt_border_radius || 12}px`
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

          {/* UserInputSection - Fixed at bottom */}
          <div 
            className="flex-shrink-0 mt-6 max-w-2xl mx-auto w-full relative z-20"
            style={{ 
              height: `${config.prompt_section_height || 30}%`,
              minHeight: `${180 * heightScaleFactor}px`,
              maxHeight: '70%',
              backgroundColor: config.background_color || '#ffffff',
              marginLeft: config.prompt_section_alignment === 'left' ? '0' : 
                         config.prompt_section_alignment === 'right' ? 'auto' : 'auto',
              marginRight: config.prompt_section_alignment === 'left' ? 'auto' : 
                          config.prompt_section_alignment === 'right' ? '0' : 'auto',
              borderRadius: `${config.prompt_border_radius || 12}px`,
              padding: '2px' // Small padding to ensure the border radius is visible
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
      )}
    </div>
  );
} 