"use client";

import React from "react";
import { DesignSettings } from "@/types/design";
import { Widget } from "@/components/widget/Widget";

interface WidgetPageViewProps {
  instanceId: string;
  liveConfig?: DesignSettings | null;
  className?: string;
  style?: React.CSSProperties;
  fullPage?: boolean;
}

// Pure, optimized component for real-time widget preview
export const WidgetPageView = React.memo<WidgetPageViewProps>(({ 
  instanceId, 
  liveConfig, 
  className, 
  style, 
  fullPage = false 
}) => {
  return (
    <Widget
      instanceId={instanceId}
      designConfig={liveConfig || undefined}
      className={className || "w-full h-full"}
      fullPage={fullPage}
      deployment={false}
    />
  );
}); 