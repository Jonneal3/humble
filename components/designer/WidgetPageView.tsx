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
  deployment?: boolean;
}

export const WidgetPageView = React.memo<WidgetPageViewProps>(({ 
  instanceId, 
  liveConfig,
  className,
  style,
  fullPage = false,
  deployment = true
}) => {
  const safeConfig: DesignSettings | undefined = liveConfig || undefined;

  if (fullPage) {
    return (
      <div className="w-full h-[calc(100vh-24px)] bg-white">
        <Widget
          instanceId={instanceId}
          designConfig={safeConfig}
          fullPage={true}
          deployment={deployment}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        className={`flex-1 min-h-0 flex items-center justify-center bg-gray-100 overflow-auto p-6 ${className || ""}`}
        style={style}
      >
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            width: '400px',
            height: '600px',
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 48px)'
          }}
        >
          <Widget
            instanceId={instanceId}
            designConfig={safeConfig}
            fullPage={false}
            deployment={deployment}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}); 