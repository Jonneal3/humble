"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/lib/hooks";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
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
  const [previewMode, setPreviewMode] = useState<'iframe' | 'full'>('full');
  const [instance, setInstance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');
  
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
      'overall-style': false,
      'layout': false,
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
      const { data: instance } = await supabase
        .from("instances")
        .select("*")
        .eq("id", instanceId)
        .single();

      if (instance?.config) {
        const mergedConfig = { ...defaultDesignSettings, ...instance.config };
        setConfig(mergedConfig);
        setInstance(instance);
      } else if (instance) {
        setInstance(instance);
      }
    };

    loadInstanceData();
  }, [instanceId, supabase]);

  // Prevent body scrolling when design interface is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Debounced save function
  const debouncedSave = debounce(async (newConfig: DesignSettings) => {
    setSaveStatus('saving');
    const { error } = await supabase
      .from('instances')
      .update({ config: newConfig })
      .eq('id', instanceId);

    if (error) {
      setSaveStatus('error');
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, 1000);

  // Update config helper
  const updateConfig = (updates: Partial<DesignSettings>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    debouncedSave(newConfig);
  };

  // Update instance info
  const updateInstance = async (updates: any) => {
    const { error } = await supabase
      .from('instances')
      .update(updates)
      .eq('id', instanceId);
    
    if (!error) {
      setInstance({ ...instance, ...updates });
    }
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden fixed inset-0" style={{ paddingTop: '40px' }}>
      {/* Sidebar */}
      <div className={`${isSidebarExpanded ? 'w-80' : 'w-12'} transition-all duration-300 border-r border-border bg-card flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
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
          >
            {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Design Controls */}
        {isSidebarExpanded && (
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto overscroll-contain p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

                <TabsContent value="settings">
                  <SettingsTab
                    instance={instance}
                    updateInstance={updateInstance}
                    openSections={openSections}
                    toggleSection={toggleSection}
                  />
                </TabsContent>

                <TabsContent value="branding">
                  <BrandingTab
                    config={config}
                    updateConfig={updateConfig}
                    openSections={openSections}
                    toggleSection={toggleSection}
                  />
                </TabsContent>

                <TabsContent value="design">
                  <DesignTab
                    config={config}
                    updateConfig={updateConfig}
                    openSections={openSections}
                    toggleSection={toggleSection}
                  />
                </TabsContent>

                <TabsContent value="launch">
                  <LaunchTab
                    instanceId={instanceId}
                    config={config}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Header */}
        <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Preview</h2>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="flex-1 bg-background overflow-hidden">
          {previewMode === 'iframe' ? (
            <div className="h-full flex items-center justify-center p-4">
              <div 
                className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden"
                style={{ 
                  height: config.iframe_height || '600px',
                  borderRadius: `${config.iframe_border_radius || 12}px`,
                  border: config.iframe_border ? `${config.iframe_border_width || 1}px solid ${config.iframe_border_color || '#e5e7eb'}` : 'none',
                  boxShadow: {
                    none: "none",
                    subtle: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    medium: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    glow: "0 0 15px rgba(99, 102, 241, 0.3)",
                  }[config.iframe_shadow || 'medium']
                }}
              >
                <WidgetPageView
                  instanceId={instanceId}
                  liveConfig={config}
                  className="h-full w-full"
                />
              </div>
            </div>
          ) : (
            <WidgetPageView
              instanceId={instanceId}
              liveConfig={config}
              className="h-full w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
} 