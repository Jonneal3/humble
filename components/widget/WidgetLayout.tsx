"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/homepage/theme-provider";

interface WidgetLayoutProps {
  children: ReactNode;
  customStyles?: {
    background?: string;
    text?: string;
    border?: string;
  };
}

export function WidgetLayout({
  children,
  customStyles = {}
}: WidgetLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div 
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
        style={{
          backgroundColor: customStyles.background || '#ffffff',
          color: customStyles.text || '#000000',
          border: customStyles.border ? `1px solid ${customStyles.border}` : 'none'
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
} 