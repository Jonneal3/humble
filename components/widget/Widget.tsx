"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getRandomSuggestions, Suggestion } from "@/lib/suggestions";
import { DesignSettings, defaultDesignSettings, WidgetStyle, stylePresets, loadGoogleFont } from "@/types/design";
import { WidgetLayout } from "./WidgetLayout";
import { Spinner } from "../ui/spinner";
import { AutoDemoOverlay } from "./AutoDemoOverlay";
import { cn } from "@/lib/utils";

// Import layout components
import { LeftRightLayout } from "./layouts/LeftRightLayout";
import { RightLeftLayout } from "./layouts/RightLeftLayout";
import { PromptBottomLayout } from "./layouts/PromptBottomLayout";
import { PromptTopLayout } from "./layouts/PromptTopLayout";
import { MobileLayout } from "./layouts/MobileLayout";

interface DatabaseInstance {
  id: string;
  submission_limit_enabled: boolean;
  max_submissions_per_session: number;
  current_submissions: number;
  last_submission_at: string | null;
  config?: DesignSettings;
  [key: string]: any;
}

interface InstanceData {
  id: string;
  submission_limit_enabled: boolean;
  max_submissions_per_session: number;
  current_submissions: number;
  last_submission_at: string | null;
  config?: DesignSettings;
  [key: string]: any;
}

interface WidgetProps {
  instanceId: string;
  controlsOnly?: boolean;
  designConfig?: DesignSettings;
  className?: string;
  fullPage?: boolean;
  deployment?: boolean;
  containerWidth?: number;
  containerHeight?: number;
  instanceData?: InstanceData;
}

export function Widget({ 
  instanceId, 
  controlsOnly = false, 
  designConfig, 
  className, 
  fullPage = false, 
  deployment = false,
  containerWidth: providedContainerWidth,
  containerHeight: providedContainerHeight,
  instanceData: providedInstanceData
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
  const [instanceData, setInstanceData] = useState<InstanceData | null>(providedInstanceData || null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isSubmissionLimitReached, setIsSubmissionLimitReached] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClientComponentClient();
  const componentId = React.useMemo(() => `widget-${instanceId}`, [instanceId]);

  // Initialize submission count from session storage
  useEffect(() => {
    if (!isClient) return;
    const count = sessionStorage.getItem(`submission_count_${instanceId}`);
    const initialCount = count ? parseInt(count, 10) : 0;
    console.log('Initializing submission count:', initialCount);
    setSubmissionCount(initialCount);
  }, [isClient, instanceId]);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      console.log('Using provided container width:', providedContainerWidth);
      setContainerWidth(providedContainerWidth);
    } else if (containerRef.current) {
      console.log('Setting up container width observer');
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          console.log('Container width changed:', width);
          setContainerWidth(width);
        }
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [providedContainerWidth]);

  // Load configuration from database if not provided
  useEffect(() => {
    const loadInstanceData = async () => {
      try {
        console.log('Loading instance data for:', instanceId);
        const { data: instance, error } = await supabase
          .from("instances")
          .select("*")
          .eq("id", instanceId)
          .single();

        if (error) {
          console.error('Error loading instance:', error);
          // Even on error, merge with defaults
          const mergedConfig = {
            ...defaultDesignSettings,
            ...(designConfig || {})
          };
          console.log('Using merged config after error:', mergedConfig);
          setConfig(mergedConfig);
          setConfigLoaded(true);
          return;
        }

        console.log('Loaded instance data:', instance);
        // Store instance data for rate limiting
        const typedInstance: InstanceData = {
          id: (instance as DatabaseInstance).id,
          submission_limit_enabled: Boolean((instance as DatabaseInstance).submission_limit_enabled),
          max_submissions_per_session: Number((instance as DatabaseInstance).max_submissions_per_session) || 5,
          current_submissions: 0, // We don't use this anymore
          last_submission_at: null, // We don't use this anymore
          config: (instance as DatabaseInstance).config
        };
        
        setInstanceData(typedInstance);

        // Always merge with default settings to ensure all properties are set
        const mergedConfig = {
          ...defaultDesignSettings,
          ...(instance?.config || {}),
          ...(designConfig || {}) // Allow provided config to override instance config
        };
        console.log('Final merged design config:', mergedConfig);
        setConfig(mergedConfig);
        setConfigLoaded(true);

        // Initialize submission count from session storage
        const initialCount = getSubmissionCount();
        console.log('Initial submission count from session storage:', initialCount);
        setSubmissionCount(initialCount);

        // Update submission limit state
        if (typedInstance.submission_limit_enabled) {
          const maxSubmissions = typedInstance.max_submissions_per_session;
          console.log('Initial submission limit state:', {
            enabled: true,
            max: maxSubmissions,
            current: initialCount
          });
          setIsSubmissionLimitReached(initialCount >= maxSubmissions);
        } else {
          setIsSubmissionLimitReached(false);
        }
      } catch (error) {
        console.error('Error in loadInstanceData:', error);
        // Even on error, merge with defaults
        const mergedConfig = {
          ...defaultDesignSettings,
          ...(designConfig || {})
        };
        console.log('Using merged config after error:', mergedConfig);
        setConfig(mergedConfig);
        setConfigLoaded(true);
      }
    };

    // Always load instance data to get the latest config
    loadInstanceData();
  }, [instanceId, supabase, designConfig]);

  // Set up real-time subscription for instance updates
  useEffect(() => {
    if (!instanceId) return;

    console.log('Setting up instance subscription for:', instanceId);
    const channel = supabase
      .channel(`instance-${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'instances',
          filter: `id=eq.${instanceId}`
        },
        (payload) => {
          console.log('Instance updated via subscription:', payload);
          const typedInstance: InstanceData = {
            id: (payload.new as DatabaseInstance).id,
            submission_limit_enabled: Boolean((payload.new as DatabaseInstance).submission_limit_enabled),
            max_submissions_per_session: Number((payload.new as DatabaseInstance).max_submissions_per_session) || 5,
            current_submissions: 0, // We don't use this anymore
            last_submission_at: null, // We don't use this anymore
            config: (payload.new as DatabaseInstance).config
          };
          
          // Update instance data
          setInstanceData(typedInstance);
          
          // Update submission limit state
          if (typedInstance.submission_limit_enabled) {
            const maxSubmissions = typedInstance.max_submissions_per_session;
            const currentCount = getSubmissionCount();
            console.log('Updating submission limit state:', {
              enabled: true,
              max: maxSubmissions,
              current: currentCount
            });
            // Only set limit reached if we're actually at the limit
            setIsSubmissionLimitReached(currentCount >= maxSubmissions);
          } else {
            // Reset local storage and state if limits are disabled
            sessionStorage.removeItem(`submission_count_${instanceId}`);
            setIsSubmissionLimitReached(false);
            setSubmissionCount(0);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up instance subscription');
      supabase.removeChannel(channel);
    };
  }, [instanceId, supabase]);

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
    
    // Handle explicit toggle off
    if (config.demo_enabled === false) {
      setShowDemo(false);
      localStorage.setItem(`widget-demo-${instanceId}`, 'true');
      return;
    }
    
    // When demo is explicitly enabled, reset the localStorage to ensure it shows
    if (config.demo_enabled === true) {
      localStorage.removeItem(`widget-demo-${instanceId}`);
      setShowDemo(true);
      return;
    }
    
    // Default behavior: only show if never seen before
    const hasSeenDemo = localStorage.getItem(`widget-demo-${instanceId}`);
    setShowDemo(!hasSeenDemo);
  }, [instanceId, deployment, config.demo_enabled, isClient]);

  const handleDemoDismiss = () => {
    setShowDemo(false);
    localStorage.setItem(`widget-demo-${instanceId}`, 'true');
  };

  const getSubmissionCount = () => {
    if (!isClient) return 0;
    const count = sessionStorage.getItem(`submission_count_${instanceId}`);
    const parsedCount = count ? parseInt(count, 10) : 0;
    console.log('Getting submission count:', { count, parsedCount });
    return parsedCount;
  };

  const incrementSubmissionCount = () => {
    const currentCount = getSubmissionCount();
    const newCount = currentCount + 1;
    console.log('Incrementing submission count:', { current: currentCount, new: newCount });
    sessionStorage.setItem(`submission_count_${instanceId}`, newCount.toString());
    setSubmissionCount(newCount);
  };

  const handlePromptSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;
    
    // Check submission limit - only if submission limit is enabled
    if (instanceData?.submission_limit_enabled) {
      const maxSubmissions = instanceData?.max_submissions_per_session || 5;
      const currentCount = getSubmissionCount();
      console.log('Checking submission limit:', { 
        current: currentCount, 
        max: maxSubmissions, 
        enabled: instanceData.submission_limit_enabled 
      });
      
      if (currentCount >= maxSubmissions) {
        console.log('Submission limit reached, blocking submission');
        setIsSubmissionLimitReached(true);
        alert(`You've reached the submission limit (${maxSubmissions} submissions per session). Please refresh the page to start a new session.`);
        return;
      }
    }
    
    // Increment submission count BEFORE attempting generation
    incrementSubmissionCount();
    
    // Check if limit is reached after incrementing
    if (instanceData?.submission_limit_enabled) {
      const maxSubmissions = instanceData?.max_submissions_per_session || 5;
      const newCount = getSubmissionCount();
      console.log('After increment, checking limit:', { newCount, max: maxSubmissions });
      if (newCount >= maxSubmissions) {
        setIsSubmissionLimitReached(true);
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          instanceId,
          referenceImages
        })
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      setGeneratedImages(data.images.map((url: string) => ({ image: url })));
      setPrompt('');
    } catch (error) {
      console.error('Error generating images:', error);
      // If generation fails, decrement the submission count
      const currentCount = getSubmissionCount();
      if (currentCount > 0) {
        const newCount = currentCount - 1;
        console.log('Decrementing submission count after error:', { current: currentCount, new: newCount });
        sessionStorage.setItem(`submission_count_${instanceId}`, newCount.toString());
        setSubmissionCount(newCount);
        setIsSubmissionLimitReached(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageData: string | null) => {
    if (imageData) {
      setReferenceImages(prev => [...prev, imageData]);
    }
  };

  const handleImageRemove = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setPrompt(suggestion.prompt);
  };

  const refreshSuggestions = () => {
    setSuggestions(getRandomSuggestions(config.suggestions_count || 4));
  };

  // Layout component selector
  const getLayoutComponent = () => {
    console.log('Getting layout component with config:', config);
    console.log('Container width:', containerWidth);
    console.log('Is client:', isClient);
    console.log('Is config loaded:', configLoaded);

    // Smart responsive scaling - creates scaled design settings based on container width
    const getResponsiveConfig = (originalConfig: DesignSettings, containerWidth: number): DesignSettings => {
      console.log('Getting responsive config for width:', containerWidth);
      // Calculate scale factor based on container width
      // 1.0 at 1200px+, scales down to 0.5 at 300px (more aggressive)
      const minWidth = 300;
      const maxWidth = 1200;
      const minScale = 0.5; // More aggressive minimum scale
      const maxScale = 1.0;
      
      const scaleFactor = Math.max(minScale, Math.min(maxScale, 
        minScale + (maxScale - minScale) * (containerWidth - minWidth) / (maxWidth - minWidth)
      ));

      console.log('Scale factor:', scaleFactor);

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
      
      console.log('Scaled config:', scaledConfig);
      return scaledConfig;
    };

    const responsiveConfig = getResponsiveConfig(config, containerWidth);

    const layoutProps = {
      config: responsiveConfig,
      prompt,
      setPrompt,
      isLoading,
      suggestions,
      referenceImages,
      generatedImages,
      fullPage,
      deployment,
      containerWidth,
      onPromptSubmit: () => handlePromptSubmit(prompt),
      onSuggestionClick: handleSuggestionClick,
      onImageUpload: handleImageUpload,
      onImageRemove: handleImageRemove,
      onRefreshSuggestions: refreshSuggestions,
      isSubmissionLimitReached,
      submissionCount,
      maxSubmissions: instanceData?.max_submissions_per_session || 5
    };

    // Use mobile layout for tablet and smaller screens (< 1024px)
    const isTabletOrSmaller = containerWidth < 1024;
    console.log('Layout decision:', {
      containerWidth,
      isTabletOrSmaller,
      configLayoutMode: config.layout_mode,
      isClient,
      configLoaded
    });

    if (isTabletOrSmaller) {
      console.log('Using mobile layout');
      return <MobileLayout {...layoutProps} />;
    }

    // Use configured layout for larger screens
    console.log('Using configured layout:', config.layout_mode);
    switch (config.layout_mode) {
      case "left-right":
        return <LeftRightLayout {...layoutProps} />;
      case "prompt-bottom":
        return <PromptBottomLayout {...layoutProps} />;
      case "right-left":
        return <RightLeftLayout {...layoutProps} />;
      case "prompt-top":
        return <PromptTopLayout {...layoutProps} />;
      case "mobile-optimized":
        return <MobileLayout {...layoutProps} />;
      default:
        console.log('Using default prompt-bottom layout');
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

  const style = {
    backgroundColor: config.background_color || '#ffffff',
    height: fullPage ? '100%' : '100%',
    maxWidth: config.max_width ? `${config.max_width}px` : '100vw',
    maxHeight: config.max_height ? `${config.max_height}px` : '100%'
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        className
      )}
      style={style}
    >
      {/* Debug Counter - Temporary */}
      <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg z-50 text-sm">
        <div>Submit Button Clicks: {submissionCount}/{instanceData?.max_submissions_per_session || 5}</div>
        <div>Limit Enabled: {instanceData?.submission_limit_enabled ? 'Yes' : 'No'}</div>
        <div>Limit Reached: {isSubmissionLimitReached ? 'Yes' : 'No'}</div>
        <div>Max Submissions: {instanceData?.max_submissions_per_session || 5}</div>
      </div>

      {/* Demo Overlay */}
      {showDemo && (
        <AutoDemoOverlay
          onDismiss={handleDemoDismiss}
          config={config}
        />
      )}

      {/* Main Widget Content */}
      {getLayoutComponent()}
    </div>
  );
}