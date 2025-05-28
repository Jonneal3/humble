"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (image: string | null) => void;
  currentImage: string | null;
  customStyles?: {
    container?: React.CSSProperties;
    button?: React.CSSProperties;
  };
  children?: React.ReactNode;
}

export function ImageUpload({
  onImageUpload,
  currentImage,
  customStyles,
  children
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg transition-all duration-200",
        isDragging && "ring-2 ring-primary ring-offset-2"
      )}
      style={customStyles?.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="w-full h-full"
        onClick={() => fileInputRef.current?.click()}
        style={customStyles?.button}
      >
        {children}
      </button>
    </div>
  );
} 