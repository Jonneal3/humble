"use client";

import React, { useEffect, useState, useRef } from "react";
import { DesignSettings, getEffectivePadding } from "@/types/design";
import { Widget } from "@/components/widget/Widget";

interface WidgetPageViewProps {
  instanceId: string;
  liveConfig?: DesignSettings | null;
  className?: string;
  style?: React.CSSProperties;
  fullPage?: boolean;
  deployment?: boolean;
}

// Pure, optimized component for real-time widget preview that mirrors the actual widget structure
export const WidgetPageView = React.memo<WidgetPageViewProps>(({ 
  instanceId, 
  liveConfig, 
  className, 
  style, 
  fullPage = false,
  deployment = true
}) => {
  const [isClient, setIsClient] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add resize observer to track container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate container padding exactly like the widget page does
  const effectivePadding = getEffectivePadding(liveConfig || {});
  const paddingStyle = {
    paddingTop: `${effectivePadding.top}px`,
    paddingRight: `${effectivePadding.right}px`,
    paddingBottom: `${effectivePadding.bottom}px`,
    paddingLeft: `${effectivePadding.left}px`,
  };

  if (!isClient) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full flex items-center justify-center overflow-hidden ${className || ""}`}
      style={{ 
        margin: 0, 
        backgroundColor: fullPage ? 'transparent' : (liveConfig?.background_color || '#ffffff'),
        boxSizing: 'border-box',
        height: fullPage ? '100vh' : '100%',
        ...style
      }}
    >
      <div 
        className="w-full relative overflow-hidden"
        style={{ 
          height: fullPage ? '100vh' : '100%'
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Widget
            instanceId={instanceId}
            designConfig={liveConfig || undefined}
            fullPage={fullPage}
            deployment={deployment}
            containerWidth={containerWidth}
          />
        </div>
      </div>
    </div>
  );
}); 