"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getRandomSuggestions, Suggestion } from "@/lib/suggestions";
import { DesignSettings, defaultDesignSettings, WidgetStyle, stylePresets, loadGoogleFont } from "@/types/design";
import { WidgetLayout } from "./WidgetLayout";
import { Spinner } from "../ui/spinner";
import { AutoDemoOverlay, DemoConfig } from "./AutoDemoOverlay";

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
  containerWidth?: number;
}

export function Widget({ 
  instanceId, 
  controlsOnly = false, 
  designConfig, 
  className, 
  fullPage = false, 
  deployment = false,
  containerWidth: providedContainerWidth
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>(getRandomSuggestions(4));
  const [prompt, setPrompt] = useState("");
  const [configLoaded, setConfigLoaded] = useState(!!designConfig);
  const [containerWidth, setContainerWidth] = useState(1024);
  const [showDemo, setShowDemo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClientComponentClient();
  const componentId = React.useMemo(() => `widget-${instanceId}`, [instanceId]);

  useEffect(() => {
    setIsClient(true);
    // Set initial viewport height
    setViewportHeight(window.innerHeight);

    // Listen for viewport height changes
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (providedContainerWidth) {
      setContainerWidth(providedContainerWidth);
    } else if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [providedContainerWidth]);

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

  // Check if demo should be shown - only run on client
  useEffect(() => {
    if (!isClient || !deployment) return;
    if (config.demo_enabled === false) {
      setShowDemo(false);
      return;
    }
    
    const hasSeenDemo = localStorage.getItem(`widget-demo-${instanceId}`);
    if (!hasSeenDemo) {
      setShowDemo(true);
    }
  }, [instanceId, deployment, config.demo_enabled, isClient]);

  const handleDemoDismiss = () => {
    setShowDemo(false);
    localStorage.setItem(`widget-demo-${instanceId}`, 'true');
  };

  const demoConfig: DemoConfig = {
    uploadMessage: config.demo_upload_message || "Upload your reference images to guide the AI",
    generationMessage: config.demo_generation_message || "Your AI-generated images will appear here"
  };

  // Event handlers
  const refreshSuggestions = () => {
    setSuggestions(getRandomSuggestions(config.suggestions_count || 4));
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

    // Always use prompt-top layout on mobile screens (< 768px)
    const isMobileWidth = containerWidth < 768;
    if (isMobileWidth) {
      return <PromptTopLayout {...layoutProps} />;
    }

    // Use configured layout for desktop/tablet screens
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

  // Full widget with layout
  if (!isClient || !configLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center w-full" 
      style={{ 
        backgroundColor: config.background_color || '#ffffff',
        height: fullPage ? `${viewportHeight}px` : '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      <div 
        className="relative w-full"
        style={{ 
          height: fullPage ? `${viewportHeight}px` : '100%',
          padding: containerWidth < 768 ? '12px' : `${config.container_padding_top || 24}px ${config.container_padding_right || 24}px ${config.container_padding_bottom || 24}px ${config.container_padding_left || 24}px`,
          boxSizing: 'border-box',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%'
        }}
      >
        <div className="absolute inset-0 flex flex-col" style={{ 
          padding: containerWidth < 768 ? '12px' : `${config.container_padding_top || 24}px ${config.container_padding_right || 24}px ${config.container_padding_bottom || 24}px ${config.container_padding_left || 24}px`,
          maxWidth: '100%',
          overflowX: 'hidden'
        }}>
          {isClient && showDemo && <AutoDemoOverlay onDismiss={handleDemoDismiss} config={demoConfig} />}
          <WidgetLayout
            config={config}
            className={className}
            fullPage={fullPage}
            deployment={deployment}
          >
            {getLayoutComponent()}
          </WidgetLayout>
        </div>
      </div>
    </div>
  );
}