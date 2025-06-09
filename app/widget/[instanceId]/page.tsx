"use client";

import { Widget } from "@/components/widget/Widget";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { defaultDesignSettings, LayoutMode } from "@/types/design";
import { notFound } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Props {
  params: {
    instanceId: string;
  };
}

export default function WidgetPage({ params }: Props) {
  const supabase = createClientComponentClient();
  const instanceId = params.instanceId;
  const [designConfig, setDesignConfig] = useState(defaultDesignSettings);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const originalLayoutRef = useRef<LayoutMode>(defaultDesignSettings.layout_mode || "prompt-bottom");

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load instance config
  useEffect(() => {
    const loadInstanceData = async () => {
      try {
        const { data: instance, error } = await supabase
          .from("instances")
          .select("config")
          .eq("id", instanceId)
          .single();

        if (error) {
          // If instance doesn't exist, show 404
          if (error.code === 'PGRST116') {
            notFound();
          }
          console.error("Error loading instance config:", error);
        } else {
          if (instance?.config) {
            // Store the original layout mode
            originalLayoutRef.current = instance.config.layout_mode || defaultDesignSettings.layout_mode || "prompt-bottom";
            // Merge default settings with instance config
            setDesignConfig({
              ...defaultDesignSettings,
              ...instance.config,
            });
          }
        }
      } catch (error) {
        console.error("Error loading instance config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstanceData();
  }, [instanceId, supabase]);

  // Track container width for responsive layout
  useEffect(() => {
    if (!containerRef.current || !isMounted) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        
        // Switch to mobile layout if width is below threshold
        if (width < 768 && designConfig.layout_mode !== "prompt-top") {
          setDesignConfig(prev => ({
            ...prev,
            layout_mode: "prompt-top" as LayoutMode
          }));
        }
        // Restore original layout if width is above threshold and currently in mobile layout
        else if (width >= 768 && designConfig.layout_mode === "prompt-top") {
          setDesignConfig(prev => ({
            ...prev,
            layout_mode: originalLayoutRef.current
          }));
        }
      }
    };

    // Initial width
    updateWidth();

    // Setup resize observer
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
        
        // Switch to mobile layout if width is below threshold
        if (width < 768 && designConfig.layout_mode !== "prompt-top") {
          setDesignConfig(prev => ({
            ...prev,
            layout_mode: "prompt-top" as LayoutMode
          }));
        }
        // Restore original layout if width is above threshold and currently in mobile layout
        else if (width >= 768 && designConfig.layout_mode === "prompt-top") {
          setDesignConfig(prev => ({
            ...prev,
            layout_mode: originalLayoutRef.current
          }));
        }
      }
    });
    
    observer.observe(containerRef.current);

    // Also listen for window resize events
    window.addEventListener('resize', updateWidth);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [isMounted, designConfig.layout_mode]);

  if (isLoading || !isMounted) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden">
      <Widget 
        instanceId={instanceId}
        controlsOnly={false}
        designConfig={designConfig}
        fullPage={false}
        deployment={true}
        containerWidth={containerWidth}
      />
    </main>
  );
} 