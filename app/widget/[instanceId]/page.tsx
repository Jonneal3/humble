"use client";

import { Widget } from "@/components/widget/Widget";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { defaultDesignSettings, LayoutMode, DesignSettings } from "@/types/design";
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
  const [instanceData, setInstanceData] = useState<any>(null);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load instance data
  useEffect(() => {
    const loadInstanceData = async () => {
      console.log('Starting to load instance data for:', instanceId);
      try {
        const { data: instance, error } = await supabase
          .from("instances")
          .select("*")
          .eq("id", instanceId)
          .single();

        if (error) {
          // If instance doesn't exist, show 404
          if (error.code === 'PGRST116') {
            console.error('Instance not found:', instanceId);
            notFound();
          }
          console.error("Error loading instance:", error);
          // Even on error, ensure we have a valid config
          const mergedConfig: DesignSettings = {
            ...defaultDesignSettings,
            title_enabled: false, // Ensure title is disabled by default
            layout_mode: "prompt-bottom" as LayoutMode // Ensure we have a default layout
          };
          console.log('Using default config after error:', mergedConfig);
          setDesignConfig(mergedConfig);
          setInstanceData(null);
        } else {
          console.log('Successfully loaded instance:', instance);
          // Store the full instance data
          setInstanceData(instance);

          if (instance?.config) {
            console.log('Instance has config:', instance.config);
            // Merge default settings with instance config
            const mergedConfig: DesignSettings = {
              ...defaultDesignSettings,
              title_enabled: false, // Ensure title is disabled by default
              layout_mode: "prompt-bottom" as LayoutMode, // Ensure we have a default layout
              ...instance.config,
            };
            console.log('Merged config:', mergedConfig);
            setDesignConfig(mergedConfig);
          } else {
            console.log('No config found in instance, using defaults');
            const defaultConfig: DesignSettings = {
              ...defaultDesignSettings,
              title_enabled: false, // Ensure title is disabled by default
              layout_mode: "prompt-bottom" as LayoutMode // Ensure we have a default layout
            };
            setDesignConfig(defaultConfig);
          }
        }
      } catch (error) {
        console.error("Error loading instance:", error);
        // Even on error, ensure we have a valid config
        const mergedConfig: DesignSettings = {
          ...defaultDesignSettings,
          title_enabled: false, // Ensure title is disabled by default
          layout_mode: "prompt-bottom" as LayoutMode // Ensure we have a default layout
        };
        console.log('Using default config after error:', mergedConfig);
        setDesignConfig(mergedConfig);
        setInstanceData(null);
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
      }
    };

    // Initial width
    updateWidth();

    // Setup resize observer
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
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
  }, [isMounted]);

  if (isLoading || !isMounted) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log('Rendering widget with config:', designConfig);
  return (
    <main ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden">
      <Widget 
        instanceId={instanceId}
        controlsOnly={false}
        designConfig={designConfig}
        fullPage={false}
        deployment={true}
        containerWidth={containerWidth}
        instanceData={instanceData}
      />
    </main>
  );
} 