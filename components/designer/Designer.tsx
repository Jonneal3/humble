"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/lib/hooks";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Smartphone } from "lucide-react";
import { defaultDesignSettings, DesignSettings } from "@/types/design";
import debounce from "lodash/debounce";
import { WidgetPageView } from "@/components/designer/WidgetPageView";
import { SettingsTab } from "./SettingsTab";
import { BrandingTab } from "./BrandingTab";
import { DesignTab } from "./DesignTab";
import { LaunchTab } from "./LaunchTab";
import Link from "next/link";

interface DesignerProps {
  instanceId: string;
}

export default function Designer({ instanceId }: DesignerProps) {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const previewContainerRef = React.useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState<DesignSettings>(defaultDesignSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'iframe'>('desktop');
  const [instance, setInstance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track which sections are open in each tab
  const [openSections, setOpenSections] = useState<Record<string, Record<string, boolean>>>({
    settings: {
      'instance-info': true,
      'service-config': false,
      'usage-limits': false,
      'advanced': false
    },
    branding: {
      'header-branding': true
    },
    design: {
      'color-presets': true,
      'overall-style': true,
      'layout': false,
      'input-section': true,
      'uploader': false,
      'prompt': false,
      'suggestions': false,
      'gallery': false
    },
    launch: {}
  });

  const toggleSection = (tab: string, section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [section]: !prev[tab]?.[section]
      }
    }));
  };

  // Load initial data
  useEffect(() => {
    const loadInstanceData = async () => {
      try {
        const { data: instance, error } = await supabase
          .from("instances")
          .select("*")
          .eq("id", instanceId)
          .single();

        if (error) {
          throw error;
        }

        if (instance?.config) {
          const mergedConfig = { ...defaultDesignSettings, ...instance.config };
          setConfig(mergedConfig);
          setInstance(instance);
        } else if (instance) {
          setInstance(instance);
        }
      } catch (error) {
        console.error('Error loading instance:', error);
        toast({
          title: "Error loading settings",
          description: "Failed to load instance settings. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadInstanceData();
  }, [instanceId, supabase, toast]);

  // Prevent body scrolling when design interface is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Detect mobile viewport size for layout optimization indicator
  useEffect(() => {
    const checkMobileView = () => {
      // Use 768px to match the actual mobile breakpoint used in Widget component
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Debounced save function with error handling
  const debouncedSave = debounce(async (newConfig: DesignSettings) => {
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('instances')
        .update({ config: newConfig })
        .eq('id', instanceId);

      if (error) {
        throw error;
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveStatus('error');
      toast({
        title: "Error saving settings",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, 1000);

  // Debounced instance save function
  const debouncedInstanceSave = debounce(async (updates: any) => {
    setSaveStatus('saving');
    try {
      // First update the instance data
      const { data: updateData, error: updateError } = await supabase
        .from('instances')
        .update(updates)
        .eq('id', instanceId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating instance:', updateError);
        throw updateError;
      }

      // If we got data back from the update, use it directly
      if (updateData) {
        console.log('Successfully updated instance:', updateData);
        setInstance(updateData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return;
      }

      // If no data returned from update, fetch the latest
      const { data: fetchData, error: fetchError } = await supabase
        .from('instances')
        .select('*')
        .eq('id', instanceId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated instance:', fetchError);
        throw fetchError;
      }

      if (fetchData) {
        console.log('Fetched updated instance:', fetchData);
        setInstance(fetchData);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error in debouncedInstanceSave:', error);
      setSaveStatus('error');
      
      // Only show toast for actual errors, not for successful updates
      if (error instanceof Error && error.message !== 'No rows found') {
        toast({
          title: "Error saving settings",
          description: error.message || "Failed to save your changes. Please try again.",
          variant: "destructive",
        });
      } else {
        // If it was a successful update but no data returned, just set to saved
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }
  }, 1000);

  // Update config helper with validation
  const updateConfig = (updates: Partial<DesignSettings>) => {
    if (!updates || typeof updates !== 'object') {
      console.error('Invalid config updates:', updates);
      return;
    }
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    debouncedSave(newConfig);
  };

  // Update instance info with validation
  const updateInstance = async (updates: any) => {
    if (!updates || typeof updates !== 'object') {
      console.error('Invalid instance updates:', updates);
      return;
    }

    console.log('Updating instance with:', updates);

    // Optimistically update the local state
    setInstance((prev: any) => {
      if (!prev) return prev;
      const newInstance = { ...prev, ...updates };
      console.log('New instance state:', newInstance);
      return newInstance;
    });

    // Trigger the debounced save
    debouncedInstanceSave(updates);
  };

  // Prevent any rendering until we're initialized
  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading design settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex bg-background">
      {/* Sidebar */}
      <div className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${isSidebarExpanded ? 'w-[400px]' : 'w-12'}`}>
        {/* Header */}
        <div className={`${isSidebarExpanded ? 'p-4' : 'p-2'} border-b border-border flex-shrink-0 transition-all duration-300`}>
          {isSidebarExpanded ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Link href="/designer-instances" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-1 flex items-center gap-1">
                    <ChevronLeft className="h-3 w-3" />
                    Back to Home
                  </Link>
                  <h1 className="text-lg font-semibold">Design Studio</h1>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${
                      saveStatus === 'saving' ? 'bg-yellow-500' :
                      saveStatus === 'saved' ? 'bg-green-500' :
                      saveStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                    {saveStatus === 'saving' ? 'Saving...' :
                     saveStatus === 'saved' ? 'Saved' :
                     saveStatus === 'error' ? 'Error' : 'Ready'}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    className="h-6 px-2 text-xs"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    className="h-6 px-2 text-xs"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'iframe' ? 'default' : 'outline'}
                    className="h-6 px-2 text-xs"
                    onClick={() => setPreviewMode('iframe')}
                    title="Iframe Embed Preview"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Design Controls */}
        {isSidebarExpanded && (
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="px-4 py-4 pb-24">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full h-8 mb-4 bg-muted p-1 rounded-lg">
                    <TabsTrigger value="settings" className="flex-1 text-xs px-2 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
                      Settings
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="flex-1 text-xs px-2 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
                      Branding
                    </TabsTrigger>
                    <TabsTrigger value="design" className="flex-1 text-xs px-2 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
                      Design
                    </TabsTrigger>
                    <TabsTrigger value="launch" className="flex-1 text-xs px-2 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
                      Launch
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-0">
                    <TabsContent value="settings" className="mt-0">
                      <SettingsTab
                        instance={instance}
                        updateInstance={updateInstance}
                        openSections={openSections}
                        toggleSection={toggleSection}
                      />
                    </TabsContent>

                    <TabsContent value="branding" className="mt-0">
                      <BrandingTab
                        config={config}
                        updateConfig={updateConfig}
                        openSections={openSections}
                        toggleSection={toggleSection}
                      />
                    </TabsContent>

                    <TabsContent value="design" className="mt-0">
                      <DesignTab
                        config={config}
                        updateConfig={updateConfig}
                        openSections={openSections}
                        toggleSection={toggleSection}
                      />
                    </TabsContent>

                    <TabsContent value="launch" className="mt-0">
                      <LaunchTab
                        instanceId={instanceId}
                        config={config}
                        openSections={openSections}
                        toggleSection={toggleSection}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Preview Content */}
        <div className="flex-1 min-h-0 relative bg-background overflow-hidden" ref={previewContainerRef}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center overflow-auto">
            <WidgetPageView
              instanceId={instanceId}
              liveConfig={config}
              previewMode={previewMode}
              deployment={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}