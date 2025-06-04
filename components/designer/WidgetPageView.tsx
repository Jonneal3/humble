"use client";

import React from "react";
import { DesignSettings, getEffectivePadding } from "@/types/design";
import { Widget } from "@/components/widget/Widget";

interface WidgetPageViewProps {
  instanceId: string;
  liveConfig?: DesignSettings | null;
  className?: string;
  style?: React.CSSProperties;
  fullPage?: boolean;
}

// Pure, optimized component for real-time widget preview that mirrors the actual widget structure
export const WidgetPageView = React.memo<WidgetPageViewProps>(({ 
  instanceId, 
  liveConfig, 
  className, 
  style, 
  fullPage = false 
}) => {
  // Calculate container padding exactly like the widget page does
  const effectivePadding = getEffectivePadding(liveConfig || {});
  const paddingStyle = {
    paddingTop: `${Math.max(1, Math.min(8, effectivePadding.top * 0.2))}%`,
    paddingRight: `${Math.max(1, Math.min(8, effectivePadding.right * 0.2))}%`,
    paddingBottom: `${Math.max(1, Math.min(8, effectivePadding.bottom * 0.2))}%`,
    paddingLeft: `${Math.max(1, Math.min(8, effectivePadding.left * 0.2))}%`,
  };

  return (
    <div 
      className={`w-full h-full flex items-center justify-center ${className || ""}`}
      style={{ 
        margin: 0, 
        backgroundColor: fullPage ? 'transparent' : (liveConfig?.background_color || '#ffffff'),
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div 
        className="relative w-full h-full"
        style={fullPage ? {} : paddingStyle}
      >
        <div className="absolute inset-0">
          <Widget
            instanceId={instanceId}
            designConfig={liveConfig || undefined}
            fullPage={fullPage}
            deployment={false}
          />
        </div>
      </div>
    </div>
  );
}); 