"use client";

import React from "react";
import { DesignSettings, getEffectivePadding } from "@/types/design";
import { Suggestion } from "@/lib/suggestions";
import { ImageUpload } from "../ImageUpload";
import { RefreshCw, ArrowUp, ArrowUpRight } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface UserInputSectionProps {
  config: DesignSettings;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  suggestions: Suggestion[];
  referenceImages: string[];
  onPromptSubmit: (prompt: string) => void;
  onSuggestionClick: (suggestion: Suggestion) => void;
  onImageUpload: (imageData: string | null) => void;
  onImageRemove: (index: number) => void;
  onRefreshSuggestions: () => void;
  variant?: 'mobile' | 'desktop';
  heightScaleFactor?: number;
  containerWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function UserInputSection({
  config,
  prompt,
  setPrompt,
  isLoading,
  suggestions,
  referenceImages,
  onPromptSubmit,
  onSuggestionClick,
  onImageUpload,
  onImageRemove,
  onRefreshSuggestions,
  variant = 'desktop',
  heightScaleFactor = 1,
  containerWidth = 1024,
  className = '',
  style = {}
}: UserInputSectionProps) {
  const isMobile = variant === 'mobile';

  // Base container styles with fixed padding
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: variant === "desktop" ? `${24 * heightScaleFactor}px` : `${12 * heightScaleFactor}px`,
    backgroundColor: config.prompt_background_color || 'transparent',
    borderRadius: `${(config.prompt_border_radius || 8) * heightScaleFactor}px`,
    height: '100%',
    minHeight: 'min-content',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    ...style
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className={`relative flex flex-col ${className}`} style={containerStyles}>
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Mobile Upload Section */}
          {config.uploader_enabled && (
            <div className="flex-shrink-0 mb-3">
              <div 
                className="flex items-center p-3 rounded-lg min-h-[60px] cursor-pointer hover:opacity-90 transition-opacity" 
                style={{
                  backgroundColor: config.uploader_background_color || '#f8fafc',
                  borderStyle: config.uploader_border_style || 'dashed',
                  borderColor: config.uploader_border_color || '#cbd5e1',
                  borderWidth: `${config.uploader_border_width ?? 2}px`,
                  borderRadius: `${config.uploader_border_radius ?? 12}px`
                }}
              >
                <div className="flex items-center w-full">
                  <ImageUpload
                    onImageUpload={onImageUpload}
                    onImageRemove={onImageRemove}
                    currentImages={referenceImages}
                    maxImages={config.uploader_max_images || 6}
                    variant="chatgpt"
                    customStyles={{
                      container: {
                        backgroundColor: 'transparent',
                        borderStyle: 'none' as const,
                        flex: '0 0 auto'
                      },
                      button: {
                        backgroundColor: 'transparent',
                        borderStyle: 'none' as const
                      }
                    }}
                  />
                  {referenceImages.length === 0 && (
                    <p className="text-sm font-medium flex-1 truncate" style={{
                      color: config.uploader_text_color || '#64748b',
                      fontFamily: config.uploader_font_family || 'inherit',
                      fontSize: `${config.uploader_font_size || 14}px`
                    }}>
                      {config.uploader_primary_text || "Add reference images to guide the AI generation"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Prompt Input */}
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
                className="bg-transparent border-none p-2 resize-none outline-none leading-relaxed w-full"
                style={{
                  color: config.prompt_text_color || '#374151',
                  fontFamily: config.prompt_font_family || 'inherit',
                  fontWeight: '500',
                  fontSize: `${(config.prompt_font_size || 16) * heightScaleFactor}px`
                }}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={() => onPromptSubmit(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="flex items-center justify-center rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: config.submit_button_background_color || "#3b82f6",
                  color: config.submit_button_text_color || "#ffffff",
                  width: `${32 * heightScaleFactor}px`,
                  height: `${32 * heightScaleFactor}px`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = config.submit_button_hover_background_color || "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = config.submit_button_background_color || "#3b82f6";
                }}
              >
                {isLoading ? (
                  <Spinner className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Suggestions */}
          {(config.suggestions_enabled ?? true) && (
            <div className="flex flex-wrap gap-1.5 px-3 mt-3">
              <button
                onClick={onRefreshSuggestions}
                className="flex items-center justify-center p-2 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                disabled={isLoading}
                title="Refresh suggestions"
                style={{
                  backgroundColor: config.suggestion_background_color || '#ffffff',
                  borderColor: config.suggestion_border_color || '#e5e7eb',
                  color: config.suggestion_text_color || '#374151',
                  transform: `scale(${heightScaleFactor})`
                }}
              >
                <RefreshCw className="w-3 h-3 transition-colors" />
              </button>
              
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-2 rounded-md border text-xs font-medium flex-shrink-0 max-w-[calc(50%-0.375rem)]"
                  style={{
                    backgroundColor: config.suggestion_background_color || '#ffffff',
                    borderColor: config.suggestion_border_color || '#e5e7eb',
                    color: config.suggestion_text_color || '#374151',
                    transform: `scale(${heightScaleFactor})`
                  }}
                >
                  <span className="truncate">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className={`relative flex flex-col ${className}`} style={containerStyles}>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Desktop Upload Section */}
        {config.uploader_enabled && (
          <div className="flex-shrink-0 min-w-0">
            <div className="flex flex-wrap items-center max-w-full gap-2">
              <div className="flex-shrink-0 min-w-[40px]" style={{ maxWidth: '70%' }}>
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
                      borderWidth: `${(config.uploader_border_width ?? 2) * heightScaleFactor}px`,
                      borderRadius: `${(config.uploader_border_radius ?? 12) * heightScaleFactor}px`,
                      padding: `${8 * heightScaleFactor}px`,
                      maxHeight: `${60 * heightScaleFactor}px`,
                      overflow: 'hidden',
                      width: 'auto',
                      minWidth: '40px'
                    },
                    button: {
                      backgroundColor: config.uploader_background_color || '#f8fafc',
                      borderStyle: config.uploader_border_style || 'dashed',
                      borderColor: config.uploader_border_color || '#cbd5e1',
                      borderWidth: `${(config.uploader_border_width ?? 2) * heightScaleFactor}px`,
                      borderRadius: `${(config.uploader_border_radius ?? 12) * heightScaleFactor}px`,
                      padding: `${8 * heightScaleFactor}px`,
                      maxHeight: `${60 * heightScaleFactor}px`,
                      overflow: 'hidden',
                      width: 'auto',
                      minWidth: '40px'
                    }
                  }}
                />
              </div>
              <p 
                className="text-slate-500 font-medium flex-1 min-w-[150px]"
                style={{ 
                  fontSize: `${12 * heightScaleFactor}px`
                }}
              >
                Add reference images to guide the AI generation
              </p>
            </div>
          </div>
        )}
        
        {/* Desktop Prompt Input */}
        <div className="flex-1 flex flex-col mt-4 min-w-0 overflow-hidden">
          <div className="relative flex items-start gap-2 min-w-0">
            <div className="flex-1 flex flex-col min-w-0">
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
                className="bg-transparent border-none p-2 resize-none outline-none leading-relaxed w-full"
                style={{
                  fontSize: `${(config.prompt_font_size || 16) * heightScaleFactor}px`,
                  color: config.prompt_text_color || '#374151',
                  fontFamily: config.prompt_font_family || 'inherit',
                  fontWeight: '500',
                  minHeight: `${60 * heightScaleFactor}px`,
                  maxHeight: `${120 * heightScaleFactor}px`,
                  overflow: 'auto'
                }}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={() => onPromptSubmit(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="flex items-center justify-center rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: config.submit_button_background_color || "#3b82f6",
                  color: config.submit_button_text_color || "#ffffff",
                  width: `${40 * heightScaleFactor}px`,
                  height: `${40 * heightScaleFactor}px`,
                  minWidth: `${40 * heightScaleFactor}px`,
                  minHeight: `${40 * heightScaleFactor}px`,
                  maxWidth: `${40 * heightScaleFactor}px`,
                  maxHeight: `${40 * heightScaleFactor}px`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = config.submit_button_hover_background_color || "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = config.submit_button_background_color || "#3b82f6";
                }}
              >
                {isLoading ? (
                  <div style={{ width: `${16 * heightScaleFactor}px`, height: `${16 * heightScaleFactor}px` }}>
                    <Spinner className="w-full h-full" />
                  </div>
                ) : (
                  <ArrowUp style={{ width: `${16 * heightScaleFactor}px`, height: `${16 * heightScaleFactor}px` }} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Desktop Suggestions */}
        {(config.suggestions_enabled ?? true) && (
          <div className="flex-shrink-0 mt-auto pt-3 min-w-0 overflow-hidden">
            <div 
              className="flex flex-wrap items-center border-t border-zinc-200/50 pt-3 gap-1.5"
              style={{ 
                gap: `${6 * heightScaleFactor}px`,
                minHeight: `${40 * heightScaleFactor}px`
              }}
            >
              <button
                onClick={onRefreshSuggestions}
                className="flex items-center justify-center rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                disabled={isLoading}
                title="Refresh suggestions"
                style={{
                  backgroundColor: config.suggestion_background_color || '#ffffff',
                  borderColor: config.suggestion_border_color || '#e5e7eb',
                  color: config.suggestion_text_color || '#374151',
                  padding: `${10 * heightScaleFactor}px`,
                  minWidth: `${36 * heightScaleFactor}px`,
                  minHeight: `${36 * heightScaleFactor}px`,
                  maxWidth: `${36 * heightScaleFactor}px`,
                  maxHeight: `${36 * heightScaleFactor}px`
                }}
              >
                <RefreshCw style={{ width: `${12 * heightScaleFactor}px`, height: `${12 * heightScaleFactor}px` }} className="transition-colors" />
              </button>
              
              <div className="flex flex-wrap gap-1.5 flex-1 items-center min-w-0 overflow-hidden">
                {suggestions.slice(0, config.suggestions_count || 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    disabled={isLoading}
                    className="flex items-center border group transition-all duration-200 shadow-sm font-medium flex-shrink-0"
                    style={{
                      backgroundColor: config.suggestion_background_color || '#ffffff',
                      borderColor: config.suggestion_border_color || '#e5e7eb',
                      borderWidth: `${(config.suggestion_border_width || 1) * heightScaleFactor}px`,
                      borderStyle: config.suggestion_border_style || 'solid',
                      borderRadius: `${(config.suggestion_border_radius || 8) * heightScaleFactor}px`,
                      fontFamily: config.suggestion_font_family || 'inherit',
                      fontSize: `${(config.suggestion_font_size || 12) * heightScaleFactor}px`,
                      padding: `${8 * heightScaleFactor}px ${12 * heightScaleFactor}px`,
                      gap: `${6 * heightScaleFactor}px`,
                      minHeight: `${36 * heightScaleFactor}px`,
                      maxWidth: 'calc(50% - 0.375rem)',
                      boxShadow: config.suggestion_shadow_style === 'none' ? 'none' :
                                config.suggestion_shadow_style === 'subtle' ? '0 1px 2px rgba(0,0,0,0.05)' :
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
                        className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ 
                          color: config.suggestion_text_color || '#6b7280',
                          width: `${12 * heightScaleFactor}px`,
                          height: `${12 * heightScaleFactor}px`
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 