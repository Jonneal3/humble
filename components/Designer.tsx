"use client";

import { useState, useEffect } from "react";
import { getRandomSuggestions } from "@/lib/suggestions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/lib/hooks";
import { Switch } from "./ui/switch";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ChevronDown } from "lucide-react";
import { Widget } from "@/components/widget/Widget";
import { defaultDesignSettings, DesignSettings, WidgetStyle, ShadowSize, stylePresets, DesignPreset, designPresets } from "@/types/design";
import debounce from "lodash/debounce";

// Update the DesignSettings interface to include all custom style properties
interface ExtendedDesignSettings extends DesignSettings {
  // Only allow optional for properties not in DesignSettings
  input_background?: string;
  input_text?: string;
  input_border?: string;
  button_background?: string;
  button_text?: string;
  button_border?: string;
  section_background?: string;
  section_text?: string;
  prompt_border?: string;
  upload_background?: string;
  upload_text?: string;
  upload_border?: string;
  sidebar_text?: string;
  sidebar_border?: string;
}

interface DesignerProps {
  instanceId: string;
}

export default function Designer({ instanceId }: DesignerProps) {
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // State for all settings
  const [logo, setLogo] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandColor, setBrandColor] = useState("#000000");
  const [brandFont, setBrandFont] = useState("Inter");
  const [widgetHeight, setWidgetHeight] = useState(600);
  const [widgetWidth, setWidgetWidth] = useState(100);
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>("modern");
  
  // New state for advanced customization
  const [customStyles, setCustomStyles] = useState({
    border_radius: 8,
    border_width: 1,
    border_color: "#ffffff",
    background_color: "#ffffff",
    text_color: "#000000",
    input_background: "#df2a2a",
    input_text: "#401111",
    input_border: "#000000",
    button_background: "#ab4f4f",
    button_text: "#ffffff",
    button_border: "#000000",
    prompt_border: "#000000",
    upload_background: "#5d2828",
    upload_text: "#0d0d0d",
    upload_border: "#000000",
    sidebar_text: "#a24e4e",
    sidebar_border: "#000000",
    shadow: "medium" as ShadowSize,
    padding: 16,
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    sandbox: "allow-scripts allow-same-origin allow-forms",
    loading: "lazy",
    referrer_policy: "no-referrer-when-downgrade",
    allow_transparency: true,
  });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [previewMode, setPreviewMode] = useState<'iframe' | 'full'>('iframe');
  const [activeTab, setActiveTab] = useState("design");
  const [userId, setUserId] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState("");
  const [images, setImages] = useState<Array<{ image: string | null }>>([]);
  const [showHeader, setShowHeader] = useState(true);
  const [designPreset, setDesignPreset] = useState<string>("");
  const [instance, setInstance] = useState<any>(null);

  // Handle prompt submission
  const handlePromptSubmit = (prompt: string) => {
    // This will be handled by the DesignTab component
    console.log('Prompt submitted:', prompt);
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
        const config = instance.config as ExtendedDesignSettings;
        
        // Get the style preset based on the widget style
        const stylePreset = stylePresets[config.widget_style || "modern"];
        
        // First set the basic settings
        setLogo(config.logo_url || null);
        setBrandName(config.brand_name || "");
        setBrandColor(config.brand_color || "#000000");
        setBrandFont(config.brand_font || "Inter");
        setWidgetHeight(config.widget_height || 600);
        setWidgetWidth(config.widget_width || 100);
        setWidgetStyle(config.widget_style || "modern");
        setShowHeader(config.show_header ?? true);

        // Find the current design preset by comparing colors
        const currentPreset = Object.entries(designPresets).find(([_, preset]) => {
          return (
            preset.background_color === config.background_color &&
            preset.text_color === config.text_color &&
            preset.input_background === config.input_background &&
            preset.input_text === config.input_text &&
            preset.button_background === config.button_background &&
            preset.button_text === config.button_text &&
            preset.button_border === config.button_border &&
            preset.prompt_border === config.prompt_border &&
            preset.upload_background === config.upload_background &&
            preset.upload_text === config.upload_text &&
            preset.upload_border === config.upload_border &&
            preset.sidebar_text === config.sidebar_text &&
            preset.sidebar_border === config.sidebar_border
          );
        })?.[0] || "";
        setDesignPreset(currentPreset);

        // Then set the custom styles, ensuring we use the style preset values as defaults
        setCustomStyles({
          border_radius: config.border_radius ?? stylePreset.border_radius ?? 8,
          border_width: config.border_width ?? stylePreset.border_width ?? 1,
          border_color: config.border_color ?? stylePreset.border_color ?? "#ffffff",
          background_color: config.background_color ?? stylePreset.background_color ?? "#ffffff",
          text_color: config.text_color ?? stylePreset.text_color ?? "#000000",
          input_background: config.input_background ?? stylePreset.input_background ?? "#df2a2a",
          input_text: config.input_text ?? stylePreset.input_text ?? "#401111",
          input_border: config.input_border ?? stylePreset.input_border ?? "#000000",
          button_background: config.button_background ?? stylePreset.button_background ?? "#ab4f4f",
          button_text: config.button_text ?? stylePreset.button_text ?? "#ffffff",
          button_border: config.button_border ?? stylePreset.button_border ?? "#000000",
          prompt_border: config.prompt_border ?? stylePreset.prompt_border ?? "#000000",
          upload_background: config.upload_background ?? stylePreset.upload_background ?? "#5d2828",
          upload_text: config.upload_text ?? stylePreset.upload_text ?? "#0d0d0d",
          upload_border: config.upload_border ?? stylePreset.upload_border ?? "#000000",
          sidebar_text: config.sidebar_text ?? stylePreset.sidebar_text ?? "#a24e4e",
          sidebar_border: config.sidebar_border ?? stylePreset.sidebar_border ?? "#000000",
          shadow: config.shadow ?? stylePreset.shadow ?? "medium",
          padding: config.padding ?? stylePreset.padding ?? 16,
        });

        // Set advanced settings
        setAdvancedSettings({
          sandbox: config.sandbox || "allow-scripts allow-same-origin allow-forms",
          loading: config.loading || "lazy",
          referrer_policy: config.referrer_policy || "no-referrer-when-downgrade",
          allow_transparency: config.allow_transparency ?? true,
        });

        setInstance(instance);
      }
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    loadInstanceData();
    getUser();
  }, [instanceId, supabase]);

  // Debounced save function
  const debouncedSave = debounce(async (config: DesignSettings) => {
    console.log('Saving config:', config);
    const { error } = await supabase
      .from('instances')
      .update({ config })
      .eq('id', instanceId);

    if (error) {
      console.error('Error saving:', error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log('Config saved successfully');
      toast({
        title: "Settings saved",
        description: "Your changes have been saved",
      });
    }
  }, 1000);

  // Update handlers that trigger the debounced save
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setLogo(base64);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase.storage
            .from('logos')
            .upload(`${user.id}/${Date.now()}-${file.name}`, file);
          
          if (error) {
            toast({
              title: "Error uploading logo",
              description: error.message,
              variant: "destructive",
            });
          } else {
            const config: DesignSettings = {
              logo_url: logo || undefined,
              brand_name: brandName,
              brand_color: brandColor,
              brand_font: brandFont,
              widget_width: widgetWidth,
              widget_height: widgetHeight,
              widget_style: widgetStyle,
              ...customStyles,
              ...advancedSettings,
            };
            debouncedSave(config);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generic update handler for all settings
  const handleSettingUpdate = (updates: Partial<DesignSettings>) => {
    const config: DesignSettings = {
      logo_url: logo || undefined,
        brand_name: brandName,
        brand_color: brandColor,
      brand_font: brandFont,
      widget_width: widgetWidth,
      widget_height: widgetHeight,
        widget_style: widgetStyle,
      ...customStyles,
      ...advancedSettings,
      ...updates,
    };
    debouncedSave(config);
  };

  // Update handlers that trigger the debounced save
  const updateBrandName = (value: string) => {
    setBrandName(value);
    handleSettingUpdate({ brand_name: value });
  };

  const updateBrandColor = (value: string) => {
    setBrandColor(value);
    handleSettingUpdate({ brand_color: value });
  };

  const updateBrandFont = (value: string) => {
    setBrandFont(value);
    handleSettingUpdate({ brand_font: value });
  };

  const updateWidgetHeight = (value: number) => {
    setWidgetHeight(value);
    handleSettingUpdate({ widget_height: value });
  };

  const updateWidgetWidth = (value: number) => {
    setWidgetWidth(value);
    handleSettingUpdate({ widget_width: value });
  };

  const updateWidgetStyle = async (style: WidgetStyle) => {
    setWidgetStyle(style);
    const stylePreset = stylePresets[style];
    
    // Only update layout properties from the style preset
    const layoutUpdates = {
      border_radius: stylePreset.border_radius ?? customStyles.border_radius,
      border_width: stylePreset.border_width ?? customStyles.border_width,
      border_color: stylePreset.border_color ?? customStyles.border_color,
      shadow: stylePreset.shadow ?? customStyles.shadow,
      padding: stylePreset.padding ?? customStyles.padding,
    };
    
    // Update custom styles with only the layout properties
    setCustomStyles(prev => ({
      ...prev,
      ...layoutUpdates
    }));

    // Save to database with only the layout changes
    const { error } = await supabase
      .from("instances")
      .update({
        config: {
          widget_style: style,
          ...layoutUpdates
        }
      })
      .eq("id", instanceId);

    if (error) {
      console.error("Error updating widget style:", error);
      toast({
        title: "Error",
        description: "Failed to update widget style",
        variant: "destructive",
      });
    }
  };

  const updateCustomStyles = (updates: Partial<typeof customStyles>) => {
    setCustomStyles(prev => ({ ...prev, ...updates }));
    handleSettingUpdate(updates);
  };

  // Update the color input handlers
  const updateColor = (key: keyof typeof customStyles, value: string) => {
    updateCustomStyles({ [key]: value });
  };

  const generateEmbedCode = () => {
    const shadowStyle = {
      none: "none",
      small: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      medium: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    }[customStyles.shadow];

    const style = `
      border-radius: ${customStyles.border_radius}px;
      border: ${customStyles.border_width}px solid ${customStyles.border_color};
      background-color: ${customStyles.background_color};
      box-shadow: ${shadowStyle};
      padding: ${customStyles.padding}px;
    `;

    const iframeCode = `<iframe 
  src="${window.location.origin}/widget/${instanceId}"
  width="${widgetWidth}%"
  height="${widgetHeight}px"
  style="${style}"
  frameborder="0"
  loading="${advancedSettings.loading}"
  sandbox="${advancedSettings.sandbox}"
  referrerpolicy="${advancedSettings.referrer_policy}"
  allowtransparency="${advancedSettings.allow_transparency}"
></iframe>`;

    setEmbedCode(iframeCode);
  };

  // Update the DesignTab props interface
  interface DesignTabStyles {
    container?: React.CSSProperties;
    header?: React.CSSProperties;
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    input?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
    };
    button?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
    };
    upload?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
    };
    border?: {
      borderColor?: string;
    };
  }

  // Update the DesignTab component props type
  interface DesignTabProps {
    customStyles?: DesignTabStyles;
    subtitle?: string;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Settings Sidebar */}
      <div 
        className={`relative border-r bg-background transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'w-[420px]' : 'w-12'
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background p-0 hover:bg-muted/50 transition-colors"
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        >
          {isSidebarExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        <ScrollArea className="h-full">
          <div className={`px-4 py-4 ${!isSidebarExpanded && 'hidden'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold tracking-tight">Settings</h2>
            </div>
            <Tabs defaultValue="branding" className="w-full">
              <TabsList className="w-full h-9 mb-6 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="branding" 
                  className="flex-1 text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all hover:bg-muted/80"
                >
                  Branding
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="flex-1 text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all hover:bg-muted/80"
                >
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex-1 text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all hover:bg-muted/80"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="launch" 
                  className="flex-1 text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all hover:bg-muted/80"
                >
                  Launch
                </TabsTrigger>
              </TabsList>

              <TabsContent value="branding" className="space-y-6 mt-3">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo" className="text-xs mb-2 font-medium">Company Logo</Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="h-8 text-xs p-0 file:h-8 file:py-0 file:px-3 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/50 file:leading-none transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandName" className="text-xs mb-2 font-medium">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={brandName}
                      onChange={(e) => updateBrandName(e.target.value)}
                      placeholder="Enter your brand name"
                      className="h-8 text-xs transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandColor" className="text-xs mb-2 font-medium">Brand Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                    <Input
                      id="brandColor"
                      type="color"
                      value={brandColor}
                          onChange={(e) => updateBrandColor(e.target.value)}
                          className="h-8 w-12 p-1 cursor-pointer transition-colors"
                        />
                        <div 
                          className="absolute inset-0 rounded-md border border-input pointer-events-none"
                          style={{ borderColor: brandColor }}
                        />
                      </div>
                      <Input
                        type="text"
                        value={brandColor}
                        onChange={(e) => updateBrandColor(e.target.value)}
                        className="h-8 text-xs font-mono transition-colors"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="brandFont" className="text-xs mb-2 font-medium">Brand Font</Label>
                    <select
                      id="brandFont"
                      value={brandFont}
                      onChange={(e) => updateBrandFont(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                      style={{ fontFamily: brandFont }}
                    >
                      <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
                      <option value="Poppins" style={{ fontFamily: 'Poppins' }}>Poppins</option>
                      <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
                      <option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair Display</option>
                      <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                      <option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
                      <option value="Lato" style={{ fontFamily: 'Lato' }}>Lato</option>
                      <option value="Raleway" style={{ fontFamily: 'Raleway' }}>Raleway</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="showHeader" className="text-xs font-medium">Show Header</Label>
                    <Switch
                      id="showHeader"
                      checked={showHeader}
                      onCheckedChange={(checked: boolean) => {
                        setShowHeader(checked);
                        handleSettingUpdate({ show_header: checked });
                      }}
                      className="h-4 w-8"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6 mt-3">
                <div className="space-y-4">
                  {/* Auto Design Section */}
                  <details className="group" open>
                    <summary className="flex items-center justify-between cursor-pointer text-xs font-medium mb-3">
                      <span>Auto Design</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                  <div>
                        <Label htmlFor="designPreset" className="text-xs mb-2 font-medium">Design Preset</Label>
                    <select
                          id="designPreset"
                          value={designPreset}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                          onChange={(e) => {
                            const preset = e.target.value;
                            setDesignPreset(preset);
                            if (preset && preset in designPresets) {
                              const presetColors = designPresets[preset as keyof typeof designPresets];
                              
                              // Create a new config object with the updated colors
                              const updatedConfig = {
                                background_color: presetColors.background_color,
                                text_color: presetColors.text_color,
                                input_background: presetColors.input_background,
                                input_text: presetColors.input_text,
                                input_border: presetColors.input_border,
                                button_background: presetColors.button_background,
                                button_text: presetColors.button_text,
                                button_border: presetColors.button_border,
                                prompt_border: presetColors.prompt_border,
                                upload_background: presetColors.upload_background,
                                upload_text: presetColors.upload_text,
                                upload_border: presetColors.upload_border,
                                sidebar_text: presetColors.sidebar_text,
                                sidebar_border: presetColors.sidebar_border,
                              };

                              // Update the custom styles state while preserving layout properties
                              setCustomStyles(prev => ({
                                ...prev,
                                ...updatedConfig,
                                // Preserve layout properties
                                border_radius: prev.border_radius,
                                border_width: prev.border_width,
                                border_color: prev.border_color,
                                shadow: prev.shadow,
                                padding: prev.padding,
                              }));

                              // Save the changes to the configuration
                              const config = {
                                ...updatedConfig,
                                widget_style: widgetStyle,
                                border_radius: customStyles.border_radius,
                                border_width: customStyles.border_width,
                                border_color: customStyles.border_color,
                                shadow: customStyles.shadow,
                                padding: customStyles.padding,
                              };

                              // Save to database
                              supabase
                                .from("instances")
                                .update({ config })
                                .eq("id", instanceId)
                                .then(({ error }: { error: any }) => {
                                  if (error) {
                                    console.error("Error updating design preset:", error);
                                    toast({
                                      title: "Error",
                                      description: "Failed to update design preset",
                                      variant: "destructive",
                                    });
                                  }
                                });
                            }
                          }}
                        >
                          <option value="">Select a preset...</option>
                          <option value="modern-dark">Modern Dark</option>
                          <option value="minimal-light">Minimal Light</option>
                          <option value="nature-inspired">Nature Inspired</option>
                          <option value="ocean-theme">Ocean Theme</option>
                          <option value="sunset-vibes">Sunset Vibes</option>
                          <option value="midnight-purple">Midnight Purple</option>
                          <option value="forest-mist">Forest Mist</option>
                          <option value="desert-sand">Desert Sand</option>
                          <option value="nordic-frost">Nordic Frost</option>
                          <option value="cherry-blossom">Cherry Blossom</option>
                          <option value="cyberpunk">Cyberpunk</option>
                          <option value="lavender-dreams">Lavender Dreams</option>
                          <option value="autumn-breeze">Autumn Breeze</option>
                          <option value="midnight-ocean">Midnight Ocean</option>
                          <option value="sage-garden">Sage Garden</option>
                    </select>
                  </div>
                  <div>
                        <Label htmlFor="widgetStyle" className="text-xs mb-2 font-medium">Widget Style</Label>
                        <select
                          id="widgetStyle"
                          value={widgetStyle}
                          onChange={(e) => updateWidgetStyle(e.target.value as WidgetStyle)}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                        >
                          <option value="modern">Modern</option>
                          <option value="minimal">Minimal</option>
                          <option value="classic">Classic</option>
                        </select>
                  </div>
                    </div>
                  </details>

                  {/* Main Section */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs font-medium mb-3">
                      <span>Main Section</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                    <div>
                        <Label htmlFor="backgroundColor" className="text-xs mb-2 font-medium">Background Color</Label>
                        <div className="flex gap-2">
                      <Input
                            id="backgroundColor"
                            type="color"
                            value={customStyles.background_color}
                            onChange={(e) => updateColor('background_color', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.background_color}
                            onChange={(e) => updateColor('background_color', e.target.value)}
                            className="h-8 text-xs flex-1"
                      />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="textColor" className="text-xs mb-2 font-medium">Text Color</Label>
                        <div className="flex gap-2">
                      <Input
                            id="textColor"
                            type="color"
                            value={customStyles.text_color}
                            onChange={(e) => updateColor('text_color', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.text_color}
                            onChange={(e) => updateColor('text_color', e.target.value)}
                            className="h-8 text-xs flex-1"
                      />
                    </div>
                  </div>
                    </div>
                  </details>

                  {/* Image Upload Section */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs mb-3">
                      <span>Image Upload Section</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                    <div>
                        <Label htmlFor="uploadBackground" className="text-xs mb-2 font-medium">Upload Area Background</Label>
                        <div className="flex gap-2">
                      <Input
                            id="uploadBackground"
                            type="color"
                            value={customStyles.upload_background}
                            onChange={(e) => updateColor('upload_background', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.upload_background}
                            onChange={(e) => updateColor('upload_background', e.target.value)}
                            className="h-8 text-xs flex-1"
                      />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="uploadText" className="text-xs mb-2 font-medium">Upload Area Text</Label>
                        <div className="flex gap-2">
                      <Input
                            id="uploadText"
                            type="color"
                            value={customStyles.upload_text}
                            onChange={(e) => updateColor('upload_text', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.upload_text}
                            onChange={(e) => updateColor('upload_text', e.target.value)}
                            className="h-8 text-xs flex-1"
                      />
                    </div>
                  </div>
                  <div>
                        <Label htmlFor="uploadBorder" className="text-xs mb-2 font-medium">Upload Area Border</Label>
                        <div className="flex gap-2">
                    <Input
                            id="uploadBorder"
                      type="color"
                            value={customStyles.upload_border}
                            onChange={(e) => updateColor('upload_border', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.upload_border}
                            onChange={(e) => updateColor('upload_border', e.target.value)}
                            className="h-8 text-xs flex-1"
                    />
                  </div>
                      </div>
                    </div>
                  </details>

                  {/* Prompt Input Section */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs mb-3">
                      <span>Prompt Input Section</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                  <div>
                        <Label htmlFor="inputBackground" className="text-xs mb-2 font-medium">Input Background</Label>
                        <div className="flex gap-2">
                    <Input
                            id="inputBackground"
                      type="color"
                            value={customStyles.input_background}
                            onChange={(e) => updateColor('input_background', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.input_background}
                            onChange={(e) => updateColor('input_background', e.target.value)}
                            className="h-8 text-xs flex-1"
                    />
                        </div>
                  </div>
                  <div>
                        <Label htmlFor="inputText" className="text-xs mb-2 font-medium">Input Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="inputText"
                            type="color"
                            value={customStyles.input_text}
                            onChange={(e) => updateColor('input_text', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.input_text}
                            onChange={(e) => updateColor('input_text', e.target.value)}
                            className="h-8 text-xs flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="promptBorder" className="text-xs mb-2 font-medium">Prompt Border Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="promptBorder"
                            type="color"
                            value={customStyles.prompt_border}
                            onChange={(e) => updateColor('prompt_border', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.prompt_border}
                            onChange={(e) => updateColor('prompt_border', e.target.value)}
                            className="h-8 text-xs flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </details>

                  {/* Buttons Section */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs mb-3">
                      <span>Buttons Section</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                      <div>
                        <Label htmlFor="buttonBackground" className="text-xs mb-2 font-medium">Button Background</Label>
                        <div className="flex gap-2">
                          <Input
                            id="buttonBackground"
                            type="color"
                            value={customStyles.button_background}
                            onChange={(e) => updateColor('button_background', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.button_background}
                            onChange={(e) => updateColor('button_background', e.target.value)}
                            className="h-8 text-xs flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="buttonText" className="text-xs mb-2 font-medium">Button Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="buttonText"
                            type="color"
                            value={customStyles.button_text}
                            onChange={(e) => updateColor('button_text', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.button_text}
                            onChange={(e) => updateColor('button_text', e.target.value)}
                            className="h-8 text-xs flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="buttonBorder" className="text-xs mb-2 font-medium">Button Border Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="buttonBorder"
                            type="color"
                            value={customStyles.button_border}
                            onChange={(e) => updateColor('button_border', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.button_border}
                            onChange={(e) => updateColor('button_border', e.target.value)}
                            className="h-8 text-xs flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </details>

                  {/* Layout Options */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs mb-3">
                      <span>Layout Options</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                      <div>
                        <Label htmlFor="borderColor" className="text-xs mb-2 font-medium">Border Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="borderColor"
                            type="color"
                            value={customStyles.border_color}
                            onChange={(e) => updateColor('border_color', e.target.value)}
                            className="h-8 w-12 p-1"
                          />
                          <Input
                            type="text"
                            value={customStyles.border_color}
                            onChange={(e) => updateColor('border_color', e.target.value)}
                            className="h-8 text-xs flex-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="borderRadius" className="text-xs mb-2 font-medium">Border Radius</Label>
                          <Input
                            id="borderRadius"
                            type="number"
                            value={customStyles.border_radius}
                            onChange={(e) => updateCustomStyles({ border_radius: parseInt(e.target.value) })}
                            className="h-8 text-xs"
                            min="0"
                            max="24"
                          />
                        </div>
                        <div>
                          <Label htmlFor="borderWidth" className="text-xs mb-2 font-medium">Border Width</Label>
                          <Input
                            id="borderWidth"
                            type="number"
                            value={customStyles.border_width}
                            onChange={(e) => updateCustomStyles({ border_width: parseInt(e.target.value) })}
                            className="h-8 text-xs"
                            min="0"
                            max="4"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="shadow" className="text-xs mb-2 font-medium">Shadow</Label>
                    <select
                      id="shadow"
                      value={customStyles.shadow}
                          onChange={(e) => updateCustomStyles({ shadow: e.target.value as ShadowSize })}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                    >
                      <option value="none">None</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                        <Label htmlFor="padding" className="text-xs mb-2 font-medium">Padding</Label>
                    <Input
                      id="padding"
                      type="number"
                      value={customStyles.padding}
                          onChange={(e) => updateCustomStyles({ padding: parseInt(e.target.value) })}
                          className="h-8 text-xs"
                      min="0"
                      max="32"
                    />
                  </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="widgetWidth" className="text-xs mb-2 font-medium">Widget Width (%)</Label>
                          <Input
                            id="widgetWidth"
                            type="number"
                            value={widgetWidth}
                            onChange={(e) => updateWidgetWidth(parseInt(e.target.value))}
                            className="h-8 text-xs"
                            min="20"
                            max="100"
                    />
                  </div>
                        <div>
                          <Label htmlFor="widgetHeight" className="text-xs mb-2 font-medium">Widget Height (px)</Label>
                          <Input
                            id="widgetHeight"
                            type="number"
                            value={widgetHeight}
                            onChange={(e) => updateWidgetHeight(parseInt(e.target.value))}
                            className="h-8 text-xs"
                            min="200"
                            max="1000"
                    />
                  </div>
                  </div>
                    </div>
                  </details>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-3">
                <div className="space-y-4">
                  {/* Instance Information */}
                  <details className="group" open>
                    <summary className="flex items-center justify-between cursor-pointer text-xs font-medium mb-3">
                      <span>Instance Information</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                      <div>
                        <Label htmlFor="instanceName" className="text-xs mb-2 font-medium">Instance Name</Label>
                        <Input
                          id="instanceName"
                          value={instance?.name || ''}
                          onChange={(e) => handleSettingUpdate({ name: e.target.value })}
                          placeholder="Enter instance name"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instanceDescription" className="text-xs mb-2 font-medium">Description</Label>
                        <textarea
                          id="instanceDescription"
                          value={instance?.description || ''}
                          onChange={(e) => handleSettingUpdate({ description: e.target.value })}
                          placeholder="Enter instance description"
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-20 resize-none transition-colors"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Business Templates */}
                  <details className="group" open>
                    <summary className="flex items-center justify-between cursor-pointer text-xs font-medium mb-3">
                      <span>Business Templates</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-4 pl-2">
                      <div>
                        <Label htmlFor="businessType" className="text-xs mb-2 font-medium">Business Type</Label>
                        <select
                          id="businessType"
                          value={instance?.business_type || ''}
                          onChange={(e) => handleSettingUpdate({ business_type: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                        >
                          <option value="">Select a business type...</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="realestate">Real Estate</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="fitness">Fitness & Wellness</option>
                          <option value="beauty">Beauty & Spa</option>
                          <option value="education">Education</option>
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="creative">Creative Services</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="templateStyle" className="text-xs mb-2 font-medium">Template Style</Label>
                        <select
                          id="templateStyle"
                          value={instance?.template_style || ''}
                          onChange={(e) => handleSettingUpdate({ template_style: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                        >
                          <option value="">Select a template style...</option>
                          <option value="modern">Modern & Clean</option>
                          <option value="luxury">Luxury & Premium</option>
                          <option value="minimal">Minimal & Simple</option>
                          <option value="playful">Playful & Fun</option>
                          <option value="professional">Professional & Corporate</option>
                          <option value="artistic">Artistic & Creative</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="colorScheme" className="text-xs mb-2 font-medium">Color Scheme</Label>
                        <select
                          id="colorScheme"
                          value={instance?.color_scheme || ''}
                          onChange={(e) => handleSettingUpdate({ color_scheme: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs h-8 transition-colors"
                        >
                          <option value="">Select a color scheme...</option>
                          <option value="brand">Use Brand Colors</option>
                          <option value="template">Use Template Colors</option>
                          <option value="mixed">Mix Brand & Template</option>
                        </select>
                      </div>
                    </div>
                  </details>
                </div>
              </TabsContent>

              <TabsContent value="launch" className="space-y-6 mt-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Open in New Tab</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => userId && window.open(`/widget/${instanceId}`, '_blank')}
                      className="h-8 text-xs transition-colors"
                      disabled={!userId}
                    >
                      Open
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Embed Code</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateEmbedCode}
                      className="h-8 text-xs transition-colors"
                    >
                      Generate
                    </Button>
                  </div>
                  {embedCode && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          value={embedCode}
                          readOnly
                          className="font-mono text-xs h-8 pr-16 transition-colors"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 text-xs bg-background hover:bg-muted/50 transition-colors"
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
                        <div className="mt-2 bg-muted/50 rounded-md p-3">
                          <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                            {embedCode}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Preview Area - Always Light Mode */}
      <div className="flex-1 [color-scheme:light]">
        <div className="h-full flex flex-col bg-[#f1f5f9]">
          {/* Preview Toolbar */}
          <div className="border-b border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
                className="h-8 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setPreviewMode(previewMode === 'iframe' ? 'full' : 'iframe')}
            >
                {previewMode === 'iframe' ? (
                  <>
                    <Maximize2 className="h-4 w-4 mr-1.5" />
                    Full Page
                  </>
                ) : (
                  <>
                    <Minimize2 className="h-4 w-4 mr-1.5" />
                    Iframe
                  </>
                )}
            </Button>
          </div>
          </div>
          
          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto">
            {previewMode === 'iframe' ? (
              <div className="p-8 flex justify-center">
                <div 
                  className="rounded-lg shadow-lg overflow-hidden border border-gray-200"
                  style={{ 
                    width: `${widgetWidth}%`,
                    height: `${widgetHeight}px`,
                    borderRadius: `${customStyles.border_radius}px`,
                    border: `${customStyles.border_width}px solid ${customStyles.border_color}`,
                    backgroundColor: customStyles.background_color,
                    boxShadow: customStyles.shadow === 'none' ? 'none' : 
                              customStyles.shadow === 'small' ? '0 1px 3px rgba(0,0,0,0.12)' :
                              customStyles.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                              '0 10px 15px rgba(0,0,0,0.1)',
                    padding: `${customStyles.padding}px`,
                  }}
                >
                  {showHeader && (
                    <div 
                      className="p-4 flex items-center min-h-[64px]"
                      style={{ backgroundColor: customStyles.background_color }}
                    >
                      <div className="flex items-center gap-3">
                    {logo ? (
                      <img src={logo} alt="Brand Logo" className="h-8" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100" />
                    )}
                    {brandName && (
                      <div 
                            className="text-lg font-semibold"
                            style={{ 
                              color: brandColor,
                              fontFamily: brandFont
                            }}
                      >
                        {brandName}
                      </div>
                    )}
                  </div>
                  </div>
                  )}
                  <div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full overflow-hidden"
                    style={{ 
                      backgroundColor: customStyles.background_color,
                      color: customStyles.text_color,
                      borderColor: customStyles.border_color,
                      height: `calc(${widgetHeight}px - 64px - ${customStyles.padding * 2}px)`
                    }}
                  >
                    {/* Left Column - Fixed */}
                    <div className="lg:col-span-1 h-full">
                      <Widget
                        instanceId={instanceId}
                        customStyles={{
                          // Layout styles
                          background: customStyles.background_color,
                          text: customStyles.sidebar_text,
                          border: customStyles.sidebar_border,
                          // Content styles
                          container: {
                            color: customStyles.sidebar_text,
                            borderColor: customStyles.sidebar_border,
                            borderWidth: `${customStyles.border_width}px`,
                            height: '100%',
                            overflow: 'hidden',
                            padding: `${customStyles.padding}px`,
                            backgroundColor: customStyles.background_color,
                            borderRadius: `${customStyles.border_radius}px`,
                            fontFamily: brandFont,
                          },
                          input: {
                            backgroundColor: customStyles.input_background,
                            color: customStyles.input_text,
                            borderColor: customStyles.prompt_border,
                            borderRadius: `${customStyles.border_radius}px`,
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            borderWidth: `${customStyles.border_width}px`,
                            borderStyle: 'solid',
                            fontFamily: brandFont,
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            WebkitBorderRadius: `${customStyles.border_radius}px`,
                            MozBorderRadius: `${customStyles.border_radius}px`,
                            borderTopLeftRadius: `${customStyles.border_radius}px`,
                            borderTopRightRadius: `${customStyles.border_radius}px`,
                            borderBottomLeftRadius: `${customStyles.border_radius}px`,
                            borderBottomRightRadius: `${customStyles.border_radius}px`,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s ease',
                          },
                          button: {
                            backgroundColor: customStyles.button_background,
                            color: customStyles.button_text,
                            borderColor: customStyles.button_border,
                            borderRadius: `${customStyles.border_radius}px`,
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            borderWidth: `${customStyles.border_width}px`,
                            borderStyle: 'solid',
                            fontFamily: brandFont,
                            cursor: 'pointer',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            WebkitBorderRadius: `${customStyles.border_radius}px`,
                            MozBorderRadius: `${customStyles.border_radius}px`,
                            borderTopLeftRadius: `${customStyles.border_radius}px`,
                            borderTopRightRadius: `${customStyles.border_radius}px`,
                            borderBottomLeftRadius: `${customStyles.border_radius}px`,
                            borderBottomRightRadius: `${customStyles.border_radius}px`,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                          },
                          upload: {
                            backgroundColor: customStyles.upload_background,
                            color: customStyles.upload_text,
                            borderColor: customStyles.upload_border,
                            borderRadius: `${customStyles.border_radius}px`,
                            padding: '2rem',
                            borderWidth: '2px',
                            borderStyle: 'dashed',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: brandFont || 'Inter',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                          },
                        }}
                        onImagesChange={(newImages) => {
                          setImages(newImages);
                        }}
                      />
                    </div>
                    {/* Right Column - Scrollable */}
                    <div className="lg:col-span-2 overflow-y-auto" style={{ height: `calc(${widgetHeight}px - 64px - ${customStyles.padding * 2}px)` }}>
                      <div className="p-4">
                        {/* Gallery Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Array.from({ length: 12 }).map((_, index) => {
                            const image = images[index];
                            return image ? (
                              <div key={index} className="relative aspect-square group">
                                <img 
                                  src={image.image || ''} 
                                  alt={`Generated image ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                  </button>
                                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                </div>
              </div>
            ) : (
                              <div key={index} className="relative aspect-square group">
                                <div className="w-full h-full rounded-lg bg-gray-100 animate-pulse" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-full overflow-y-auto"
                style={{
                  backgroundColor: customStyles.background_color,
                }}
              >
                <div className="max-w-7xl mx-auto min-h-full">
                  {showHeader && (
                    <header 
                      className="sticky top-0 z-10"
                      style={{
                        backgroundColor: customStyles.background_color,
                        borderColor: customStyles.border_color,
                      }}
                    >
                      <div className="px-4 py-4 flex items-center gap-3">
                        <div className="flex items-center gap-3">
                      {logo ? (
                        <img src={logo} alt="Brand Logo" className="h-8" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-100" />
                      )}
                      {brandName && (
                        <div 
                              className="text-lg font-semibold"
                              style={{ 
                                color: brandColor,
                                fontFamily: brandFont
                              }}
                        >
                          {brandName}
                        </div>
                      )}
                        </div>
                    </div>
                  </header>
                  )}
                  <main 
                    className="p-4"
                    style={{
                      backgroundColor: customStyles.background_color,
                      padding: `${customStyles.padding}px`,
                      height: `calc(100vh - ${showHeader ? '64px' : '0px'})`,
                      overflow: 'hidden'
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                      {/* Left Column - Fixed */}
                      <div className="lg:col-span-1 h-full">
                        <Widget
                          instanceId={instanceId}
                          customStyles={{
                            // Layout styles
                            background: customStyles.background_color,
                            text: customStyles.sidebar_text,
                            border: customStyles.sidebar_border,
                            // Content styles
                            container: {
                              color: customStyles.sidebar_text,
                              borderColor: customStyles.sidebar_border,
                              borderWidth: `${customStyles.border_width}px`,
                              height: '100%',
                              overflow: 'hidden',
                              padding: `${customStyles.padding}px`,
                              backgroundColor: customStyles.background_color,
                              borderRadius: `${customStyles.border_radius}px`,
                              fontFamily: brandFont,
                            },
                            input: {
                              backgroundColor: customStyles.input_background,
                              color: customStyles.input_text,
                              borderColor: customStyles.prompt_border,
                              borderRadius: `${customStyles.border_radius}px`,
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              marginBottom: '1.5rem',
                              borderWidth: `${customStyles.border_width}px`,
                              borderStyle: 'solid',
                              fontFamily: brandFont,
                              outline: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none',
                              WebkitBorderRadius: `${customStyles.border_radius}px`,
                              MozBorderRadius: `${customStyles.border_radius}px`,
                              borderTopLeftRadius: `${customStyles.border_radius}px`,
                              borderTopRightRadius: `${customStyles.border_radius}px`,
                              borderBottomLeftRadius: `${customStyles.border_radius}px`,
                              borderBottomRightRadius: `${customStyles.border_radius}px`,
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                            },
                            button: {
                              backgroundColor: customStyles.button_background,
                              color: customStyles.button_text,
                              borderColor: customStyles.button_border,
                              borderRadius: `${customStyles.border_radius}px`,
                              padding: '0.75rem 1.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              borderWidth: `${customStyles.border_width}px`,
                              borderStyle: 'solid',
                              fontFamily: brandFont,
                              cursor: 'pointer',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none',
                              WebkitBorderRadius: `${customStyles.border_radius}px`,
                              MozBorderRadius: `${customStyles.border_radius}px`,
                              borderTopLeftRadius: `${customStyles.border_radius}px`,
                              borderTopRightRadius: `${customStyles.border_radius}px`,
                              borderBottomLeftRadius: `${customStyles.border_radius}px`,
                              borderBottomRightRadius: `${customStyles.border_radius}px`,
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                            },
                            upload: {
                              backgroundColor: customStyles.upload_background,
                              color: customStyles.upload_text,
                              borderColor: customStyles.upload_border,
                              borderRadius: `${customStyles.border_radius}px`,
                              padding: '2rem',
                              borderWidth: '2px',
                              borderStyle: 'dashed',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontFamily: brandFont || 'Inter',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none',
                            },
                          }}
                          onImagesChange={(newImages) => {
                            setImages(newImages);
                          }}
                        />
                      </div>
                      {/* Right Column - Scrollable */}
                      <div className="lg:col-span-2 overflow-y-auto">
                        <div className="p-4">
                          {/* Gallery Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array.from({ length: 12 }).map((_, index) => {
                              const image = images[index];
                              return image ? (
                                <div key={index} className="relative aspect-square group">
                                  <img 
                                    src={image.image || ''} 
                                    alt={`Generated image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                      </svg>
                                    </button>
                                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div key={index} className="relative aspect-square group">
                                  <div className="w-full h-full rounded-lg bg-gray-100 animate-pulse" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 