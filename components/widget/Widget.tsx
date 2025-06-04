"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getRandomSuggestions, Suggestion } from "@/lib/suggestions";
import { DesignSettings, defaultDesignSettings, WidgetStyle, stylePresets, loadGoogleFont } from "@/types/design";
import { WidgetLayout } from "./WidgetLayout";
import { Spinner } from "../ui/spinner";

// Import layout components
import { LeftRightLayout } from "./layouts/LeftRightLayout";
import { RightLeftLayout } from "./layouts/RightLeftLayout";
import { PromptBottomLayout } from "./layouts/PromptBottomLayout";
import { PromptTopLayout } from "./layouts/PromptTopLayout";

interface WidgetProps {
  instanceId: string;
  controlsOnly?: boolean;
  designConfig?: DesignSettings;
  className?: string;
  fullPage?: boolean;
  deployment?: boolean;
}

export function Widget({ 
  instanceId, 
  controlsOnly = false, 
  designConfig, 
  className, 
  fullPage = false, 
  deployment = false 
}: WidgetProps) {
  // Sample images to display by default
  const sampleImages = [
    { image: "/homepage/example0001.png" },
    { image: "/homepage/example0002.png" },
    { image: "/homepage/example0003.png" },
    { image: "/homepage/example0004.png" },
    { image: "/homepage/example0005.png" },
    { image: "/homepage/example0006.png" },
    { image: "/homepage/example0007.png" },
    { image: "/homepage/example0008.png" },
  ];

  // State
  const [config, setConfig] = useState<DesignSettings>(designConfig || defaultDesignSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Array<{ image: string | null }>>(sampleImages);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(getRandomSuggestions(6));
  const [prompt, setPrompt] = useState("");
  const [configLoaded, setConfigLoaded] = useState(!!designConfig);
  const [containerWidth, setContainerWidth] = useState<number>(1024); // Default to desktop width
  
  const supabase = createClientComponentClient();
  const componentId = React.useMemo(() => `widget-${instanceId}`, [instanceId]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Monitor container width for responsive behavior
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Load configuration from database if not provided
  useEffect(() => {
    if (designConfig) {
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
          const widgetStyle = (instance.config.widget_style || "modern") as WidgetStyle;
          const stylePreset = stylePresets[widgetStyle];
          
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

  // Load Google Fonts when config changes
  useEffect(() => {
    if (!configLoaded) return;

    const fontsToLoad = [
      config.brand_name_font_family,
      config.prompt_font_family,
      config.suggestion_font_family,
      config.uploader_font_family
    ].filter(Boolean);

    fontsToLoad.forEach(fontFamily => {
      if (fontFamily && fontFamily !== 'inherit' && fontFamily !== 'sans-serif' && fontFamily !== 'serif') {
        loadGoogleFont(fontFamily);
      }
    });
  }, [config, configLoaded]);

  // Event handlers
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

  // Layout component selector
  const getLayoutComponent = () => {
    // Smart responsive scaling - creates scaled design settings based on container width
    const getResponsiveConfig = (originalConfig: DesignSettings, containerWidth: number): DesignSettings => {
      // Calculate scale factor based on container width
      // 1.0 at 1200px+, scales down to 0.5 at 300px (more aggressive)
      const minWidth = 300;
      const maxWidth = 1200;
      const minScale = 0.5; // More aggressive minimum scale
      const maxScale = 1.0;
      
      const scaleFactor = Math.max(minScale, Math.min(maxScale, 
        minScale + (maxScale - minScale) * (containerWidth - minWidth) / (maxWidth - minWidth)
      ));

      // For very small elements, use even more aggressive scaling
      const smallElementScale = Math.max(0.4, scaleFactor * 0.8); // Extra aggressive for small text
      const microElementScale = Math.max(0.35, scaleFactor * 0.7); // Super aggressive for tiny elements

      // Create scaled config by applying scale factor to size-related properties
      const scaledConfig = { ...originalConfig };
      
      // Scale main fonts (less aggressive for readability)
      if (originalConfig.prompt_font_size) scaledConfig.prompt_font_size = Math.max(11, originalConfig.prompt_font_size * scaleFactor);
      if (originalConfig.brand_name_font_size) scaledConfig.brand_name_font_size = Math.max(14, originalConfig.brand_name_font_size * scaleFactor);
      if (originalConfig.uploader_font_size) scaledConfig.uploader_font_size = Math.max(10, originalConfig.uploader_font_size * scaleFactor);
      
      // Scale logo size
      if (originalConfig.logo_height) scaledConfig.logo_height = Math.max(24, originalConfig.logo_height * scaleFactor);
      
      // Scale small elements more aggressively
      if (originalConfig.suggestion_font_size) scaledConfig.suggestion_font_size = Math.max(8, originalConfig.suggestion_font_size * smallElementScale);
      
      // Scale border radius (more aggressive)
      if (originalConfig.prompt_border_radius) scaledConfig.prompt_border_radius = Math.max(4, originalConfig.prompt_border_radius * scaleFactor);
      if (originalConfig.suggestion_border_radius) scaledConfig.suggestion_border_radius = Math.max(3, originalConfig.suggestion_border_radius * smallElementScale);
      if (originalConfig.uploader_border_radius) scaledConfig.uploader_border_radius = Math.max(4, originalConfig.uploader_border_radius * scaleFactor);
      if (originalConfig.gallery_border_radius) scaledConfig.gallery_border_radius = Math.max(4, originalConfig.gallery_border_radius * scaleFactor);
      if (originalConfig.gallery_image_border_radius) scaledConfig.gallery_image_border_radius = Math.max(3, originalConfig.gallery_image_border_radius * scaleFactor);
      
      // Scale spacing more aggressively for compact layouts
      if (originalConfig.gallery_spacing) scaledConfig.gallery_spacing = Math.max(4, originalConfig.gallery_spacing * scaleFactor);
      
      // Scale border widths (keep them thin in small containers)
      if (originalConfig.prompt_border_width) scaledConfig.prompt_border_width = Math.max(0.5, originalConfig.prompt_border_width * scaleFactor);
      if (originalConfig.suggestion_border_width) scaledConfig.suggestion_border_width = Math.max(0.5, originalConfig.suggestion_border_width * smallElementScale);
      if (originalConfig.uploader_border_width) scaledConfig.uploader_border_width = Math.max(0.5, originalConfig.uploader_border_width * scaleFactor);
      
      // Scale gallery settings for tighter layouts
      if (originalConfig.gallery_columns && containerWidth < 500) {
        // Force fewer columns in very small containers
        scaledConfig.gallery_columns = Math.min(originalConfig.gallery_columns, containerWidth < 350 ? 1 : 2);
      }
      
      return scaledConfig;
    };

    const responsiveConfig = getResponsiveConfig(config, containerWidth);

    const layoutProps = {
      config: responsiveConfig, // Use scaled config instead of original
      prompt,
      setPrompt,
      isLoading,
      suggestions,
      referenceImages,
      generatedImages,
      fullPage,
      deployment,
      containerWidth,
      onPromptSubmit: handlePromptSubmit,
      onSuggestionClick: handleSuggestionClick,
      onImageUpload: handleImageUpload,
      onImageRemove: handleImageRemove,
      onRefreshSuggestions: refreshSuggestions
    };

    switch (config.layout_mode) {
      case "left-right":
        return <LeftRightLayout {...layoutProps} />;
      case "prompt-bottom":
        return <PromptBottomLayout {...layoutProps} />;
      case "right-left":
        return <RightLeftLayout {...layoutProps} />;
      case "prompt-top":
        return <PromptTopLayout {...layoutProps} />;
      default:
        return <PromptBottomLayout {...layoutProps} />;
    }
  };

  // Show loading state until config is ready
  if (!configLoaded && !designConfig) {
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

  // Full widget with layout
  return (
    <div 
      className={componentId} 
      ref={containerRef} 
      style={{ 
        height: '100%', 
        width: '100%',
        padding: !fullPage ? `${config.container_padding_top || 24}px ${config.container_padding_right || 24}px ${config.container_padding_bottom || 24}px ${config.container_padding_left || 24}px` : '0',
        boxSizing: 'border-box'
      }}
    >
      <WidgetLayout
        config={config}
        promptSection={<div />} // Not used anymore
        imagesSection={<div />} // Not used anymore  
        className={className}
        fullPage={true} // Always true so WidgetLayout doesn't add its own padding
        deployment={deployment}
      >
        {getLayoutComponent()}
      </WidgetLayout>
    </div>
  );
}