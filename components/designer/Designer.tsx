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

interface DesignerProps {
  instanceId: string;
}

export default function Designer({ instanceId }: DesignerProps) {
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [config, setConfig] = useState<DesignSettings>(defaultDesignSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [previewMode, setPreviewMode] = useState<'iframe' | 'full' | 'mobile'>('full');
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
    try {
      const { error } = await supabase
        .from('instances')
        .update(updates)
        .eq('id', instanceId);
      
      if (error) {
        throw error;
      }

      setInstance({ ...instance, ...updates });
    } catch (error) {
      console.error('Error updating instance:', error);
      toast({
        title: "Error updating settings",
        description: "Failed to update instance settings. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className="w-full h-full flex bg-background">
      {/* Sidebar */}
      <div className={`${isSidebarExpanded ? 'w-80' : 'w-12'} h-full flex-shrink-0 transition-all duration-300 border-r border-border bg-card flex flex-col`}>
        {/* Header */}
        <div className={`${isSidebarExpanded ? 'p-4' : 'p-2'} border-b border-border flex items-center justify-between flex-shrink-0 transition-all duration-300`}>
          {isSidebarExpanded && (
            <div>
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
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`${!isSidebarExpanded ? 'w-8 h-8 p-0' : ''} transition-all duration-300`}
          >
            {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Design Controls */}
        {isSidebarExpanded && (
          <div className="flex-1 overflow-y-auto">
            <div className="h-full px-4 py-4">
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
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Preview Header */}
        <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Preview</h2>
            {previewMode === 'mobile' && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md px-2 py-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Mobile: All layouts use prompt-top style
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant={previewMode === 'iframe' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('iframe')}
              className="h-7 text-xs"
            >
              <Minimize2 className="h-3 w-3 mr-1" />
              Iframe
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="h-7 text-xs"
            >
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile
            </Button>
            <Button
              variant={previewMode === 'full' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('full')}
              className="h-7 text-xs"
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              Full Page
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-background">
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {previewMode === 'iframe' ? (
              <div className="relative">
                {/* Preview Label */}
                <div className="absolute -top-8 left-0 text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Iframe Preview - This is how your widget will appear when embedded
                </div>
                
                {/* Iframe Container with Visual Context */}
                <div 
                  className="relative shadow-2xl transition-all duration-300 hover:shadow-3xl"
                  style={{ 
                    width: config.iframe_width || '100%',
                    maxWidth: '1000px',
                    height: config.iframe_height || '600px',
                    borderRadius: `${config.iframe_border_radius ?? 12}px`,
                    border: config.iframe_border ? `${config.iframe_border_width ?? 1}px solid ${config.iframe_border_color || '#e5e7eb'}` : 'none',
                    boxShadow: config.iframe_shadow === 'none' ? "0 0 0 1px rgba(0,0,0,0.05)" :
                              config.iframe_shadow === 'subtle' ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 0 0 1px rgba(0,0,0,0.05)" :
                              config.iframe_shadow === 'medium' ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)" :
                              config.iframe_shadow === 'large' ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)" :
                              "0 0 25px rgba(99, 102, 241, 0.4), 0 8px 32px rgba(99, 102, 241, 0.15)"
                  }}
                >
                  <WidgetPageView
                    instanceId={instanceId}
                    liveConfig={config}
                    fullPage={false}
                  />
                </div>
              </div>
            ) : previewMode === 'mobile' ? (
              <div className="relative">
                {/* Preview Label */}
                <div className="absolute -top-12 left-0 right-0 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Mobile Preview - All layouts automatically use prompt-top style on mobile
                  </div>
                </div>
                
                {/* Mobile Container */}
                <div 
                  className="relative shadow-2xl transition-all duration-300 hover:shadow-3xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700"
                  style={{ 
                    width: '400px',
                    height: '600px'
                  }}
                >
                  {/* Mobile device frame styling */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-full z-10"></div>
                  
                  <div className="h-full w-full pt-8 pb-4 px-2">
                    <WidgetPageView
                      instanceId={instanceId}
                      liveConfig={{
                        ...config,
                        // Force prompt-top layout for mobile preview to show accurate mobile behavior
                        layout_mode: 'prompt-top'
                      }}
                      fullPage={false}
                      deployment={true}
                    />
                  </div>
                </div>
                
                {/* Mobile Info Panel */}
                <div className="absolute -bottom-16 left-0 right-0 text-center">
                  <div className="inline-flex items-center gap-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
                    <span>Width: 400px (Mobile)</span>
                    <span>Layout: Prompt-Top (Auto-Applied)</span>
                    <span>Responsive: ✓</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full">
                <div className="h-full w-full absolute inset-0">
                  <WidgetPageView
                    instanceId={instanceId}
                    liveConfig={config}
                    fullPage={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}