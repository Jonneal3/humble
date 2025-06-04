"use client";

import { DesignSettings, getEffectivePadding } from "@/types/design";
import { Suggestion } from "@/lib/suggestions";
import { BrandHeader } from "../BrandHeader";
import { ImageGallery } from "../ImageGallery";
import { UserInputSection } from "../UserInputSection";

interface RightLeftLayoutProps {
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

export function RightLeftLayout({
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
}: RightLeftLayoutProps) {
  const rightColumnWidth = config.prompt_section_width || 40;
  const isMobile = containerWidth < 768; // Use 768px as mobile breakpoint
  
  // Get configured container padding instead of hardcoded responsive padding
  const effectivePadding = getEffectivePadding(config);
  
  // Calculate scaling factor for responsive element sizing based on container width
  const heightScaleFactor = isMobile ? 1 : Math.max(0.7, Math.min(1.3, containerWidth / 1024));
  
  // Adjust prompt section width based on container size for better proportions
  const responsivePromptWidth = isMobile 
    ? Math.min(rightColumnWidth, 35) // Cap at 35% for mobile
    : containerWidth < 900 
      ? Math.min(rightColumnWidth, 38) // Cap at 38% for small containers
      : rightColumnWidth; // Use configured width for larger containers

  return (
    <div 
      className={`${fullPage || deployment ? 'h-screen' : 'h-full'} flex flex-col overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0">
          <BrandHeader config={config} containerWidth={containerWidth} />
        </div>
        
        {/* Mobile Layout: Single Column */}
        {isMobile && (
          <div 
            className="flex-1 flex flex-col min-h-0 relative"
            style={{ gap: `${Math.max(8, Math.min(24, containerWidth * 0.012))}px` }}
          >
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

            {/* Mobile: Images Gallery */}
            <div className="flex-1 min-h-0 relative">
              <ImageGallery
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                fullPage={fullPage}
                deployment={deployment}
                layoutContext="horizontal"
                containerWidth={containerWidth}
              />
            </div>
          </div>
        )}

        {/* Desktop Layout: Right-Left */}
        {!isMobile && (
          <div 
            className="flex-1 flex flex-row min-h-0 relative"
            style={{ gap: `${Math.max(8, Math.min(24, containerWidth * 0.012))}px` }}
          >
            {/* Right Side: Generated Images - Takes remaining space */}
            <div className="flex-1 min-w-0 min-h-0 relative">
              <ImageGallery
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                fullPage={fullPage}
                deployment={deployment}
                layoutContext="horizontal"
                containerWidth={containerWidth}
              />
            </div>

            {/* Left Side: Prompt with inline upload - Configurable width */}
            <div 
              className="flex flex-col min-w-0 h-full relative"
              style={{ width: `${responsivePromptWidth}%` }}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0 flex flex-col relative">
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
                    className="flex-1"
                    style={{ 
                      minHeight: `${Math.max(120, Math.min(200, containerWidth * 0.15)) * heightScaleFactor}px`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 