"use client";

import { WidgetLayout } from "./WidgetLayout";
import { WidgetContent } from "./WidgetContent";

interface LayoutStyles {
  background?: string;
  text?: string;
  border?: string;
}

interface ContentStyles {
  container?: React.CSSProperties;
  header?: React.CSSProperties;
  title?: React.CSSProperties;
  subtitle?: React.CSSProperties;
  input?: React.CSSProperties;
  button?: React.CSSProperties;
  upload?: React.CSSProperties;
  border?: React.CSSProperties;
}

interface WidgetProps {
  instanceId: string;
  customStyles?: LayoutStyles & ContentStyles;
  onImagesChange?: (images: Array<{ image: string | null }>) => void;
}

export function Widget({
  instanceId,
  customStyles,
  onImagesChange,
}: WidgetProps) {
  const layoutStyles: LayoutStyles = {
    background: customStyles?.background,
    text: customStyles?.text,
    border: customStyles?.border
  };

  const contentStyles: ContentStyles = {
    container: customStyles?.container,
    header: customStyles?.header,
    title: customStyles?.title,
    subtitle: customStyles?.subtitle,
    input: customStyles?.input,
    button: customStyles?.button,
    upload: customStyles?.upload,
    border: customStyles?.border
  };

  return (
    <WidgetLayout customStyles={layoutStyles}>
      <WidgetContent
        instanceId={instanceId}
        customStyles={contentStyles}
        onImagesChange={onImagesChange}
      />
    </WidgetLayout>
  );
} 