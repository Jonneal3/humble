"use client";

import { DesignSettings, getEffectivePadding } from "@/types/design";
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
          <div 
            className="flex-1 min-h-0 overflow-auto relative"
            style={{ 
              height: `${100 - (config.prompt_section_height || 30)}%`,
              maxHeight: `${100 - (config.prompt_section_height || 30)}%`
            }}
          >
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
          
          <div 
            className="flex-shrink-0 mt-6 relative"
            style={{ 
              height: `${config.prompt_section_height || 30}%`,
              minHeight: `${180 * heightScaleFactor}px`,
              maxHeight: '70%'
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