"use client";

import React from "react";
import { DesignSettings } from "@/types/design";
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

  // Mobile version
  if (isMobile) {
    return (
      <div 
        className={`rounded-xl p-2 border transition-all duration-300 ${className}`}
        style={{
          backgroundColor: config.prompt_background_color || '#f9fafb',
          borderRadius: `${config.prompt_border_radius || 12}px`,
          borderColor: config.prompt_border_color || '#e5e7eb',
          borderWidth: `${config.prompt_border_width || 1}px`,
          borderStyle: config.prompt_border_style || 'solid',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%',
          ...style
        }}
      >
        <div className="space-y-2">
          {/* Mobile Upload Section */}
          {config.uploader_enabled && (
            <div className="flex-shrink-0 mb-3">
              <div 
                className="p-2 rounded-lg min-h-[60px] cursor-pointer hover:opacity-90 transition-opacity" 
                style={{
                  backgroundColor: config.uploader_background_color || '#f8fafc',
                  borderStyle: config.uploader_border_style || 'dashed',
                  borderColor: config.uploader_border_color || '#cbd5e1',
                  borderWidth: `${config.uploader_border_width ?? 2}px`,
                  borderRadius: `${config.uploader_border_radius ?? 12}px`
                }}
              >
                <div className="flex items-center gap-2">
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
                className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed w-full"
                style={{
                  color: config.prompt_text_color || '#374151',
                  fontFamily: config.prompt_font_family || 'inherit',
                  fontWeight: '500',
                  fontSize: `${config.prompt_font_size || 16}px`
                }}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={() => onPromptSubmit(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="flex items-center justify-center w-8 h-8 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: config.submit_button_background_color || "#3b82f6",
                  color: config.submit_button_text_color || "#ffffff"
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
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={onRefreshSuggestions}
                className="flex items-center justify-center p-1.5 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                disabled={isLoading}
                title="Refresh suggestions"
                style={{
                  backgroundColor: config.suggestion_background_color || '#ffffff',
                  borderColor: config.suggestion_border_color || '#e5e7eb',
                  color: config.suggestion_text_color || '#374151'
                }}
              >
                <RefreshCw className="w-3 h-3 transition-colors" />
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
    );
  }

  // Desktop version
  return (
    <div 
      className={`border transition-all duration-300 flex flex-col ${className}`}
      style={{
        backgroundColor: config.prompt_background_color || '#ffffff',
        borderRadius: `${(config.prompt_border_radius || 16) * heightScaleFactor}px`,
        borderColor: config.prompt_border_color || '#e5e7eb',
        borderWidth: `${(config.prompt_border_width || 1) * heightScaleFactor}px`,
        padding: `${8 * heightScaleFactor}px`,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        ...style
      }}
    >
      <div className="space-y-3 flex flex-col min-h-0 flex-1">
        {/* Desktop Upload Section */}
        {config.uploader_enabled && (
          <div className="flex items-center flex-shrink-0" style={{ gap: `${8 * heightScaleFactor}px` }}>
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
                    borderWidth: `${(config.uploader_border_width ?? 2) * heightScaleFactor}px`,
                    borderRadius: `${(config.uploader_border_radius ?? 12) * heightScaleFactor}px`,
                    padding: `${8 * heightScaleFactor}px`,
                    maxHeight: `${80 * heightScaleFactor}px`,
                    overflow: 'hidden'
                  },
                  button: {
                    backgroundColor: config.uploader_background_color || '#f8fafc',
                    borderStyle: config.uploader_border_style || 'dashed',
                    borderColor: config.uploader_border_color || '#cbd5e1',
                    borderWidth: `${(config.uploader_border_width ?? 2) * heightScaleFactor}px`,
                    borderRadius: `${(config.uploader_border_radius ?? 12) * heightScaleFactor}px`,
                    padding: `${8 * heightScaleFactor}px`,
                    maxHeight: `${80 * heightScaleFactor}px`,
                    overflow: 'hidden'
                  }
                }}
              />
            </div>
            {referenceImages.length === 0 && (
              <div className="flex-1">
                <p 
                  className="text-slate-500 font-medium truncate"
                  style={{ 
                    fontSize: `${12 * heightScaleFactor}px`
                  }}
                >
                  Add reference images to guide the AI generation
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Desktop Prompt Input */}
        <div 
          className="flex items-start flex-shrink-0" 
          style={{ gap: `${8 * heightScaleFactor}px` }}
        >
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
              className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed w-full"
              rows={2}
              style={{
                fontSize: `${(config.prompt_font_size || 16) * heightScaleFactor}px`,
                color: config.prompt_text_color || '#374151',
                fontFamily: config.prompt_font_family || 'inherit',
                fontWeight: '500',
                maxHeight: `${80 * heightScaleFactor}px`,
                overflow: 'auto'
              }}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex-shrink-0 self-end">
            <button
              onClick={() => onPromptSubmit(prompt)}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center justify-center rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              style={{
                backgroundColor: config.submit_button_background_color || "#3b82f6",
                color: config.submit_button_text_color || "#ffffff",
                width: `${40 * heightScaleFactor}px`,
                height: `${40 * heightScaleFactor}px`
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
        
        {/* Desktop Suggestions */}
        {(config.suggestions_enabled ?? true) && (
          <div 
            className="flex flex-wrap items-center border-t border-zinc-200/50 pt-3 flex-shrink-0 overflow-hidden"
            style={{ gap: `${6 * heightScaleFactor}px` }}
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
                padding: `${6 * heightScaleFactor}px`
              }}
            >
              <RefreshCw style={{ width: `${12 * heightScaleFactor}px`, height: `${12 * heightScaleFactor}px` }} className="transition-colors" />
            </button>
            
            {suggestions.slice(0, config.suggestions_count || 6).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                disabled={isLoading}
                className="flex items-center border group transition-all duration-200 shadow-sm font-medium flex-shrink-0 max-w-[calc(50%-0.25rem)]"
                style={{
                  backgroundColor: config.suggestion_background_color || '#ffffff',
                  borderColor: config.suggestion_border_color || '#e5e7eb',
                  borderWidth: `${(config.suggestion_border_width || 1) * heightScaleFactor}px`,
                  borderStyle: config.suggestion_border_style || 'solid',
                  borderRadius: `${(config.suggestion_border_radius || 8) * heightScaleFactor}px`,
                  fontFamily: config.suggestion_font_family || 'inherit',
                  fontSize: `${(config.suggestion_font_size || 12) * heightScaleFactor}px`,
                  padding: `${6 * heightScaleFactor}px ${10 * heightScaleFactor}px`,
                  gap: `${6 * heightScaleFactor}px`,
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
        )}
      </div>
    </div>
  );
} 