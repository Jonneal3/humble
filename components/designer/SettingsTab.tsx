import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { ChevronDown } from "lucide-react";
import { NumberInput, SelectInput } from "./FormComponents";

interface SettingsTabProps {
  instance: any;
  updateInstance: (updates: any) => void;
  openSections: Record<string, Record<string, boolean>>;
  toggleSection: (tab: string, section: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  instance,
  updateInstance,
  openSections,
  toggleSection,
}) => {
  return (
    <div className="space-y-4 mt-2">
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
    </div>
  );
}; 