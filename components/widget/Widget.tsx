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
  // State
  const [config, setConfig] = useState<DesignSettings>(designConfig || defaultDesignSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Array<{ image: string | null }>>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(getRandomSuggestions(6));
  const [prompt, setPrompt] = useState("");
  const [configLoaded, setConfigLoaded] = useState(!!designConfig);
  
  const supabase = createClientComponentClient();
  const componentId = React.useMemo(() => `widget-${instanceId}`, [instanceId]);

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
    const layoutProps = {
      config,
      prompt,
      setPrompt,
      isLoading,
      suggestions,
      referenceImages,
      generatedImages,
      fullPage,
      deployment,
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
    <div className={componentId}>
      <WidgetLayout
        config={config}
        promptSection={<div />} // Not used anymore
        imagesSection={<div />} // Not used anymore  
        className={className}
        fullPage={fullPage}
        deployment={deployment}
      >
        {getLayoutComponent()}
      </WidgetLayout>
    </div>
  );
}