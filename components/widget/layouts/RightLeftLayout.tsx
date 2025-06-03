"use client";

import { DesignSettings } from "@/types/design";
import { Suggestion } from "@/lib/suggestions";
import { BrandHeader } from "../BrandHeader";
import { ImageGallery } from "../ImageGallery";
import { ImageUpload } from "../../ImageUpload";
import { RefreshCw, ArrowUp, ArrowUpRight } from "lucide-react";
import { Spinner } from "../../ui/spinner";

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
  onPromptSubmit,
  onSuggestionClick,
  onImageUpload,
  onImageRemove,
  onRefreshSuggestions
}: RightLeftLayoutProps) {
  const rightColumnWidth = config.prompt_section_width || 40;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <BrandHeader config={config} />
        </div>
        
        {/* Mobile Layout: Single Column (below lg breakpoint) */}
        <div className="flex-1 flex flex-col gap-4 lg:hidden">
          {/* Mobile: Compact Prompt Input */}
          <div className="flex-shrink-0">
            <div className="rounded-xl p-3 border transition-all duration-300"
              style={{
                backgroundColor: config.prompt_background_color || '#f9fafb',
                borderRadius: `${config.prompt_border_radius || 12}px`,
                borderColor: config.prompt_border_color || '#e5e7eb',
                borderWidth: `${config.prompt_border_width || 1}px`,
                borderStyle: config.prompt_border_style || 'solid'
              }}
            >
              <div className="space-y-3">
                {/* Upload thumbnails at top if enabled */}
                {config.uploader_enabled && (
                  <div className="flex-shrink-0 mb-4">
                    <div 
                      className="p-3 rounded-lg min-h-[80px] cursor-pointer hover:opacity-90 transition-opacity" 
                      style={{
                        backgroundColor: config.uploader_background_color || '#f8fafc',
                        borderStyle: config.uploader_border_style || 'dashed',
                        borderColor: config.uploader_border_color || '#cbd5e1',
                        borderWidth: `${config.uploader_border_width ?? 2}px`,
                        borderRadius: `${config.uploader_border_radius ?? 12}px`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ImageUpload
                            onImageUpload={onImageUpload}
                            onImageRemove={onImageRemove}
                            currentImages={referenceImages}
                            maxImages={config.uploader_max_images || 6}
                            variant="chatgpt"
                            customStyles={{
                              container: {
                                backgroundColor: 'transparent',
                                borderStyle: 'none' as const
                              },
                              button: {
                                backgroundColor: 'transparent',
                                borderStyle: 'none' as const
                              }
                            }}
                          />
                        </div>
                        {referenceImages.length === 0 && (
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{
                              color: config.uploader_text_color || '#64748b',
                              fontFamily: config.uploader_font_family || 'inherit',
                              fontSize: `${config.uploader_font_size || 14}px`
                            }}>
                              {config.uploader_primary_text || "Add reference images to guide the AI generation"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mobile: Prompt Input with Generate Button */}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!isLoading && prompt.trim()) {
                            onPromptSubmit(prompt);
                          }
                        }
                      }}
                      placeholder="Describe what you want to create..."
                      rows={2}
                      className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed w-full"
                      style={{
                        fontSize: `${config.prompt_font_size || 16}px`,
                        color: config.prompt_text_color || '#374151',
                        fontFamily: config.prompt_font_family || 'inherit',
                        fontWeight: '500'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => onPromptSubmit(prompt)}
                      disabled={isLoading || !prompt.trim()}
                      className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      {isLoading ? (
                        <Spinner className="w-3 h-3" />
                      ) : (
                        <ArrowUp className="w-3 h-3" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Mobile: Compact Suggestions */}
                {(config.suggestions_enabled ?? true) && (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={onRefreshSuggestions}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 group transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                      disabled={isLoading}
                      title="Refresh suggestions"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    </button>
                    
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-md border text-xs font-medium flex-shrink-0 max-w-[calc(50%-0.375rem)]"
                        style={{
                          backgroundColor: config.suggestion_background_color || '#ffffff',
                          borderColor: config.suggestion_border_color || '#e5e7eb',
                          color: config.suggestion_text_color || '#374151'
                        }}
                      >
                        <span className="truncate">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Images Gallery */}
          <div className="flex-1 min-h-0">
            <ImageGallery
              images={generatedImages}
              isLoading={isLoading}
              config={config}
              fullPage={fullPage}
              deployment={deployment}
            />
          </div>
        </div>

        {/* Desktop Layout: Right-Left (lg breakpoint and above) */}
        <div className="flex-1 hidden lg:flex flex-row gap-6 overflow-hidden min-h-0">
          {/* Left Side: Generated Images - Takes remaining space */}
          <div className="flex-1 min-w-0 min-h-0">
            <ImageGallery
              images={generatedImages}
              isLoading={isLoading}
              config={config}
              fullPage={fullPage}
              deployment={deployment}
            />
          </div>

          {/* Right Side: Prompt with inline upload - Configurable width */}
          <div 
            className="flex flex-col min-w-0 h-full"
            style={{ width: `${rightColumnWidth}%` }}
          >
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 rounded-2xl p-4 sm:p-5 border transition-all duration-300 min-h-[200px]"
                  style={{
                    backgroundColor: config.prompt_background_color || '#f9fafb',
                    borderRadius: `${config.prompt_border_radius || 16}px`,
                    borderColor: config.prompt_border_color || '#e5e7eb',
                    borderWidth: `${config.prompt_border_width || 1}px`,
                    borderStyle: config.prompt_border_style || 'solid'
                  }}
                >
                  <div className="h-full flex flex-col">
                    {/* Upload thumbnails at top if enabled */}
                    {config.uploader_enabled && (
                      <div className="flex-shrink-0 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <ImageUpload
                              onImageUpload={onImageUpload}
                              onImageRemove={onImageRemove}
                              currentImages={referenceImages}
                              maxImages={config.uploader_max_images || 6}
                              variant="chatgpt"
                              customStyles={{
                                container: {
                                  backgroundColor: config.uploader_background_color || '#f8fafc',
                                  borderStyle: config.uploader_border_style || 'dashed',
                                  borderColor: config.uploader_border_color || '#cbd5e1',
                                  borderWidth: `${config.uploader_border_width ?? 2}px`,
                                  borderRadius: `${config.uploader_border_radius ?? 12}px`
                                },
                                button: {
                                  backgroundColor: config.uploader_background_color || '#f8fafc',
                                  borderStyle: config.uploader_border_style || 'dashed',
                                  borderColor: config.uploader_border_color || '#cbd5e1',
                                  borderWidth: `${config.uploader_border_width ?? 2}px`,
                                  borderRadius: `${config.uploader_border_radius ?? 12}px`
                                }
                              }}
                            />
                          </div>
                          {referenceImages.length === 0 && (
                            <div className="flex-1">
                              <p className="text-xs text-slate-500 font-medium">Add reference images to guide the AI generation</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Prompt Input with Generate Button */}
                    <div className="flex gap-3 items-start flex-1 min-h-[60px]">
                      <div className="flex-1 min-h-0">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (!isLoading && prompt.trim()) {
                                onPromptSubmit(prompt);
                              }
                            }
                          }}
                          placeholder="Describe what you want to create..."
                          className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed w-full h-full"
                          style={{
                            fontSize: `${config.prompt_font_size || 16}px`,
                            color: config.prompt_text_color || '#374151',
                            fontFamily: config.prompt_font_family || 'inherit',
                            fontWeight: '500',
                            minHeight: '60px'
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      
                      {/* Generate button - positioned at bottom right */}
                      <div className="flex-shrink-0 self-end">
                        <button
                          onClick={() => onPromptSubmit(prompt)}
                          disabled={isLoading || !prompt.trim()}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                          {isLoading ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Suggestions row - at bottom */}
                    {(config.suggestions_enabled ?? true) && (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/50">
                        <button
                          onClick={onRefreshSuggestions}
                          className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 group transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                          disabled={isLoading}
                          title="Refresh suggestions"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        </button>
                        
                        {/* Responsive suggestion buttons */}
                        {suggestions.slice(0, config.suggestions_count || 6).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => onSuggestionClick(suggestion)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border group transition-all duration-200 shadow-sm font-medium text-xs sm:text-sm flex-shrink-0 max-w-[calc(50%-0.25rem)] sm:max-w-none"
                            style={{
                              backgroundColor: config.suggestion_background_color || '#ffffff',
                              borderColor: config.suggestion_border_color || '#e5e7eb',
                              borderWidth: `${config.suggestion_border_width || 1}px`,
                              borderStyle: config.suggestion_border_style || 'solid',
                              borderRadius: `${config.suggestion_border_radius || 8}px`,
                              fontFamily: config.suggestion_font_family || 'inherit',
                              fontSize: `${config.suggestion_font_size || 12}px`,
                              boxShadow: config.suggestion_shadow_style === 'subtle' ? '0 1px 3px rgba(0,0,0,0.1)' :
                                        config.suggestion_shadow_style === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                                        config.suggestion_shadow_style === 'large' ? '0 10px 15px rgba(0,0,0,0.1)' :
                                        config.suggestion_shadow_style === 'glow' ? '0 0 15px rgba(99, 102, 241, 0.3)' : 
                                        '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                          >
                            <span 
                              className="group-hover:opacity-90 transition-opacity truncate"
                              style={{ color: config.suggestion_text_color || '#374151' }}
                            >
                              {suggestion.text}
                            </span>
                            {(config.suggestion_arrow_icon ?? true) && (
                              <ArrowUpRight 
                                className="w-3 h-3 flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                style={{ color: config.suggestion_text_color || '#6b7280' }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 