import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ChevronDown, Palette, Layout, Type, Image, Settings, HelpCircle, MessageSquare } from "lucide-react";
import { ColorInput, NumberInput, SelectInput, FontSelector } from "./FormComponents";
import { DesignSettings, designThemes, getCompleteTheme, fontOptions, ShadowStyle, BorderStyle, loadGoogleFont, LayoutMode } from "@/types/design";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface DesignTabProps {
  config: DesignSettings;
  updateConfig: (updates: Partial<DesignSettings>) => void;
  openSections: Record<string, Record<string, boolean>>;
  toggleSection: (tab: string, section: string) => void;
}

export const DesignTab: React.FC<DesignTabProps> = ({
  config,
  updateConfig,
  openSections,
  toggleSection,
}) => {
  // Helper function to check layout mode
  const isHorizontalLayout = (mode: typeof config.layout_mode) => mode === "left-right" || mode === "right-left";

  // Load fonts when they change for real-time preview
  React.useEffect(() => {
    if (config.prompt_font_family && 
        config.prompt_font_family !== 'inherit' && 
        config.prompt_font_family !== 'sans-serif' && 
        config.prompt_font_family !== 'serif') {
      loadGoogleFont(config.prompt_font_family);
    }
    if (config.suggestion_font_family && 
        config.suggestion_font_family !== 'inherit' && 
        config.suggestion_font_family !== 'sans-serif' && 
        config.suggestion_font_family !== 'serif') {
      loadGoogleFont(config.suggestion_font_family);
    }
    if (config.uploader_font_family && 
        config.uploader_font_family !== 'inherit' && 
        config.uploader_font_family !== 'sans-serif' && 
        config.uploader_font_family !== 'serif') {
      loadGoogleFont(config.uploader_font_family);
    }
    if (config.gallery_font_family && 
        config.gallery_font_family !== 'inherit' && 
        config.gallery_font_family !== 'sans-serif' && 
        config.gallery_font_family !== 'serif') {
      loadGoogleFont(config.gallery_font_family);
    }
  }, [config.prompt_font_family, config.suggestion_font_family, config.uploader_font_family, config.gallery_font_family]);

  return (
    <div className="space-y-4 mt-2">
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
        <div className="space-y-4 pl-2">
          {/* Themes */}
          <div className="space-y-3">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Palette className="h-3 w-3" />
              Themes
            </Label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
              {designThemes.map((theme) => (
                <Button
                  key={theme.name}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 text-left justify-start hover:bg-muted/50 transition-all"
                  onClick={() => {
                    console.log('Applying theme:', theme.name, theme);
                    // Apply ONLY the visual properties directly from theme
                    updateConfig({
                      // Background & container
                      background_color: theme.background_color,
                      container_padding: theme.container_padding,
                      border_radius: theme.border_radius,
                      shadow_style: theme.shadow_style,
                      
                      // Prompt colors & styling
                      prompt_background_color: theme.prompt_background_color,
                      prompt_text_color: theme.prompt_text_color,
                      prompt_font_family: theme.prompt_font_family,
                      prompt_font_size: theme.prompt_font_size,
                      prompt_border_radius: theme.prompt_border_radius,
                      prompt_border_color: theme.prompt_border_color,
                      
                      // Suggestion colors & styling  
                      suggestion_background_color: theme.suggestion_background_color,
                      suggestion_text_color: theme.suggestion_text_color,
                      suggestion_font_family: theme.suggestion_font_family,
                      suggestion_font_size: theme.suggestion_font_size,
                      suggestion_border_radius: theme.suggestion_border_radius,
                      suggestion_border_color: theme.suggestion_border_color,
                      suggestion_shadow_style: theme.suggestion_shadow_style,
                      
                      // Uploader colors & styling
                      uploader_background_color: theme.uploader_background_color,
                      uploader_border_color: theme.uploader_border_color,
                      uploader_text_color: theme.uploader_text_color,
                      uploader_font_family: theme.uploader_font_family,
                      uploader_font_size: theme.uploader_font_size,
                      uploader_border_radius: theme.uploader_border_radius,
                      uploader_border_width: theme.uploader_border_width,
                      uploader_border_style: theme.uploader_border_style,
                      
                      // Gallery colors & styling
                      gallery_background_color: theme.gallery_background_color,
                      gallery_spacing: theme.gallery_spacing,
                      gallery_border_radius: theme.gallery_border_radius,
                      gallery_image_border_radius: theme.gallery_image_border_radius,
                      gallery_shadow_style: theme.gallery_shadow_style,
                      gallery_border_color: theme.gallery_border_color,
                      gallery_font_family: theme.gallery_font_family,
                      gallery_font_size: theme.gallery_font_size,
                      
                      // Overlay colors
                      overlay_background_color: theme.overlay_background_color,
                      overlay_icon_color: theme.overlay_icon_color,
                      overlay_font_family: theme.overlay_font_family,
                      overlay_font_size: theme.overlay_font_size,
                      
                      // Brand colors (not text content)
                      brand_name_color: theme.brand_name_color
                    });
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-border" 
                        style={{ backgroundColor: theme.background_color }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-border" 
                        style={{ backgroundColor: theme.accent_color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{theme.name}</div>
                      {theme.description && (
                        <div className="text-xs text-muted-foreground truncate">{theme.description}</div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Color Controls */}
          <div className="border-t border-border pt-3 space-y-3">
            <ColorInput
              label="Background Color"
              value={config.background_color || "#ffffff"}
              onChange={(value) => updateConfig({ background_color: value })}
              showOpacity={true}
            />
            
            {/* Container Padding Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Container Padding</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    const value = config.container_padding || 24;
                    updateConfig({
                      container_padding_top: value,
                      container_padding_right: value,
                      container_padding_bottom: value,
                      container_padding_left: value,
                    });
                  }}
                >
                  Sync All
                </Button>
              </div>
              
              {/* Unified Control */}
              <NumberInput
                label="All Sides"
                value={config.container_padding !== undefined ? config.container_padding : 24}
                onChange={(value) => updateConfig({ 
                  container_padding: value,
                  container_padding_top: value,
                  container_padding_right: value,
                  container_padding_bottom: value,
                  container_padding_left: value,
                })}
                min={0}
                max={120}
              />
              
              {/* Individual Controls */}
              <details className="space-y-2">
                <summary className="text-xs font-medium cursor-pointer hover:text-foreground/80 transition-colors">
                  Individual Sides
                </summary>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  <NumberInput
                    label="Top"
                    value={config.container_padding_top !== undefined ? config.container_padding_top : (config.container_padding !== undefined ? config.container_padding : 24)}
                    onChange={(value) => updateConfig({ container_padding_top: value })}
                    min={0}
                    max={120}
                  />
                  <NumberInput
                    label="Right"
                    value={config.container_padding_right !== undefined ? config.container_padding_right : (config.container_padding !== undefined ? config.container_padding : 24)}
                    onChange={(value) => updateConfig({ container_padding_right: value })}
                    min={0}
                    max={120}
                  />
                  <NumberInput
                    label="Bottom"
                    value={config.container_padding_bottom !== undefined ? config.container_padding_bottom : (config.container_padding !== undefined ? config.container_padding : 24)}
                    onChange={(value) => updateConfig({ container_padding_bottom: value })}
                    min={0}
                    max={120}
                  />
                  <NumberInput
                    label="Left"
                    value={config.container_padding_left !== undefined ? config.container_padding_left : (config.container_padding !== undefined ? config.container_padding : 24)}
                    onChange={(value) => updateConfig({ container_padding_left: value })}
                    min={0}
                    max={120}
                  />
                </div>
              </details>
            </div>
          </div>
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
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={config.layout_mode === "left-right" ? "default" : "outline"}
                size="sm"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50 transition-all"
                onClick={() => {
                  console.log('Switching to left-right layout');
                  const updates: Partial<DesignSettings> = { layout_mode: "left-right" };
                  
                  // If switching from right-left, invert the slider position
                  if (config.layout_mode === "right-left") {
                    const currentWidth = config.prompt_section_width || 40;
                    updates.prompt_section_width = 100 - currentWidth;
                  }
                  
                  updateConfig(updates);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-6 bg-current opacity-70 rounded"></div>
                  <div className="w-6 h-6 bg-current opacity-40 rounded"></div>
                </div>
                <span className="text-xs font-medium">Left-Right</span>
              </Button>
              
              <Button
                variant={config.layout_mode === "right-left" ? "default" : "outline"}
                size="sm"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50 transition-all"
                onClick={() => {
                  console.log('Switching to right-left layout');
                  const updates: Partial<DesignSettings> = { layout_mode: "right-left" };
                  
                  // If switching from left-right, invert the slider position
                  if (config.layout_mode === "left-right") {
                    const currentWidth = config.prompt_section_width || 40;
                    updates.prompt_section_width = 100 - currentWidth;
                  }
                  
                  updateConfig(updates);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-current opacity-40 rounded"></div>
                  <div className="w-4 h-6 bg-current opacity-70 rounded"></div>
                </div>
                <span className="text-xs font-medium">Right-Left</span>
              </Button>
              
              <Button
                variant={config.layout_mode === "prompt-top" ? "default" : "outline"}
                size="sm"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50 transition-all"
                onClick={() => updateConfig({ layout_mode: "prompt-top" })}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="w-8 h-3 bg-current opacity-70 rounded"></div>
                  <div className="w-8 h-4 bg-current opacity-40 rounded"></div>
                </div>
                <span className="text-xs font-medium">Prompt Top</span>
              </Button>
              
              <Button
                variant={config.layout_mode === "prompt-bottom" ? "default" : "outline"}
                size="sm"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50 transition-all"
                onClick={() => updateConfig({ layout_mode: "prompt-bottom" })}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="w-8 h-4 bg-current opacity-40 rounded"></div>
                  <div className="w-8 h-3 bg-current opacity-70 rounded"></div>
                </div>
                <span className="text-xs font-medium">Prompt Bottom</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Layout automatically adapts to mobile screens
            </p>
          </div>
          
          {/* Sidebar Background Color */}
          <div className="space-y-2">
            <ColorInput
              label="Sidebar Background"
              value={config.prompt_background_color || "#f9fafb"}
              onChange={(value) => updateConfig({ prompt_background_color: value })}
              showOpacity={true}
            />
            <p className="text-xs text-muted-foreground">
              Background color for the prompt input area
            </p>
          </div>
          
          {/* Layout Split Control for Left/Right */}
          {(config.layout_mode === "left-right" || config.layout_mode === "right-left") && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    {config.layout_mode === "left-right" ? "Left/Right Split" : "Right/Left Split"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {config.layout_mode === "left-right" 
                      ? `${config.prompt_section_width || 40}% / ${100 - (config.prompt_section_width || 40)}%`
                      : `${100 - (config.prompt_section_width || 40)}% / ${config.prompt_section_width || 40}%`
                    }
                  </span>
                </div>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={config.prompt_section_width || 40}
                    onChange={(e) => updateConfig({ prompt_section_width: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    key={`slider-${config.layout_mode}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {config.layout_mode === "left-right" ? (
                      <>
                        <span>← More space for prompts</span>
                        <span>More space for images →</span>
                      </>
                    ) : (
                      <>
                        <span>← More space for images</span>
                        <span>More space for prompts →</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Layout Split Control for Top/Bottom */}
          {(config.layout_mode === "prompt-top" || config.layout_mode === "prompt-bottom") && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    {config.layout_mode === "prompt-top" ? "Top/Bottom Split" : "Bottom/Top Split"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {config.layout_mode === "prompt-top" 
                      ? `${config.prompt_section_height || 30}% / ${100 - (config.prompt_section_height || 30)}%`
                      : `${100 - (config.prompt_section_height || 30)}% / ${config.prompt_section_height || 30}%`
                    }
                  </span>
                </div>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={config.prompt_section_height || 30}
                    onChange={(e) => updateConfig({ prompt_section_height: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    key={`height-slider-${config.layout_mode}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {config.layout_mode === "prompt-top" ? (
                      <>
                        <span>↑ More space for prompts</span>
                        <span>More space for images ↓</span>
                      </>
                    ) : (
                      <>
                        <span>↑ More space for images</span>
                        <span>More space for prompts ↓</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Iframe Settings */}
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
              <div className="w-3 h-3 border border-current rounded-sm opacity-60"></div>
              Iframe Embed Settings
            </h4>
            
            {/* Size Presets */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Common Sizes</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs justify-start"
                  onClick={() => updateConfig({ iframe_width: "600px", iframe_height: "400px" })}
                >
                  Small (600×400)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs justify-start"
                  onClick={() => updateConfig({ iframe_width: "800px", iframe_height: "600px" })}
                >
                  Medium (800×600)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs justify-start"
                  onClick={() => updateConfig({ iframe_width: "1200px", iframe_height: "800px" })}
                >
                  Large (1200×800)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs justify-start"
                  onClick={() => updateConfig({ iframe_width: "100%", iframe_height: "600px" })}
                >
                  Full Width
                </Button>
              </div>
            </div>
            
            {/* Custom Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Width</Label>
                <div className="flex gap-1">
                  <Input
                    value={config.iframe_width?.replace('px', '') || "800"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "100") {
                        updateConfig({ iframe_width: "100%" });
                      } else {
                        updateConfig({ iframe_width: `${value}px` });
                      }
                    }}
                    className="h-8 text-xs flex-1"
                    placeholder="800"
                  />
                  <div className="text-xs text-muted-foreground self-center">px</div>
                </div>
                <div className="text-xs text-muted-foreground">Enter "100" for 100% width</div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Height</Label>
                <div className="flex gap-1">
                  <Input
                    value={config.iframe_height?.replace('px', '') || "600"}
                    onChange={(e) => updateConfig({ iframe_height: `${e.target.value}px` })}
                    className="h-8 text-xs flex-1"
                    placeholder="600"
                  />
                  <div className="text-xs text-muted-foreground self-center">px</div>
                </div>
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
              <div className="space-y-3">
                <NumberInput
                  label="Border Width"
                  value={config.iframe_border_width ?? 1}
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
                label="Border Radius"
                value={config.iframe_border_radius ?? 12}
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
          </div>
        </div>
      </details>

      {/* User Input Section - MOVED TO TOP LEVEL */}
      <details 
        className="group" 
        open={openSections.design?.['input-section']}
      >
        <summary 
          className="flex items-center justify-between cursor-pointer text-sm font-medium mb-3 text-foreground hover:text-foreground/80 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('design', 'input-section');
          }}
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>User Input Section</span>
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['input-section'] ? 'rotate-180' : ''}`} />
        </summary>
        <div className="space-y-4 pl-2">
          <div className="text-xs text-muted-foreground mb-3">
            Configure how users interact with your widget - file uploads, text input, and suggestions.
          </div>

          {/* Main Input Section Settings */}
          <div className="space-y-3 p-3 bg-background/50 rounded-md border border-border/50">
            <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
              <div className="w-3 h-3 border border-current rounded opacity-60"></div>
              Overall Input Area
            </h4>
            
            <div className="space-y-3">
              {/* Prompt Section Position */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Prompt Section Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={config.prompt_section_alignment === 'left' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8"
                    onClick={() => updateConfig({ prompt_section_alignment: 'left' })}
                  >
                    Left
                  </Button>
                  <Button
                    variant={config.prompt_section_alignment === 'center' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8"
                    onClick={() => updateConfig({ prompt_section_alignment: 'center' })}
                  >
                    Center
                  </Button>
                  <Button
                    variant={config.prompt_section_alignment === 'right' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8"
                    onClick={() => updateConfig({ prompt_section_alignment: 'right' })}
                  >
                    Right
                  </Button>
                </div>
              </div>

              <ColorInput
                label="Background Color"
                value={config.prompt_background_color || "transparent"}
                onChange={(value) => updateConfig({ prompt_background_color: value })}
                showOpacity={true}
              />
            </div>
          </div>

          {/* Image Uploader Subsection */}
          <details 
            className="group bg-background/50 rounded-md border border-border/50"
            open={openSections.design?.['uploader']}
          >
            <summary 
              className="flex items-center justify-between cursor-pointer text-xs font-medium p-3 text-foreground hover:text-foreground/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toggleSection('design', 'uploader');
              }}
            >
              <span className="flex items-center gap-2">
                <Image className="h-3 w-3" />
                Image Uploader
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform text-muted-foreground ${openSections.design?.['uploader'] ? 'rotate-180' : ''}`} />
            </summary>
            <div className="space-y-3 px-3 pb-3">
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
                    showOpacity={true}
                  />
                  
                  <div className="space-y-3">
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
                      label="Border Width"
                      value={config.uploader_border_width ?? 2}
                      onChange={(value) => updateConfig({ uploader_border_width: value })}
                      min={0}
                      max={20}
                    />
                    <NumberInput
                      label="Border Radius"
                      value={config.uploader_border_radius ?? 12}
                      onChange={(value) => updateConfig({ uploader_border_radius: value })}
                      min={0}
                      max={100}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Primary Text</Label>
                      <Input
                        value={config.uploader_primary_text || "Add reference images to guide the AI generation"}
                        onChange={(e) => updateConfig({ uploader_primary_text: e.target.value })}
                        className="h-8 text-xs"
                        placeholder="Add reference images to guide the AI generation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Secondary Text</Label>
                      <Input
                        value={config.uploader_secondary_text || "Drag & drop or click to upload"}
                        onChange={(e) => updateConfig({ uploader_secondary_text: e.target.value })}
                        className="h-8 text-xs"
                        placeholder="Drag & drop or click to upload"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <ColorInput
                      label="Text Color"
                      value={config.uploader_text_color || "#64748b"}
                      onChange={(value) => updateConfig({ uploader_text_color: value })}
                    />
                    <NumberInput
                      label="Font Size"
                      value={config.uploader_font_size || 14}
                      onChange={(value) => updateConfig({ uploader_font_size: value })}
                      min={10}
                      max={24}
                    />
                  </div>
                  
                  <FontSelector
                    label="Font Family"
                    value={config.uploader_font_family || "Inter"}
                    onChange={(value) => updateConfig({ uploader_font_family: value })}
                  />
                </>
              )}
            </div>
          </details>

          {/* Prompt Input Subsection */}
          <details 
            className="group bg-background/50 rounded-md border border-border/50"
            open={openSections.design?.['prompt']}
          >
            <summary 
              className="flex items-center justify-between cursor-pointer text-xs font-medium p-3 text-foreground hover:text-foreground/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toggleSection('design', 'prompt');
              }}
            >
              <span className="flex items-center gap-2">
                <Type className="h-3 w-3" />
                Prompt Input
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform text-muted-foreground ${openSections.design?.['prompt'] ? 'rotate-180' : ''}`} />
            </summary>
            <div className="space-y-4 px-3 pb-3">
              {/* Typography Section */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">Typography</Label>
                <div className="space-y-3 pl-2">
                  <div className="grid grid-cols-2 gap-3">
                    <FontSelector
                      label="Font Family"
                      value={config.prompt_font_family || "Inter"}
                      onChange={(value) => updateConfig({ prompt_font_family: value })}
                    />
                    <NumberInput
                      label="Font Size"
                      value={config.prompt_font_size || 16}
                      onChange={(value) => updateConfig({ prompt_font_size: value })}
                      min={12}
                      max={32}
                    />
                  </div>
                  <ColorInput
                    label="Text Color"
                    value={config.prompt_text_color || "#374151"}
                    onChange={(value) => updateConfig({ prompt_text_color: value })}
                  />
                  <ColorInput
                    label="Placeholder Color"
                    value={config.prompt_placeholder_color || "#9ca3af"}
                    onChange={(value) => updateConfig({ prompt_placeholder_color: value })}
                  />
                </div>
              </div>
            </div>
          </details>

          {/* Suggestion Buttons Subsection */}
          <details 
            className="group bg-background/50 rounded-md border border-border/50"
            open={openSections.design?.['suggestions']}
          >
            <summary 
              className="flex items-center justify-between cursor-pointer text-xs font-medium p-3 text-foreground hover:text-foreground/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toggleSection('design', 'suggestions');
              }}
            >
              <span className="flex items-center gap-2">
                <Settings className="h-3 w-3" />
                Suggestion Buttons
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform text-muted-foreground ${openSections.design?.['suggestions'] ? 'rotate-180' : ''}`} />
            </summary>
            <div className="space-y-3 px-3 pb-3">
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
                    max={12}
                  />
                  
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Appearance</Label>
                    <div className="space-y-3 pl-2">
                      <ColorInput
                        label="Background Color"
                        value={config.suggestion_background_color || "#ffffff"}
                        onChange={(value) => updateConfig({ suggestion_background_color: value })}
                        showOpacity={true}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <ColorInput
                          label="Text Color"
                          value={config.suggestion_text_color || "#374151"}
                          onChange={(value) => updateConfig({ suggestion_text_color: value })}
                        />
                        <NumberInput
                          label="Font Size"
                          value={config.suggestion_font_size || 12}
                          onChange={(value) => updateConfig({ suggestion_font_size: value })}
                          min={10}
                          max={20}
                        />
                      </div>
                      
                      <FontSelector
                        label="Font Family"
                        value={config.suggestion_font_family || "Inter"}
                        onChange={(value) => updateConfig({ suggestion_font_family: value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Border & Shadow</Label>
                    <div className="space-y-3 pl-2">
                      <div className="grid grid-cols-2 gap-3">
                        <SelectInput
                          label="Border Style"
                          value={config.suggestion_border_style || "solid"}
                          onChange={(value) => updateConfig({ suggestion_border_style: value as BorderStyle })}
                          options={[
                            { value: "solid", label: "Solid" },
                            { value: "dashed", label: "Dashed" },
                            { value: "dotted", label: "Dotted" },
                            { value: "none", label: "None" }
                          ]}
                        />
                        <ColorInput
                          label="Border Color"
                          value={config.suggestion_border_color || "#e5e7eb"}
                          onChange={(value) => updateConfig({ suggestion_border_color: value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                          label="Border Width"
                          value={config.suggestion_border_width ?? 1}
                          onChange={(value) => updateConfig({ suggestion_border_width: value })}
                          min={0}
                          max={10}
                        />
                        <NumberInput
                          label="Border Radius"
                          value={config.suggestion_border_radius ?? 8}
                          onChange={(value) => updateConfig({ suggestion_border_radius: value })}
                          min={0}
                          max={50}
                        />
                      </div>
                      
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
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Show Arrow Icon</Label>
                        <Switch
                          checked={config.suggestion_arrow_icon ?? true}
                          onCheckedChange={(checked) => updateConfig({ suggestion_arrow_icon: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </details>
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
          <span className="flex items-center gap-2">
            {/* 4 square grid icon */}
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-sm"></div>
            </div>
            Image Gallery
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform text-muted-foreground ${openSections.design?.['gallery'] ? 'rotate-180' : ''}`} />
        </summary>
        <div className="space-y-4 pl-2">
          {/* Gallery Container Settings */}
          <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-muted/40">
            <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
              <div className="w-3 h-3 border border-current rounded opacity-60"></div>
              Gallery Container
            </h4>
            
            <ColorInput
              label="Background Color"
              value={config.gallery_background_color || "transparent"}
              onChange={(value) => updateConfig({ gallery_background_color: value })}
              showOpacity={true}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Spacing"
                value={config.gallery_spacing ?? 16}
                onChange={(value) => updateConfig({ gallery_spacing: value })}
                min={0}
                max={120}
              />
              <NumberInput
                label="Columns"
                value={config.gallery_columns || 2}
                onChange={(value) => updateConfig({ gallery_columns: value })}
                min={1}
                max={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Radius"
                value={config.gallery_border_radius ?? 12}
                onChange={(value) => updateConfig({ gallery_border_radius: value })}
                min={0}
                max={50}
              />
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">Max Images</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">
                          <strong>Billing Notice:</strong> You're charged based on the number of images generated. 
                          Most users set this to 4 to control costs.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  value={config.gallery_max_images || 4}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const clampedValue = Math.min(Math.max(value, 1), 16);
                    updateConfig({ gallery_max_images: clampedValue });
                  }}
                  className="h-8 text-xs"
                  min={1}
                  max={16}
                />
              </div>
            </div>
          </div>
          
          {/* Individual Image Settings */}
          <div className="space-y-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/20 rounded"></div>
              Individual Images
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Radius"
                value={config.gallery_image_border_radius ?? 8}
                onChange={(value) => updateConfig({ gallery_image_border_radius: value })}
                min={0}
                max={30}
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
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Image Borders</Label>
              <Switch
                checked={config.gallery_border_enabled ?? false}
                onCheckedChange={(checked) => updateConfig({ gallery_border_enabled: checked })}
              />
            </div>
            
            {config.gallery_border_enabled && (
              <div className="space-y-3">
                <NumberInput
                  label="Border Width"
                  value={config.gallery_border_width ?? 0}
                  onChange={(value) => updateConfig({ gallery_border_width: value })}
                  min={0}
                  max={10}
                />
                <ColorInput
                  label="Border Color"
                  value={config.gallery_border_color || "#e5e7eb"}
                  onChange={(value) => updateConfig({ gallery_border_color: value })}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Hover Overlay</Label>
              <Switch
                checked={config.overlay_enabled ?? true}
                onCheckedChange={(checked) => updateConfig({ overlay_enabled: checked })}
              />
            </div>
          </div>
          
          {/* Gallery Text Settings */}
          <div className="space-y-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
            <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
              <Type className="h-3 w-3" />
              Gallery Text
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <FontSelector
                label="Font Family"
                value={config.gallery_font_family || "Inter"}
                onChange={(value) => updateConfig({ gallery_font_family: value })}
              />
              <NumberInput
                label="Font Size"
                value={config.gallery_font_size || 14}
                onChange={(value) => updateConfig({ gallery_font_size: value })}
                min={10}
                max={24}
              />
            </div>
          </div>

          {/* Mobile Optimization Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                  📱 Mobile Optimization
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-200">
                  All layouts automatically switch to <strong>prompt-top style</strong> on mobile devices (&lt;768px width) for optimal user experience. Use the Mobile preview to see how this looks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}; 