"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/lib/hooks";
import { Switch } from "../ui/switch";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Palette, Layout, Type, Image, Settings, ChevronDown } from "lucide-react";
import { defaultDesignSettings, DesignSettings, colorPresets, fontOptions, LayoutMode, BorderStyle, ShadowStyle } from "@/types/design";
import debounce from "lodash/debounce";
import { WidgetPageView } from "@/components/designer/WidgetPageView";

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
  const [embedCode, setEmbedCode] = useState<string | null>(null);
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
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Restore body scroll on cleanup
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

  // Helper components
  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    
    // Close color picker when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Simple color palette - organized and comprehensive
    const colorPalette = [
      // Grays & Blacks
      '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
      // Reds
      '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2',
      // Oranges
      '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fff7ed',
      // Yellows
      '#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a', '#fefce8', '#fffbeb',
      // Greens
      '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7', '#f0fdf4',
      // Blues
      '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#eff6ff', '#f0f9ff',
      // Purples
      '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e0e7ff', '#f3f4f6', '#faf5ff',
      // Pinks
      '#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3', '#fdf2f8'
    ];

    return (
      <div className="space-y-2 relative">
        <Label className="text-xs font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-12 rounded-md border border-input cursor-pointer transition-all hover:scale-105 shadow-sm"
              style={{ backgroundColor: value }}
            />
            {isOpen && (
              <div 
                className="absolute top-10 left-0 z-[9999] bg-white dark:bg-gray-800 border border-input rounded-lg shadow-xl p-3 w-72" 
                ref={colorPickerRef}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Color Grid */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color,
                        borderColor: value === color ? '#3b82f6' : '#e5e7eb'
                      }}
                      onClick={() => {
                        onChange(color);
                        setIsOpen(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Hex Input */}
                <div className="pt-2 border-t border-border">
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      let newValue = e.target.value;
                      if (!newValue.startsWith('#')) newValue = '#' + newValue;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                        onChange(newValue);
                      }
                    }}
                    className="h-8 text-xs font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}
          </div>
          <Input
            type="text"
            value={value}
            onChange={(e) => {
              let newValue = e.target.value;
              if (!newValue.startsWith('#')) newValue = '#' + newValue;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                onChange(newValue);
              }
            }}
            className="h-8 text-xs flex-1 font-mono"
            placeholder="#000000"
          />
        </div>
      </div>
    );
  };

  const NumberInput = ({ label, value, onChange, min = 0, max = 100, step = 1 }: { 
    label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; 
  }) => (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 text-xs"
        min={min}
        max={max}
        step={step}
      />
    </div>
  );

  const SelectInput = ({ label, value, onChange, options }: {
    label: string; value: string; onChange: (value: string) => void; 
    options: { value: string; label: string }[];
  }) => (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
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
                <div className="">
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

                    {/* SETTINGS TAB */}
                    <TabsContent value="settings" className="space-y-4 mt-2">
                      {/* Instance Information */}
                      <details 
                        className="group" 
                        open={openSections.settings?.['instance-info']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('settings', 'instance-info');
                          }}
                        >
                          <span>Instance Information</span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.settings?.['instance-info'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Instance Name</Label>
                            <Input
                              value={instance?.name || ''}
                              onChange={(e) => updateInstance({ name: e.target.value })}
                              placeholder="Enter instance name"
                              className="h-8 text-xs"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Description</Label>
                            <textarea
                              value={instance?.description || ''}
                              onChange={(e) => updateInstance({ description: e.target.value })}
                              placeholder="Enter instance description"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs h-16 resize-none"
                            />
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <SelectInput
                              label="Business Type"
                              value={instance?.business_type || ''}
                              onChange={(value) => updateInstance({ business_type: value })}
                              options={[
                                { value: "", label: "Select business type" },
                                { value: "personal", label: "Personal" },
                                { value: "business", label: "Business" },
                                { value: "agency", label: "Agency" },
                                { value: "other", label: "Other" }
                              ]}
                            />

                            <SelectInput
                              label="Template Style"
                              value={instance?.template_style || ''}
                              onChange={(value) => updateInstance({ template_style: value })}
                              options={[
                                { value: "", label: "Default" },
                                { value: "minimal", label: "Minimal" },
                                { value: "modern", label: "Modern" },
                                { value: "creative", label: "Creative" }
                              ]}
                            />

                            <SelectInput
                              label="Color Scheme"
                              value={instance?.color_scheme || ''}
                              onChange={(value) => updateInstance({ color_scheme: value })}
                              options={[
                                { value: "", label: "Default" },
                                { value: "light", label: "Light" },
                                { value: "dark", label: "Dark" },
                                { value: "auto", label: "Auto" }
                              ]}
                            />
                          </div>
                        </div>
                      </details>

                      {/* Service Configuration */}
                      <details 
                        className="group" 
                        open={openSections.settings?.['service-config']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('settings', 'service-config');
                          }}
                        >
                          <span>Service Configuration</span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.settings?.['service-config'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <SelectInput
                            label="AI Service Provider"
                            value={instance?.service_provider || ''}
                            onChange={(value) => updateInstance({ service_provider: value })}
                            options={[
                              { value: "", label: "Select service provider" },
                              { value: "openai", label: "OpenAI" },
                              { value: "replicate", label: "Replicate" },
                              { value: "stability", label: "Stability AI" },
                              { value: "midjourney", label: "Midjourney" },
                              { value: "custom", label: "Custom API" }
                            ]}
                          />

                          {instance?.service_provider && (
                            <>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium">API Key</Label>
                                <Input
                                  type="password"
                                  value={instance?.api_key || ''}
                                  onChange={(e) => updateInstance({ api_key: e.target.value })}
                                  placeholder="Enter your API key"
                                  className="h-8 text-xs"
                                />
                                <p className="text-xs text-muted-foreground">API key is encrypted and stored securely</p>
                              </div>

                              {instance?.service_provider === 'custom' && (
                                <div className="space-y-1">
                                  <Label className="text-xs font-medium">Custom API Endpoint</Label>
                                  <Input
                                    value={instance?.api_endpoint || ''}
                                    onChange={(e) => updateInstance({ api_endpoint: e.target.value })}
                                    placeholder="https://api.example.com/generate"
                                    className="h-8 text-xs"
                                  />
                                </div>
                              )}

                              <SelectInput
                                label="Default Model"
                                value={instance?.default_model || ''}
                                onChange={(value) => updateInstance({ default_model: value })}
                                options={
                                  instance?.service_provider === 'openai' ? [
                                    { value: "", label: "Select model" },
                                    { value: "dall-e-3", label: "DALL-E 3" },
                                    { value: "dall-e-2", label: "DALL-E 2" }
                                  ] : instance?.service_provider === 'replicate' ? [
                                    { value: "", label: "Select model" },
                                    { value: "sdxl", label: "Stable Diffusion XL" },
                                    { value: "sd-1.5", label: "Stable Diffusion 1.5" },
                                    { value: "kandinsky-2", label: "Kandinsky 2" }
                                  ] : instance?.service_provider === 'stability' ? [
                                    { value: "", label: "Select model" },
                                    { value: "stable-diffusion-xl", label: "Stable Diffusion XL" },
                                    { value: "stable-diffusion-v1-6", label: "Stable Diffusion v1.6" }
                                  ] : [
                                    { value: "", label: "Select model" },
                                    { value: "default", label: "Default Model" }
                                  ]
                                }
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <NumberInput
                                  label="Max Images Per Request"
                                  value={instance?.max_images || 4}
                                  onChange={(value) => updateInstance({ max_images: value })}
                                  min={1}
                                  max={10}
                                />
                                <NumberInput
                                  label="Request Timeout (seconds)"
                                  value={instance?.request_timeout || 30}
                                  onChange={(value) => updateInstance({ request_timeout: value })}
                                  min={10}
                                  max={120}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </details>

                      {/* Usage & Limits */}
                      <details 
                        className="group" 
                        open={openSections.settings?.['usage-limits']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('settings', 'usage-limits');
                          }}
                        >
                          <span>Usage & Limits</span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.settings?.['usage-limits'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Rate Limiting</Label>
                            <Switch
                              checked={instance?.rate_limiting_enabled ?? true}
                              onCheckedChange={(checked) => updateInstance({ rate_limiting_enabled: checked })}
                            />
                          </div>

                          {instance?.rate_limiting_enabled && (
                            <div className="grid grid-cols-2 gap-3">
                              <NumberInput
                                label="Requests per Hour"
                                value={instance?.requests_per_hour || 60}
                                onChange={(value) => updateInstance({ requests_per_hour: value })}
                                min={1}
                                max={1000}
                              />
                              <NumberInput
                                label="Requests per Day"
                                value={instance?.requests_per_day || 500}
                                onChange={(value) => updateInstance({ requests_per_day: value })}
                                min={1}
                                max={10000}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Require User Authentication</Label>
                            <Switch
                              checked={instance?.require_auth ?? false}
                              onCheckedChange={(checked) => updateInstance({ require_auth: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Content Moderation</Label>
                            <Switch
                              checked={instance?.content_moderation ?? true}
                              onCheckedChange={(checked) => updateInstance({ content_moderation: checked })}
                            />
                          </div>

                          <SelectInput
                            label="Content Filter Level"
                            value={instance?.content_filter_level || 'moderate'}
                            onChange={(value) => updateInstance({ content_filter_level: value })}
                            options={[
                              { value: "strict", label: "Strict" },
                              { value: "moderate", label: "Moderate" },
                              { value: "permissive", label: "Permissive" }
                            ]}
                          />
                        </div>
                      </details>

                      {/* Advanced Settings */}
                      <details 
                        className="group" 
                        open={openSections.settings?.['advanced']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('settings', 'advanced');
                          }}
                        >
                          <span>Advanced Settings</span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.settings?.['advanced'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Analytics</Label>
                            <Switch
                              checked={instance?.analytics_enabled ?? true}
                              onCheckedChange={(checked) => updateInstance({ analytics_enabled: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Store Generated Images</Label>
                            <Switch
                              checked={instance?.store_images ?? true}
                              onCheckedChange={(checked) => updateInstance({ store_images: checked })}
                            />
                          </div>

                          <SelectInput
                            label="Image Storage Duration"
                            value={instance?.image_retention_days || '30'}
                            onChange={(value) => updateInstance({ image_retention_days: value })}
                            options={[
                              { value: "7", label: "7 days" },
                              { value: "30", label: "30 days" },
                              { value: "90", label: "90 days" },
                              { value: "365", label: "1 year" },
                              { value: "forever", label: "Forever" }
                            ]}
                          />

                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Custom CSS</Label>
                            <textarea
                              value={instance?.custom_css || ''}
                              onChange={(e) => updateInstance({ custom_css: e.target.value })}
                              placeholder="/* Custom CSS styles */"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs h-20 resize-none font-mono"
                            />
                            <p className="text-xs text-muted-foreground">Advanced: Add custom CSS to override widget styles</p>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Webhook URL</Label>
                            <Input
                              value={instance?.webhook_url || ''}
                              onChange={(e) => updateInstance({ webhook_url: e.target.value })}
                              placeholder="https://yoursite.com/webhook"
                              className="h-8 text-xs"
                            />
                            <p className="text-xs text-muted-foreground">Optional: Receive notifications when images are generated</p>
                          </div>
                        </div>
                      </details>
                    </TabsContent>

                    {/* BRANDING TAB */}
                    <TabsContent value="branding" className="space-y-4 mt-2">
                      {/* Header Section */}
                      <details 
                        className="group" 
                        open={openSections.branding?.['header-branding']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('branding', 'header-branding');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Header & Branding
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.branding?.['header-branding'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Header</Label>
                            <Switch
                              checked={config.header_enabled ?? true}
                              onCheckedChange={(checked) => updateConfig({ header_enabled: checked })}
                            />
                          </div>
                          
                          {config.header_enabled && (
                            <>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium">Brand Name</Label>
                                <Input
                                  value={config.brand_name || ""}
                                  onChange={(e) => updateConfig({ brand_name: e.target.value })}
                                  className="h-8 text-xs"
                                  placeholder="Your Brand Name"
                                />
                              </div>
                              
                              <SelectInput
                                label="Header Alignment"
                                value={config.header_alignment || "center"}
                                onChange={(value) => updateConfig({ header_alignment: value as "left" | "center" | "right" })}
                                options={[
                                  { value: "left", label: "Left" },
                                  { value: "center", label: "Center" },
                                  { value: "right", label: "Right" }
                                ]}
                              />
                              
                              <ColorInput
                                label="Brand Name Color"
                                value={config.brand_name_color || "#1f2937"}
                                onChange={(value) => updateConfig({ brand_name_color: value })}
                              />
                              
                              <div className="grid grid-cols-2 gap-3">
                                <SelectInput
                                  label="Font Family"
                                  value={config.brand_name_font_family || "Inter"}
                                  onChange={(value) => updateConfig({ brand_name_font_family: value })}
                                  options={fontOptions}
                                />
                                <NumberInput
                                  label="Font Size (px)"
                                  value={config.brand_name_font_size || 28}
                                  onChange={(value) => updateConfig({ brand_name_font_size: value })}
                                  min={16}
                                  max={72}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Enable Logo</Label>
                                <Switch
                                  checked={config.logo_enabled ?? false}
                                  onCheckedChange={(checked) => updateConfig({ logo_enabled: checked })}
                                />
                              </div>
                              
                              {config.logo_enabled && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Logo Upload</Label>
                                  
                                  {/* Current Logo Preview */}
                                  {config.logo_url && (
                                    <div className="flex items-center gap-3 p-3 border border-input rounded-md bg-muted/30">
                                      <img 
                                        src={config.logo_url} 
                                        alt="Current logo" 
                                        className="h-12 w-auto object-contain rounded"
                                        style={{
                                          border: `${config.logo_border_width || 0}px solid ${config.logo_border_color || '#e5e7eb'}`,
                                          borderRadius: `${config.logo_border_radius || 4}px`
                                        }}
                                      />
                                      <div className="flex-1 text-xs text-muted-foreground">
                                        Current logo
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (e) => {
                                              const file = (e.target as HTMLInputElement).files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                  updateConfig({ logo_url: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            };
                                            input.click();
                                          }}
                                          className="h-7 px-2 text-xs"
                                        >
                                          Change
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateConfig({ logo_url: "" })}
                                          className="h-7 px-2 text-xs"
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* File Upload - Only show when no logo exists */}
                                  {!config.logo_url && (
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            updateConfig({ logo_url: reader.result as string });
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="h-8 text-xs"
                                      value="" // Reset file input after each selection
                                    />
                                  )}
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <NumberInput
                                      label="Logo Height (px)"
                                      value={config.logo_height || 48}
                                      onChange={(value) => updateConfig({ logo_height: value })}
                                      min={24}
                                      max={200}
                                    />
                                    <NumberInput
                                      label="Border Width (px)"
                                      value={config.logo_border_width || 0}
                                      onChange={(value) => updateConfig({ logo_border_width: value })}
                                      min={0}
                                      max={20}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <ColorInput
                                      label="Border Color"
                                      value={config.logo_border_color || "#e5e7eb"}
                                      onChange={(value) => updateConfig({ logo_border_color: value })}
                                    />
                                    <NumberInput
                                      label="Border Radius (px)"
                                      value={config.logo_border_radius || 4}
                                      onChange={(value) => updateConfig({ logo_border_radius: value })}
                                      min={0}
                                      max={100}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </details>
                    </TabsContent>

                    {/* DESIGN TAB */}
                    <TabsContent value="design" className="space-y-4 mt-2">
                      {/* Color Presets */}
                      <details 
                        className="group" 
                        open={openSections.design?.['color-presets']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'color-presets');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Color Presets
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['color-presets'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="grid grid-cols-2 gap-2">
                            {colorPresets.map((preset) => (
                              <Button
                                key={preset.name}
                                variant="outline"
                                size="sm"
                                className="h-auto p-2 text-xs"
                                onClick={() => updateConfig({
                                  background_color: preset.background_color,
                                  prompt_background_color: preset.prompt_background_color,
                                  prompt_text_color: preset.prompt_text_color,
                                  suggestion_background_color: preset.suggestion_background_color,
                                  brand_name_color: preset.brand_name_color,
                                })}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: preset.accent_color }}
                                  />
                                  {preset.name}
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </details>

                      {/* Overall Style */}
                      <details 
                        className="group" 
                        open={openSections.design?.['overall-style']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'overall-style');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Overall Style
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['overall-style'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <ColorInput
                            label="Background Color"
                            value={config.background_color || "#ffffff"}
                            onChange={(value) => updateConfig({ background_color: value })}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <NumberInput
                              label="Padding (px)"
                              value={config.container_padding || 24}
                              onChange={(value) => updateConfig({ container_padding: value })}
                              min={8}
                              max={120}
                            />
                            <NumberInput
                              label="Border Radius (px)"
                              value={config.border_radius || 12}
                              onChange={(value) => updateConfig({ border_radius: value })}
                              min={0}
                              max={100}
                            />
                          </div>
                          <SelectInput
                            label="Shadow Style"
                            value={config.shadow_style || "medium"}
                            onChange={(value) => updateConfig({ shadow_style: value as ShadowStyle })}
                            options={[
                              { value: "none", label: "None" },
                              { value: "subtle", label: "Subtle" },
                              { value: "medium", label: "Medium" },
                              { value: "large", label: "Large" },
                              { value: "glow", label: "Glow" }
                            ]}
                          />
                        </div>
                      </details>

                      {/* Layout Configuration */}
                      <details 
                        className="group" 
                        open={openSections.design?.['layout']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'layout');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Layout className="h-4 w-4" />
                            Layout
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['layout'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          {/* Visual Layout Selector */}
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Layout Style</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={config.layout_mode === "left-right" ? "default" : "outline"}
                                size="sm"
                                className="h-auto p-3 flex flex-col items-center gap-2"
                                onClick={() => updateConfig({ layout_mode: "left-right" })}
                              >
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-4 bg-current opacity-60 rounded-sm"></div>
                                  <div className="w-4 h-4 bg-current opacity-30 rounded-sm"></div>
                                </div>
                                <span className="text-xs">Left-Right</span>
                              </Button>
                              
                              <Button
                                variant={config.layout_mode === "prompt-top" ? "default" : "outline"}
                                size="sm"
                                className="h-auto p-3 flex flex-col items-center gap-2"
                                onClick={() => updateConfig({ layout_mode: "prompt-top" })}
                              >
                                <div className="flex flex-col gap-1">
                                  <div className="w-6 h-2 bg-current opacity-60 rounded-sm"></div>
                                  <div className="w-6 h-3 bg-current opacity-30 rounded-sm"></div>
                                </div>
                                <span className="text-xs">Prompt Top</span>
                              </Button>
                              
                              <Button
                                variant={config.layout_mode === "prompt-bottom" ? "default" : "outline"}
                                size="sm"
                                className="h-auto p-3 flex flex-col items-center gap-2 col-span-2"
                                onClick={() => updateConfig({ layout_mode: "prompt-bottom" })}
                              >
                                <div className="flex flex-col gap-1">
                                  <div className="w-6 h-3 bg-current opacity-30 rounded-sm mx-auto"></div>
                                  <div className="w-6 h-2 bg-current opacity-60 rounded-sm mx-auto"></div>
                                </div>
                                <span className="text-xs">Prompt Bottom</span>
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Layout automatically adapts to mobile screens
                            </p>
                          </div>
                          
                          {config.layout_mode === "left-right" && (
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium">Left/Right Split</Label>
                                  <span className="text-xs text-muted-foreground">
                                    {config.prompt_section_width || 40}% / {100 - (config.prompt_section_width || 40)}%
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <input
                                    type="range"
                                    min="20"
                                    max="80"
                                    value={config.prompt_section_width || 40}
                                    onChange={(e) => updateConfig({ prompt_section_width: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                                    style={{
                                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((config.prompt_section_width || 40) - 20) / 60 * 100}%, #e5e7eb ${((config.prompt_section_width || 40) - 20) / 60 * 100}%, #e5e7eb 100%)`
                                    }}
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>← More space for images</span>
                                    <span>More space for prompts →</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Iframe Settings - Always Visible */}
                          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                            <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
                              <div className="w-3 h-3 border border-current rounded-sm opacity-60"></div>
                              Iframe Embed Settings
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">Width</Label>
                                <Input
                                  value={config.iframe_width || "100%"}
                                  onChange={(e) => updateConfig({ iframe_width: e.target.value })}
                                  className="h-8 text-xs"
                                  placeholder="100%, 800px, etc."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">Height</Label>
                                <Input
                                  value={config.iframe_height || "600px"}
                                  onChange={(e) => updateConfig({ iframe_height: e.target.value })}
                                  className="h-8 text-xs"
                                  placeholder="600px, 100vh, etc."
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Enable Border</Label>
                              <Switch
                                checked={config.iframe_border ?? true}
                                onCheckedChange={(checked) => updateConfig({ iframe_border: checked })}
                              />
                            </div>
                            
                            {config.iframe_border && (
                              <div className="grid grid-cols-2 gap-3">
                                <NumberInput
                                  label="Border Width (px)"
                                  value={config.iframe_border_width || 1}
                                  onChange={(value) => updateConfig({ iframe_border_width: value })}
                                  min={0}
                                  max={20}
                                />
                                <ColorInput
                                  label="Border Color"
                                  value={config.iframe_border_color || "#e5e7eb"}
                                  onChange={(value) => updateConfig({ iframe_border_color: value })}
                                />
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3">
                              <NumberInput
                                label="Border Radius (px)"
                                value={config.iframe_border_radius || 12}
                                onChange={(value) => updateConfig({ iframe_border_radius: value })}
                                min={0}
                                max={100}
                              />
                              <SelectInput
                                label="Shadow"
                                value={config.iframe_shadow || "medium"}
                                onChange={(value) => updateConfig({ iframe_shadow: value as ShadowStyle })}
                                options={[
                                  { value: "none", label: "None" },
                                  { value: "subtle", label: "Subtle" },
                                  { value: "medium", label: "Medium" },
                                  { value: "large", label: "Large" },
                                  { value: "glow", label: "Glow" }
                                ]}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <SelectInput
                                label="Loading"
                                value={config.iframe_loading || "lazy"}
                                onChange={(value) => updateConfig({ iframe_loading: value as "lazy" | "eager" })}
                                options={[
                                  { value: "lazy", label: "Lazy" },
                                  { value: "eager", label: "Eager" }
                                ]}
                              />
                              
                              <SelectInput
                                label="Scrolling"
                                value={config.iframe_scrolling || "auto"}
                                onChange={(value) => updateConfig({ iframe_scrolling: value as "auto" | "yes" | "no" })}
                                options={[
                                  { value: "auto", label: "Auto" },
                                  { value: "yes", label: "Yes" },
                                  { value: "no", label: "No" }
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </details>

                      {/* Image Uploader */}
                      <details 
                        className="group"
                        open={openSections.design?.['uploader']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'uploader');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            Image Uploader
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['uploader'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Uploader</Label>
                            <Switch
                              checked={config.uploader_enabled ?? true}
                              onCheckedChange={(checked) => updateConfig({ uploader_enabled: checked })}
                            />
                          </div>
                          
                          {config.uploader_enabled && (
                            <>
                              <NumberInput
                                label="Max Reference Images"
                                value={config.uploader_max_images || 6}
                                onChange={(value) => updateConfig({ uploader_max_images: value })}
                                min={1}
                                max={10}
                              />
                              
                              <ColorInput
                                label="Background Color"
                                value={config.uploader_background_color || "#f8fafc"}
                                onChange={(value) => updateConfig({ uploader_background_color: value })}
                              />
                              
                              <div className="grid grid-cols-2 gap-3">
                                <SelectInput
                                  label="Border Style"
                                  value={config.uploader_border_style || "dashed"}
                                  onChange={(value) => updateConfig({ uploader_border_style: value as BorderStyle })}
                                  options={[
                                    { value: "solid", label: "Solid" },
                                    { value: "dashed", label: "Dashed" },
                                    { value: "dotted", label: "Dotted" },
                                    { value: "none", label: "None" }
                                  ]}
                                />
                                <ColorInput
                                  label="Border Color"
                                  value={config.uploader_border_color || "#cbd5e1"}
                                  onChange={(value) => updateConfig({ uploader_border_color: value })}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <NumberInput
                                  label="Border Width (px)"
                                  value={config.uploader_border_width || 2}
                                  onChange={(value) => updateConfig({ uploader_border_width: value })}
                                  min={0}
                                  max={20}
                                />
                                <NumberInput
                                  label="Border Radius (px)"
                                  value={config.uploader_border_radius || 12}
                                  onChange={(value) => updateConfig({ uploader_border_radius: value })}
                                  min={0}
                                  max={100}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </details>

                      {/* Prompt Section */}
                      <details 
                        className="group"
                        open={openSections.design?.['prompt']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'prompt');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Prompt Input
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['prompt'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <ColorInput
                            label="Background Color"
                            value={config.prompt_background_color || "#f9fafb"}
                            onChange={(value) => updateConfig({ prompt_background_color: value })}
                          />
                          
                          <ColorInput
                            label="Text Color"
                            value={config.prompt_text_color || "#374151"}
                            onChange={(value) => updateConfig({ prompt_text_color: value })}
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <SelectInput
                              label="Font Family"
                              value={config.prompt_font_family || "Inter"}
                              onChange={(value) => updateConfig({ prompt_font_family: value })}
                              options={fontOptions}
                            />
                            <NumberInput
                              label="Font Size (px)"
                              value={config.prompt_font_size || 16}
                              onChange={(value) => updateConfig({ prompt_font_size: value })}
                              min={12}
                              max={32}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <NumberInput
                              label="Border Radius (px)"
                              value={config.prompt_border_radius || 12}
                              onChange={(value) => updateConfig({ prompt_border_radius: value })}
                              min={0}
                              max={100}
                            />
                            <ColorInput
                              label="Border Color"
                              value={config.prompt_border_color || "#e5e7eb"}
                              onChange={(value) => updateConfig({ prompt_border_color: value })}
                            />
                          </div>
                        </div>
                      </details>

                      {/* Suggestion Buttons */}
                      <details 
                        className="group"
                        open={openSections.design?.['suggestions']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'suggestions');
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Suggestion Buttons
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['suggestions'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Suggestions</Label>
                            <Switch
                              checked={config.suggestions_enabled ?? true}
                              onCheckedChange={(checked) => updateConfig({ suggestions_enabled: checked })}
                            />
                          </div>
                          
                          {config.suggestions_enabled && (
                            <>
                              <NumberInput
                                label="Number of Suggestions"
                                value={config.suggestions_count || 3}
                                onChange={(value) => updateConfig({ suggestions_count: value })}
                                min={1}
                                max={6}
                              />
                              
                              <div className="grid grid-cols-2 gap-3">
                                <ColorInput
                                  label="Background Color"
                                  value={config.suggestion_background_color || "#ffffff"}
                                  onChange={(value) => updateConfig({ suggestion_background_color: value })}
                                />
                                <ColorInput
                                  label="Text Color"
                                  value={config.suggestion_text_color || "#374151"}
                                  onChange={(value) => updateConfig({ suggestion_text_color: value })}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <NumberInput
                                  label="Border Radius (px)"
                                  value={config.suggestion_border_radius || 8}
                                  onChange={(value) => updateConfig({ suggestion_border_radius: value })}
                                  min={0}
                                  max={50}
                                />
                                <SelectInput
                                  label="Shadow Style"
                                  value={config.suggestion_shadow_style || "subtle"}
                                  onChange={(value) => updateConfig({ suggestion_shadow_style: value as ShadowStyle })}
                                  options={[
                                    { value: "none", label: "None" },
                                    { value: "subtle", label: "Subtle" },
                                    { value: "medium", label: "Medium" },
                                    { value: "large", label: "Large" },
                                    { value: "glow", label: "Glow" }
                                  ]}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </details>

                      {/* Image Gallery */}
                      <details 
                        className="group"
                        open={openSections.design?.['gallery']}
                      >
                        <summary 
                          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSection('design', 'gallery');
                          }}
                        >
                          <span>Image Gallery</span>
                          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['gallery'] ? 'rotate-180' : ''}`} />
                        </summary>
                        <div className="space-y-3 pl-2">
                          <div className="grid grid-cols-2 gap-3">
                            <NumberInput
                              label="Columns"
                              value={config.gallery_columns || 2}
                              onChange={(value) => updateConfig({ gallery_columns: value })}
                              min={1}
                              max={4}
                            />
                            <NumberInput
                              label="Spacing (px)"
                              value={config.gallery_spacing || 16}
                              onChange={(value) => updateConfig({ gallery_spacing: value })}
                              min={4}
                              max={80}
                            />
                          </div>
                          
                          <NumberInput
                            label="Max Images"
                            value={config.gallery_max_images || 4}
                            onChange={(value) => updateConfig({ gallery_max_images: value })}
                            min={1}
                            max={12}
                          />
                          
                          <SelectInput
                            label="Shadow Style"
                            value={config.gallery_shadow_style || "medium"}
                            onChange={(value) => updateConfig({ gallery_shadow_style: value as ShadowStyle })}
                            options={[
                              { value: "none", label: "None" },
                              { value: "subtle", label: "Subtle" },
                              { value: "medium", label: "Medium" },
                              { value: "large", label: "Large" },
                              { value: "glow", label: "Glow" }
                            ]}
                          />
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Enable Overlay</Label>
                            <Switch
                              checked={config.overlay_enabled ?? true}
                              onCheckedChange={(checked) => updateConfig({ overlay_enabled: checked })}
                            />
                          </div>
                        </div>
                      </details>
                    </TabsContent>

                    {/* LAUNCH TAB */}
                    <TabsContent value="launch" className="space-y-4 mt-2">
                      <div className="space-y-4">
                        {/* Full Page Launch */}
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Full Page Widget</h4>
                              <p className="text-xs text-blue-700 dark:text-blue-200">Open the complete widget in a new browser tab</p>
                            </div>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => window.open(`/widget/${instanceId}`, '_blank')}
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                            >
                              Launch
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Iframe Embed */}
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-green-900 dark:text-green-100">Iframe Embed</h4>
                              <p className="text-xs text-green-700 dark:text-green-200">Generate embed code for your website</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                const shadowStyle = {
                                  none: "none",
                                  subtle: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                                  medium: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                  large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                  glow: "0 0 15px rgba(99, 102, 241, 0.3)",
                                }[config.iframe_shadow || 'medium'];

                                const borderStyle = config.iframe_border ? 
                                  `${config.iframe_border_width || 1}px solid ${config.iframe_border_color || '#e5e7eb'}` : 
                                  'none';

                                const style = `
                                  border-radius: ${config.iframe_border_radius || 12}px;
                                  border: ${borderStyle};
                                  background-color: ${config.background_color || '#ffffff'};
                                  box-shadow: ${shadowStyle};
                                `.trim().replace(/\s+/g, ' ');

                                const iframeCode = `<iframe 
src="${window.location.origin}/widget/${instanceId}"
width="${config.iframe_width || '100%'}"
height="${config.iframe_height || '600px'}"
style="${style}"
frameborder="0"
loading="${config.iframe_loading || 'lazy'}"
scrolling="${config.iframe_scrolling || 'auto'}"
sandbox="${config.iframe_sandbox || 'allow-scripts allow-same-origin allow-forms'}"
referrerpolicy="${config.iframe_referrerpolicy || 'no-referrer-when-downgrade'}"
${config.iframe_allowtransparency ? 'allowtransparency="true"' : ''}
></iframe>`;

                                setEmbedCode(iframeCode);
                              }}
                              className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
                            >
                              Generate Code
                            </Button>
                          </div>
                          
                          {embedCode && (
                            <div className="space-y-3">
                              <div className="relative">
                                <textarea
                                  value={embedCode}
                                  readOnly
                                  className="w-full h-20 px-3 py-2 text-xs font-mono bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-md resize-none"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 h-6 text-xs bg-background hover:bg-muted/50 transition-colors"
                                  onClick={() => {
                                    navigator.clipboard.writeText(embedCode);
                                    toast({
                                      title: "Copied!",
                                      description: "Embed code copied to clipboard",
                                    });
                                  }}
                                >
                                  Copy
                                </Button>
                              </div>
                              
                              <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                                  <span>View Full Code</span>
                                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="mt-2 bg-muted/50 rounded-md p-3 max-h-40 overflow-auto">
                                  <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                    {embedCode}
                                  </pre>
                                </div>
                              </details>
                              
                              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-md">
                                <h5 className="text-xs font-medium text-green-900 dark:text-green-100 mb-1">
                                  Integration Instructions
                                </h5>
                                <p className="text-xs text-green-700 dark:text-green-200">
                                  Copy the embed code above and paste it into your website's HTML where you want the widget to appear. You can customize the iframe settings in the Design → Layout section.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
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
    </>
  );
}