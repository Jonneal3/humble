"use client";

import React, { useRef, useEffect, useState } from "react";
import { DesignSettings, LayoutMode } from "@/types/design";
import { Widget } from "@/components/widget/Widget";

interface WidgetPageViewProps {
  instanceId: string;
  liveConfig?: DesignSettings | null;
  className?: string;
  style?: React.CSSProperties;
  fullPage?: boolean;
  deployment?: boolean;
  previewMode?: 'desktop' | 'mobile' | 'iframe';
}

export const WidgetPageView = React.memo<WidgetPageViewProps>(({ 
  instanceId, 
  liveConfig,
  className,
  style,
  fullPage = false,
  deployment = true,
  previewMode = 'desktop'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1024);
  
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const safeConfig: DesignSettings | undefined = liveConfig || undefined;

  // Apply specific config for different preview modes
  const config = previewMode === 'mobile' ? {
    ...safeConfig,
    layout_mode: 'mobile-optimized' as LayoutMode,
    gallery_columns: 1,
    container_padding: 12,
    prompt_font_size: Math.round((safeConfig?.prompt_font_size || 16) * 0.9),
    suggestion_font_size: Math.round((safeConfig?.suggestion_font_size || 14) * 0.9),
    brand_name_font_size: Math.round((safeConfig?.brand_name_font_size || 18) * 0.9),
    uploader_enabled: true // Ensure uploader is enabled in mobile view
  } : safeConfig;

  if (fullPage) {
    return (
      <Widget
        instanceId={instanceId}
        designConfig={config}
        fullPage={true}
        deployment={deployment}
        className="w-full h-full"
        containerWidth={previewMode === 'mobile' ? 600 : previewMode === 'iframe' ? 500 : undefined}
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-auto bg-zinc-100 dark:bg-zinc-900">
      {previewMode === 'mobile' ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-auto">
          <div className="relative my-8 bg-white dark:bg-zinc-950 rounded-[3rem] shadow-2xl" style={{ 
            width: '390px',
            height: '844px',
            padding: '20px 10px',
            boxShadow: '0 0 0 10px var(--zinc-800)'
          }}>
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-zinc-900 dark:bg-zinc-800 rounded-b-2xl" />
            
            {/* Content container with iPhone-like scrolling */}
            <div className="w-full h-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-black">
              <div className="w-full h-full overflow-auto overscroll-y-contain">
                <Widget
                  instanceId={instanceId}
                  designConfig={config}
                  deployment={deployment}
                  className="w-full h-full"
                  containerWidth={370} // Account for the device frame padding
                />
              </div>
            </div>
          </div>
        </div>
      ) : previewMode === 'iframe' ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-auto p-8">
          {/* Calculate actual iframe dimensions */}
          {(() => {
            const width = config?.iframe_width || '500px';
            const height = config?.iframe_height || '600px';
            
            // Convert percentage width to pixels for preview (assuming 1200px container)
            const actualWidth = width === '100%' ? '800px' : width;
            const numericWidth = parseInt(actualWidth.replace('px', ''));
            const numericHeight = parseInt(height.replace('px', ''));
            
            // Determine if mobile layout will be used (< 1024px)
            const isMobileLayout = numericWidth < 1024;
            
            return (
              <div className="flex flex-col items-center space-y-4">
                {/* Info header */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Iframe Preview
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Showing widget at configured iframe size: {width} × {height}
                  </p>
                  
                  {/* Layout indicator */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    isMobileLayout 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' 
                      : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  }`}>
                    {isMobileLayout ? (
                      <>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v16H7V4z"/>
                        </svg>
                        Mobile Layout (width {numericWidth}px &lt; 1024px)
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM21 14H3V4h18v10z"/>
                        </svg>
                        Desktop Layout (width {numericWidth}px ≥ 1024px)
                      </>
                    )}
                  </div>
                  
                  <div className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">
                    &lt;iframe width="{width}" height="{height}" src="..."&gt;&lt;/iframe&gt;
                  </div>
                  
                  {/* Debug info */}
                  <div className="text-xs text-zinc-400 dark:text-zinc-600">
                    Container width: {numericWidth}px | Current layout: {config?.layout_mode || 'prompt-top'}
                  </div>
                </div>
                
                {/* Iframe container */}
                <div 
                  className="bg-white dark:bg-zinc-950 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                  style={{
                    width: actualWidth,
                    height: height,
                    maxWidth: '90vw',
                    maxHeight: '70vh'
                  }}
                >
                  <Widget
                    instanceId={instanceId}
                    designConfig={config}
                    deployment={deployment}
                    className="w-full h-full"
                    containerWidth={numericWidth}
                  />
                </div>
                
                {/* Additional info */}
                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center max-w-md">
                  {isMobileLayout ? (
                    "Widget will automatically use mobile-optimized layout due to width constraint."
                  ) : (
                    `Widget will use your configured layout mode: ${config?.layout_mode || 'prompt-top'}`
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <Widget
          instanceId={instanceId}
          designConfig={config}
          deployment={deployment}
          className="w-full h-full"
          containerWidth={containerWidth}
        />
      )}
    </div>
  );
}); 