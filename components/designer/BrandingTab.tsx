import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ChevronDown, Type } from "lucide-react";
import { ColorInput, NumberInput, SelectInput, FontSelector } from "./FormComponents";
import { DesignSettings, loadGoogleFont } from "@/types/design";

interface BrandingTabProps {
  config: DesignSettings;
  updateConfig: (updates: Partial<DesignSettings>) => void;
  openSections: Record<string, Record<string, boolean>>;
  toggleSection: (tab: string, section: string) => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({
  config,
  updateConfig,
  openSections,
  toggleSection,
}) => {
  // Load fonts when they change
  useEffect(() => {
    if (config.brand_name_font_family && 
        config.brand_name_font_family !== 'inherit' && 
        config.brand_name_font_family !== 'sans-serif' && 
        config.brand_name_font_family !== 'serif') {
      loadGoogleFont(config.brand_name_font_family);
    }
  }, [config.brand_name_font_family]);

  return (
    <div className="space-y-4 mt-2">
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
                <FontSelector
                  label="Font Family"
                  value={config.brand_name_font_family || "Inter"}
                  onChange={(value) => updateConfig({ brand_name_font_family: value })}
                />
                <NumberInput
                  label="Font Size"
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
                <div className="space-y-3">
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
                    />
                  )}
                  
                  {/* Logo Size Settings */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Logo Size</Label>
                    <NumberInput
                      label="Height (px)"
                      value={config.logo_height || 48}
                      onChange={(value) => updateConfig({ logo_height: value })}
                      min={24}
                      max={200}
                    />
                  </div>
                  
                  {/* Logo Border Settings */}
                  <div className="space-y-2 p-3 bg-muted/20 rounded-lg border border-muted/40">
                    <Label className="text-xs font-medium flex items-center gap-2">
                      <div className="w-3 h-3 border border-current rounded opacity-60"></div>
                      Logo Border
                    </Label>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <NumberInput
                        label="Border Width"
                        value={config.logo_border_width ?? 0}
                        onChange={(value) => updateConfig({ logo_border_width: value })}
                        min={0}
                        max={20}
                      />
                      <NumberInput
                        label="Border Radius"
                        value={config.logo_border_radius ?? 4}
                        onChange={(value) => updateConfig({ logo_border_radius: value })}
                        min={0}
                        max={50}
                      />
                    </div>
                    
                    <ColorInput
                      label="Border Color"
                      value={config.logo_border_color || "#e5e7eb"}
                      onChange={(value) => updateConfig({ logo_border_color: value })}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </details>
    </div>
  );
}; 