import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ChevronDown, Palette, Layout, Type, Image, Settings } from "lucide-react";
import { ColorInput, NumberInput, SelectInput } from "./FormComponents";
import { DesignSettings, colorPresets, fontOptions, ShadowStyle, BorderStyle } from "@/types/design";

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
  return (
    <div className="space-y-4 mt-2">
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>← More space for images</span>
                    <span>More space for prompts →</span>
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
    </div>
  );
}; 