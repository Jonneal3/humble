"use client";

import React from "react";
import { DesignSettings, defaultDesignSettings } from "@/types/design";
import { Widget } from "@/components/widget/Widget";

interface WidgetPageViewProps {
  instanceId: string;
  liveConfig?: DesignSettings | null; // For live preview in designer
  className?: string;
  style?: React.CSSProperties;
}

export function WidgetPageView({ instanceId, liveConfig, className, style }: WidgetPageViewProps) {
  // For live preview, merge the live config with defaults
  const config = liveConfig ? {
    ...defaultDesignSettings,
    ...liveConfig
  } : undefined; // Let Widget component load from database if no live config

  return (
    <div 
      className={`w-full h-full overflow-hidden ${className || ''}`}
      style={{
        backgroundColor: config?.background_color || '#ffffff',
        overscrollBehavior: 'none', // Prevent elastic scrolling
        ...style
      }}
    >
      <Widget
        instanceId={instanceId}
        designConfig={config}
        className="w-full h-full"
      />
    </div>
  );
} 