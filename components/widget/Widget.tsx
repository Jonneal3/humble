"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getRandomSuggestions, Suggestion } from "@/lib/suggestions";
import { DesignSettings, defaultDesignSettings, WidgetStyle, stylePresets } from "@/types/design";
import { WidgetLayout } from "./WidgetLayout";
import { ImageUpload } from "../ImageUpload";
import { ImagePreview } from "../ImagePreview";
import { RefreshCw, ArrowUpRight, FolderOpen, ArrowUp, Upload, Image } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface WidgetProps {
  instanceId: string;
  controlsOnly?: boolean;
  designConfig?: DesignSettings;
  className?: string;
}

export function Widget({ instanceId, controlsOnly = false, designConfig, className }: WidgetProps) {
  const [config, setConfig] = useState<DesignSettings>(designConfig || defaultDesignSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Array<{ image: string | null }>>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(getRandomSuggestions(6));
  const [prompt, setPrompt] = useState("");
  const [configLoaded, setConfigLoaded] = useState(!!designConfig); // Track if config is ready
  
  const supabase = createClientComponentClient();
  
  // Load configuration from database if not provided
  useEffect(() => {
    if (designConfig) {
      console.log('Widget: Using provided designConfig, layout_mode:', designConfig.layout_mode);
      setConfig(designConfig);
      setConfigLoaded(true);
      return;
    }

    const loadInstanceData = async () => {
      try {
        const { data: instance, error } = await supabase
          .from("instances")
          .select("*")
          .eq("id", instanceId)
          .single();

        if (error) {
          console.error('Error loading instance:', error);
          setConfig(defaultDesignSettings);
          setConfigLoaded(true);
          return;
        }

        if (instance?.config) {
          // Get the style preset based on the widget style
          const widgetStyle = (instance.config.widget_style || "modern") as WidgetStyle;
          const stylePreset = stylePresets[widgetStyle];
          
          // Merge configurations: default -> style preset -> instance config
          const mergedConfig = {
            ...defaultDesignSettings,
            ...stylePreset,
            ...instance.config,
          };
          
          setConfig(mergedConfig as DesignSettings);
          setConfigLoaded(true);
        } else {
          setConfig(defaultDesignSettings);
          setConfigLoaded(true);
        }
      } catch (err) {
        console.error("Error loading widget config:", err);
        setConfig(defaultDesignSettings);
        setConfigLoaded(true);
      }
    };

    loadInstanceData();
  }, [instanceId, designConfig, supabase]);

  // Refresh suggestions function
  const refreshSuggestions = () => {
    setSuggestions(getRandomSuggestions(config.suggestions_count || 6));
  };

  const handlePromptSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          instanceId,
          referenceImages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = data.images || [];
        setGeneratedImages(prev => [...newImages, ...prev].slice(0, 12));
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageData: string | null) => {
    if (imageData && referenceImages.length < (config.uploader_max_images || 6)) {
      setReferenceImages(prev => [...prev, imageData]);
    }
  };

  const handleImageRemove = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setPrompt(suggestion.prompt);
    handlePromptSubmit(suggestion.prompt);
  };

  // Brand Header Component with alignment options
  const BrandHeader = () => {
    if (!config.header_enabled || (!config.logo_url && !config.brand_name)) {
      return null;
    }

    const headerAlignment = config.header_alignment || 'center'; // left, center, right
    
    const alignmentClasses = {
      left: 'justify-start text-left',
      center: 'justify-center text-center',
      right: 'justify-end text-right'
    };

    return (
      <div className={`flex-shrink-0 mb-6 sm:mb-8 flex ${alignmentClasses[headerAlignment as keyof typeof alignmentClasses]} w-full`}>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo - Always left of brand name */}
          {config.logo_enabled && config.logo_url && (
            <img 
              src={config.logo_url} 
              alt={config.brand_name || "Logo"} 
              className="object-contain flex-shrink-0"
              style={{
                height: `${config.logo_height || 48}px`,
                maxWidth: `${(config.logo_height || 48) * 2}px`, // Maintain aspect ratio
                border: `${config.logo_border_width || 0}px solid ${config.logo_border_color || '#e5e7eb'}`,
                borderRadius: `${config.logo_border_radius || 4}px`
              }}
            />
          )}
          
          {/* Brand Name - Right of logo */}
          {config.brand_name && (
            <h1 
              className="font-semibold leading-tight"
              style={{ 
                color: config.brand_name_color || '#000000',
                fontFamily: config.brand_name_font_family || 'inherit',
                fontSize: `${config.brand_name_font_size || 32}px`,
              }}
            >
              {config.brand_name}
            </h1>
          )}
        </div>
      </div>
    );
  };

  // AI SDK Style Prompt Input with exact styling
  const AISDKPromptInput = ({ className: containerClassName }: { className?: string }) => (
    <div className={`w-full h-full flex flex-col ${containerClassName || ''}`}>
      <div className="h-full flex flex-col rounded-2xl p-4 sm:p-5 border transition-all duration-300"
        style={{
          backgroundColor: config.prompt_background_color || '#f9fafb',
          borderRadius: `${config.prompt_border_radius || 16}px`,
          borderColor: config.prompt_border_color || '#e5e7eb',
          borderWidth: `${config.prompt_border_width || 1}px`,
          borderStyle: config.prompt_border_style || 'solid'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Prompt Input with Generate Button */}
          <div className="flex gap-3 items-start flex-1 min-h-[80px]">
            <div className="flex-1 min-h-0">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading && prompt.trim()) {
                      handlePromptSubmit(prompt);
                    }
                  }
                }}
                placeholder="Describe what you want to create..."
                className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full h-full"
                style={{
                  fontSize: `${config.prompt_font_size || 16}px`,
                  color: config.prompt_text_color || '#111827',
                  fontFamily: config.prompt_font_family || 'inherit',
                  minHeight: '80px'
                }}
                disabled={isLoading}
              />
            </div>
            
            {/* Generate button - positioned next to prompt */}
            <div className="flex-shrink-0 self-end">
              <button
                onClick={() => handlePromptSubmit(prompt)}
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
          
          {/* Suggestions row - responsive wrapping */}
          {(config.suggestions_enabled ?? true) && (
            <div className="flex-shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* Refresh button */}
                <button
                  onClick={refreshSuggestions}
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
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border group transition-all duration-200 shadow-sm font-medium text-xs sm:text-sm flex-shrink-0 max-w-[calc(50%-0.25rem)] sm:max-w-none"
                    style={{
                      backgroundColor: config.suggestion_background_color || '#ffffff',
                      borderColor: config.suggestion_border_color || '#e5e7eb',
                      borderWidth: `${config.suggestion_border_width || 1}px`,
                      borderStyle: config.suggestion_border_style || 'solid',
                      borderRadius: `${config.suggestion_border_radius || 8}px`,
                      fontFamily: config.suggestion_font_family || 'inherit',
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
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Left-Right Layout: Traditional Desktop Style
  const LeftRightLayout = () => {
    // Use prompt_section_width for the left column width
    const leftColumnWidth = config.prompt_section_width || 40;
    
    return (
      <div 
        className="h-full w-full flex flex-col overflow-hidden" 
        style={{
          backgroundColor: config.background_color || '#ffffff',
          padding: `${config.container_padding || 24}px`
        }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <BrandHeader />
          </div>
          
          {/* Mobile Layout: Single Column (below lg breakpoint) */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden lg:hidden">
            {/* Mobile: Compact Prompt Input with inline upload */}
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
                    <div className="flex-shrink-0 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ImageUpload
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            currentImages={referenceImages}
                            maxImages={config.uploader_max_images || 6}
                            variant="chatgpt"
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
                              handlePromptSubmit(prompt);
                            }
                          }
                        }}
                        placeholder="Describe what you want to create..."
                        rows={2}
                        className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full text-sm"
                        style={{
                          color: config.prompt_text_color || '#111827',
                          fontFamily: config.prompt_font_family || 'inherit'
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePromptSubmit(prompt)}
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
                        onClick={refreshSuggestions}
                        className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 group transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                        disabled={isLoading}
                        title="Refresh suggestions"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </button>
                      
                      {suggestions.slice(0, 4).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
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
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full rounded-lg overflow-hidden">
                <ImagePreview
                  images={generatedImages}
                  isLoading={isLoading}
                  config={config}
                  customStyles={{
                    backgroundColor: config.gallery_background_color || 'transparent',
                    borderRadius: `${config.gallery_border_radius || 8}px`,
                    fontFamily: config.prompt_font_family || 'inherit'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout: Left-Right (lg breakpoint and above) */}
          <div className="flex-1 hidden lg:flex flex-row gap-6 overflow-hidden min-h-0">
            {/* Left Side: Prompt with inline upload - Configurable width */}
            <div 
              className="flex flex-col min-w-0 h-full"
              style={{
                width: `min(${leftColumnWidth}%, 600px)`,
                minWidth: '280px'
              }}
            >
              <div className="h-full flex flex-col overflow-hidden">
                {/* Inline Upload + Prompt Input Combined */}
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
                                onImageUpload={handleImageUpload}
                                onImageRemove={handleImageRemove}
                                currentImages={referenceImages}
                                maxImages={config.uploader_max_images || 6}
                                variant="chatgpt"
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
                      <div className="flex gap-3 items-start flex-1 min-h-[80px]">
                        <div className="flex-1 min-h-0">
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (!isLoading && prompt.trim()) {
                                  handlePromptSubmit(prompt);
                                }
                              }
                            }}
                            placeholder="Describe what you want to create..."
                            className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full h-full"
                            style={{
                              fontSize: `${config.prompt_font_size || 16}px`,
                              color: config.prompt_text_color || '#111827',
                              fontFamily: config.prompt_font_family || 'inherit',
                              minHeight: '80px'
                            }}
                            disabled={isLoading}
                          />
                        </div>
                        
                        {/* Generate button */}
                        <div className="flex-shrink-0 self-end">
                          <button
                            onClick={() => handlePromptSubmit(prompt)}
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
                      
                      {/* Suggestions row */}
                      {(config.suggestions_enabled ?? true) && (
                        <div className="flex-shrink-0 pt-4 border-t border-zinc-200/50 mt-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={refreshSuggestions}
                              className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 group transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                              disabled={isLoading}
                              title="Refresh suggestions"
                            >
                              <RefreshCw className="w-3 h-3 text-slate-600 group-hover:text-blue-600 transition-colors" />
                            </button>
                            
                            {suggestions.slice(0, config.suggestions_count || 6).map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border group transition-all duration-200 shadow-sm font-medium text-xs sm:text-sm flex-shrink-0 max-w-[calc(50%-0.25rem)] sm:max-w-none"
                                style={{
                                  backgroundColor: config.suggestion_background_color || '#ffffff',
                                  borderColor: config.suggestion_border_color || '#e5e7eb',
                                  borderWidth: `${config.suggestion_border_width || 1}px`,
                                  borderStyle: config.suggestion_border_style || 'solid',
                                  borderRadius: `${config.suggestion_border_radius || 8}px`,
                                  fontFamily: config.suggestion_font_family || 'inherit',
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Generated Images - Takes remaining space */}
            <div className="flex-1 min-w-0 min-h-0 h-full">
              <div className="h-full w-full overflow-hidden rounded-xl 2xl:rounded-2xl">
                <ImagePreview
                  images={generatedImages}
                  isLoading={isLoading}
                  config={config}
                  customStyles={{
                    backgroundColor: config.gallery_background_color || 'transparent',
                    borderRadius: `${config.gallery_border_radius || 12}px`,
                    fontFamily: config.prompt_font_family || 'inherit'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Prompt Bottom Layout: ChatGPT Style
  const PromptBottomLayout = () => {
    return (
      <div 
        className="h-full flex flex-col max-w-6xl mx-auto overflow-hidden"
        style={{
          backgroundColor: config.background_color || '#ffffff',
          padding: `${config.container_padding || 24}px`
        }}
      >
        <div className="flex-shrink-0 mb-4 lg:mb-0">
          <BrandHeader />
        </div>

        {/* Mobile Layout: Single Column (below lg breakpoint) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden lg:hidden">
          {/* Mobile: Compact Prompt Input with inline upload */}
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
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ImageUpload
                          onImageUpload={handleImageUpload}
                          onImageRemove={handleImageRemove}
                          currentImages={referenceImages}
                          maxImages={config.uploader_max_images || 6}
                          variant="chatgpt"
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
                            handlePromptSubmit(prompt);
                          }
                        }
                      }}
                      placeholder="Describe what you want to create..."
                      rows={2}
                      className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full text-sm"
                      style={{
                        color: config.prompt_text_color || '#111827',
                        fontFamily: config.prompt_font_family || 'inherit'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handlePromptSubmit(prompt)}
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
                      onClick={refreshSuggestions}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 group transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                      disabled={isLoading}
                      title="Refresh suggestions"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    </button>
                    
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
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
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full rounded-lg overflow-hidden">
              <ImagePreview
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                customStyles={{
                  backgroundColor: config.gallery_background_color || 'transparent',
                  borderRadius: `${config.gallery_border_radius || 8}px`,
                  fontFamily: config.prompt_font_family || 'inherit'
                }}
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout: Prompt Bottom (lg breakpoint and above) */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
          {/* Images Area - Constrained height */}
          <div className="flex-1 min-h-0 overflow-hidden mb-6">
            <div className="h-full rounded-xl sm:rounded-2xl overflow-hidden">
              <ImagePreview
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                customStyles={{
                  backgroundColor: config.gallery_background_color || 'transparent',
                  borderRadius: `${config.gallery_border_radius || 16}px`,
                  fontFamily: config.prompt_font_family || 'inherit'
                }}
              />
            </div>
          </div>
          
          {/* Prompt Input with side-by-side upload */}
          <div className="flex-shrink-0 w-full max-w-4xl mx-auto">
            <div className="rounded-2xl p-4 sm:p-5 border transition-all duration-300 min-h-[180px]"
              style={{
                backgroundColor: config.prompt_background_color || '#f9fafb',
                borderRadius: `${config.prompt_border_radius || 16}px`,
                borderColor: config.prompt_border_color || '#e5e7eb',
                borderWidth: `${config.prompt_border_width || 1}px`,
                borderStyle: config.prompt_border_style || 'solid'
              }}
            >
              <div className="flex flex-col">
                {/* Upload thumbnails at top if enabled */}
                {config.uploader_enabled && (
                  <div className="flex-shrink-0 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ImageUpload
                          onImageUpload={handleImageUpload}
                          onImageRemove={handleImageRemove}
                          currentImages={referenceImages}
                          maxImages={config.uploader_max_images || 6}
                          variant="chatgpt"
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
                <div className="flex gap-3 items-start flex-1">
                  <div className="flex-1 h-full">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!isLoading && prompt.trim()) {
                            handlePromptSubmit(prompt);
                          }
                        }
                      }}
                      placeholder="Describe what you want to create..."
                      className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full h-full"
                      style={{
                        fontSize: `${config.prompt_font_size || 16}px`,
                        color: config.prompt_text_color || '#111827',
                        fontFamily: config.prompt_font_family || 'inherit'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Generate button - positioned at top right */}
                  <div className="flex-shrink-0 self-end">
                    <button
                      onClick={() => handlePromptSubmit(prompt)}
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
                      onClick={refreshSuggestions}
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
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border group transition-all duration-200 shadow-sm font-medium text-xs sm:text-sm flex-shrink-0 max-w-[calc(50%-0.25rem)] sm:max-w-none"
                        style={{
                          backgroundColor: config.suggestion_background_color || '#ffffff',
                          borderColor: config.suggestion_border_color || '#e5e7eb',
                          borderWidth: `${config.suggestion_border_width || 1}px`,
                          borderStyle: config.suggestion_border_style || 'solid',
                          borderRadius: `${config.suggestion_border_radius || 8}px`,
                          fontFamily: config.suggestion_font_family || 'inherit'
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
    );
  };

  // Prompt Top Layout: AI SDK Style  
  const PromptTopLayout = () => {
    return (
      <div 
        className="h-full flex flex-col w-full max-w-6xl mx-auto overflow-hidden"
        style={{
          backgroundColor: config.background_color || '#ffffff',
          padding: `${config.container_padding || 24}px`
        }}
      >
        <div className="flex-shrink-0 mb-4 lg:mb-6">
          <BrandHeader />
        </div>

        {/* Mobile Layout: Single Column (below lg breakpoint) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden lg:hidden">
          {/* Mobile: Compact Prompt Input with inline upload */}
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
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ImageUpload
                          onImageUpload={handleImageUpload}
                          onImageRemove={handleImageRemove}
                          currentImages={referenceImages}
                          maxImages={config.uploader_max_images || 6}
                          variant="chatgpt"
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
                            handlePromptSubmit(prompt);
                          }
                        }
                      }}
                      placeholder="Describe what you want to create..."
                      rows={2}
                      className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full text-sm"
                      style={{
                        color: config.prompt_text_color || '#111827',
                        fontFamily: config.prompt_font_family || 'inherit'
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handlePromptSubmit(prompt)}
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
                      onClick={refreshSuggestions}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 group transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                      disabled={isLoading}
                      title="Refresh suggestions"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    </button>
                    
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
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
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full rounded-lg overflow-hidden">
              <ImagePreview
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                customStyles={{
                  backgroundColor: config.gallery_background_color || 'transparent',
                  borderRadius: `${config.gallery_border_radius || 8}px`,
                  fontFamily: config.prompt_font_family || 'inherit'
                }}
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout: Prompt Top (lg breakpoint and above) */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
          <div className="flex-shrink-0 mb-6">
            {/* Upload + Prompt Section */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="rounded-2xl p-4 sm:p-5 border transition-all duration-300 min-h-[180px]"
                style={{
                  backgroundColor: config.prompt_background_color || '#f9fafb',
                  borderRadius: `${config.prompt_border_radius || 16}px`,
                  borderColor: config.prompt_border_color || '#e5e7eb',
                  borderWidth: `${config.prompt_border_width || 1}px`,
                  borderStyle: config.prompt_border_style || 'solid'
                }}
              >
                <div className="flex flex-col">
                  {/* Upload thumbnails at top if enabled */}
                  {config.uploader_enabled && (
                    <div className="flex-shrink-0 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ImageUpload
                            onImageUpload={handleImageUpload}
                            onImageRemove={handleImageRemove}
                            currentImages={referenceImages}
                            maxImages={config.uploader_max_images || 6}
                            variant="chatgpt"
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
                  <div className="flex gap-3 items-start flex-1 min-h-[80px]">
                    <div className="flex-1 min-h-0">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (!isLoading && prompt.trim()) {
                              handlePromptSubmit(prompt);
                            }
                          }
                        }}
                        placeholder="Describe what you want to create..."
                        className="bg-transparent border-none p-0 resize-none outline-none leading-relaxed font-medium w-full h-full"
                        style={{
                          fontSize: `${config.prompt_font_size || 16}px`,
                          color: config.prompt_text_color || '#111827',
                          fontFamily: config.prompt_font_family || 'inherit',
                          minHeight: '80px'
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    
                    {/* Generate button */}
                    <div className="flex-shrink-0 self-end">
                      <button
                        onClick={() => handlePromptSubmit(prompt)}
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
                        onClick={refreshSuggestions}
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
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border group transition-all duration-200 shadow-sm font-medium text-xs sm:text-sm flex-shrink-0 max-w-[calc(50%-0.25rem)] sm:max-w-none"
                          style={{
                            backgroundColor: config.suggestion_background_color || '#ffffff',
                            borderColor: config.suggestion_border_color || '#e5e7eb',
                            borderWidth: `${config.suggestion_border_width || 1}px`,
                            borderStyle: config.suggestion_border_style || 'solid',
                            borderRadius: `${config.suggestion_border_radius || 8}px`,
                            fontFamily: config.suggestion_font_family || 'inherit'
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
          
          {/* Images Gallery Below - Proper overflow handling */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full rounded-xl sm:rounded-2xl overflow-hidden">
              <ImagePreview
                images={generatedImages}
                isLoading={isLoading}
                config={config}
                customStyles={{
                  backgroundColor: config.gallery_background_color || 'transparent',
                  borderRadius: `${config.gallery_border_radius || 16}px`,
                  fontFamily: config.prompt_font_family || 'inherit'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state until config is ready to prevent layout shift
  if (!configLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-lg">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shadow-sm">
              <Spinner className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800 tracking-tight">Loading your widget...</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Getting everything ready</p>
          </div>
        </div>
      </div>
    );
  }

  // Select layout based on mode
  const getLayoutComponent = () => {
    switch (config.layout_mode) {
      case "left-right":
        return <LeftRightLayout />;
      case "prompt-bottom":
        return <PromptBottomLayout />;
      case "prompt-top":
        return <PromptTopLayout />;
      default:
        return <PromptTopLayout />; // Default to AI SDK style
    }
  };

  // If controlsOnly mode, just return the prompt section without layout
  if (controlsOnly) {
    return (
      <div 
        className={className}
        style={{
          backgroundColor: config.background_color || '#ffffff',
          fontFamily: config.prompt_font_family || 'Inter, sans-serif',
          padding: `${config.container_padding || 24}px`,
        }}
      >
        <PromptTopLayout />
      </div>
    );
  }

  // Full widget with layout
  return (
    <WidgetLayout
      config={config}
      promptSection={<div />} // Not used anymore
      imagesSection={<div />} // Not used anymore  
      className={className}
    >
      {getLayoutComponent()}
    </WidgetLayout>
  );
}