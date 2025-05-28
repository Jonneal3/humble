"use client";

import { useState } from "react";
import { PromptInput } from "@/components/PromptInput";
import { ImageUpload } from "./ImageUpload";
import { Upload, X, ArrowRight, Sparkles } from "lucide-react";
import { DesignSettings, defaultDesignSettings } from "@/types/design";

interface WidgetContentProps {
  designSettings?: DesignSettings;
  onPromptSubmit: (prompt: string) => void;
  onImagesChange: (images: Array<{ image: string | null }>) => void;
}

export function WidgetContent({ designSettings = defaultDesignSettings, onPromptSubmit, onImagesChange }: WidgetContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    try {
      await onPromptSubmit(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (image: string | null) => {
    setReferenceImage(image);
  };

  const styleSuggestions = [
    { text: "Cinematic", prompt: "cinematic lighting, dramatic shadows, film grain" },
    { text: "Watercolor", prompt: "watercolor painting style, soft edges, flowing colors" },
    { text: "Pixel Art", prompt: "8-bit pixel art style, retro gaming aesthetic" },
    { text: "Sketch", prompt: "hand-drawn sketch style, pencil lines, artistic" },
    { text: "Oil Painting", prompt: "oil painting style, rich textures, classical art" },
    { text: "Anime", prompt: "anime style, vibrant colors, expressive features" },
  ];

  return (
    <div 
      className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      style={{
        fontFamily: designSettings?.brand_font || defaultDesignSettings.brand_font,
      }}
    >
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-8">
            {/* Image Upload */}
            <div 
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                border: `1px solid ${designSettings?.upload_border || 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: `${designSettings?.border_radius || 16}px`,
              }}
            >
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={referenceImage}
                customStyles={{
                  container: {
                    backgroundColor: 'transparent',
                    color: designSettings?.upload_text || defaultDesignSettings.upload_text,
                    borderColor: 'transparent',
                    borderRadius: `${designSettings?.border_radius || 16}px`,
                    borderWidth: '0',
                    padding: '0',
                    height: '100%',
                  },
                  button: {
                    backgroundColor: 'transparent',
                    color: designSettings?.upload_text || defaultDesignSettings.upload_text,
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {!referenceImage ? (
                  <div className="flex flex-col items-center gap-4 p-8">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                      style={{
                        backgroundColor: `${designSettings?.upload_icon_color || designSettings?.upload_text || defaultDesignSettings.upload_text}20`,
                      }}
                    >
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-base font-medium">Click to upload or drag and drop</div>
                    <p className="text-sm opacity-60">PNG, JPG up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full group">
                    <img 
                      src={referenceImage} 
                      alt="Reference" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <button 
                        className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors duration-300"
                        onClick={() => setReferenceImage(null)}
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </ImageUpload>
            </div>

            {/* Prompt Input */}
            <PromptInput
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              suggestions={styleSuggestions}
              customStyles={{
                container: {
                  backgroundColor: 'white',
                  borderRadius: `${designSettings?.border_radius || 16}px`,
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                input: {
                  backgroundColor: 'transparent',
                  color: designSettings?.input_text || defaultDesignSettings.input_text,
                  border: `1px solid ${designSettings?.input_border || 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: `${designSettings?.border_radius || 16}px`,
                  padding: '1rem',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  resize: 'none',
                  width: '100%',
                  minHeight: '120px',
                  transition: 'all 0.3s ease',
                  fontFamily: designSettings?.text_font || designSettings?.brand_font || defaultDesignSettings.brand_font,
                  outline: 'none',
                },
                button: {
                  backgroundColor: designSettings?.button_background || defaultDesignSettings.button_background,
                  color: designSettings?.button_text || defaultDesignSettings.button_text,
                  border: 'none',
                  borderRadius: `${designSettings?.border_radius || 16}px`,
                  padding: '0.75rem',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                },
                border: {
                  borderColor: designSettings?.input_border || 'rgba(0, 0, 0, 0.1)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                },
              }}
            />
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {styleSuggestions.map((style, index) => (
                <div 
                  key={index}
                  className="group relative aspect-square cursor-pointer"
                  onClick={() => handlePromptSubmit(style.prompt)}
                >
                  <div 
                    className="absolute inset-0 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      border: `1px solid ${designSettings?.input_border || 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: `${designSettings?.border_radius || 16}px`,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300"
                      style={{
                        backgroundColor: `${designSettings?.button_background || defaultDesignSettings.button_background}20`,
                      }}
                    >
                      <Sparkles 
                        className="w-6 h-6" 
                        style={{ 
                          color: designSettings?.button_background || defaultDesignSettings.button_background,
                        }}
                      />
                    </div>
                    <h3 
                      className="text-lg font-medium mb-2"
                      style={{ 
                        color: designSettings?.input_text || defaultDesignSettings.input_text,
                        fontFamily: designSettings?.text_font || designSettings?.brand_font || defaultDesignSettings.brand_font,
                      }}
                    >
                      {style.text}
                    </h3>
                    <p 
                      className="text-sm opacity-60 line-clamp-2"
                      style={{ 
                        color: designSettings?.input_text || defaultDesignSettings.input_text,
                        fontFamily: designSettings?.text_font || designSettings?.brand_font || defaultDesignSettings.brand_font,
                      }}
                    >
                      {style.prompt}
                    </p>
                  </div>
                  <div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center"
                    style={{ 
                      borderRadius: `${designSettings?.border_radius || 16}px`,
                      color: 'white',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium">Apply style</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 