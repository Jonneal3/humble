import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/lib/hooks";
import { DesignSettings } from "@/types/design";

interface LaunchTabProps {
  instanceId: string;
  config: DesignSettings;
  openSections: Record<string, Record<string, boolean>>;
  toggleSection: (tab: string, section: string) => void;
}

export const LaunchTab: React.FC<LaunchTabProps> = ({ 
  instanceId, 
  config,
  openSections,
  toggleSection 
}) => {
  const { toast } = useToast();
  const [embedCode, setEmbedCode] = useState<string | null>(null);

  const generateEmbedCode = () => {
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
  };

  return (
    <div className="space-y-4 mt-2">
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
            onClick={generateEmbedCode}
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
  );
}; 