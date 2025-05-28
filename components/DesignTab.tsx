"use client";

import { useState } from "react";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
import {
  MODEL_CONFIGS,
  PROVIDERS,
  PROVIDER_ORDER,
  ProviderKey,
  ModelMode,
  initializeProviderRecord,
} from "@/lib/provider-config";
import { Suggestion, getRandomSuggestions } from "@/lib/suggestions";
import { useImageGeneration } from "@/hooks/use-image-generation";

interface DesignTabProps {
  customStyles?: {
    container?: React.CSSProperties;
    header?: React.CSSProperties;
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    border?: {
      color?: string;
    };
    brand?: {
      color?: string;
      font?: string;
    };
  };
  title?: string;
  subtitle?: string;
}

export function DesignTab({
  customStyles,
  title,
  subtitle,
}: DesignTabProps) {
  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
  } = useImageGeneration();

  const [showProviders, setShowProviders] = useState(true);
  const [selectedModels, setSelectedModels] = useState<
    Record<ProviderKey, string>
  >(MODEL_CONFIGS.performance);
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true),
  );
  const [mode, setMode] = useState<ModelMode>("performance");
  const [referenceImage, setReferenceImage] = useState<string | undefined>(undefined);

  const handleModeChange = (newMode: ModelMode) => {
    setMode(newMode);
    setSelectedModels(MODEL_CONFIGS[newMode]);
    setShowProviders(true);
  };

  const handleModelChange = (providerKey: ProviderKey, model: string) => {
    setSelectedModels((prev) => ({ ...prev, [providerKey]: model }));
  };

  const handleProviderToggle = (provider: string, enabled: boolean) => {
    setEnabledProviders((prev) => ({
      ...prev,
      [provider]: enabled,
    }));
  };

  const providerToModel = {
    replicate: selectedModels.replicate,
    vertex: selectedModels.vertex,
    openai: selectedModels.openai,
    fireworks: selectedModels.fireworks,
  };

  const handlePromptSubmit = (newPrompt: string) => {
    const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
    if (activeProviders.length > 0) {
      startGeneration(newPrompt, activeProviders, providerToModel);
    }
    setShowProviders(false);
  };

  return (
    <div 
      className="min-h-screen py-4 sm:py-6 px-3 sm:px-6 lg:px-8"
      style={customStyles?.container}
    >
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-4 sm:mb-6" style={customStyles?.header}>
            <h1 
              className="text-xl sm:text-2xl font-semibold text-center mb-2"
              style={customStyles?.title}
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                className="text-sm text-center opacity-60"
                style={customStyles?.subtitle}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Input Controls */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {/* Reference Image Upload */}
            <div 
              className="rounded-xl border-2 border-dashed p-3 sm:p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
              style={{
                backgroundColor: customStyles?.container?.backgroundColor,
                borderColor: customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)',
                opacity: 0.8
              }}
            >
              {!referenceImage ? (
                <div className="space-y-2">
                  <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-xs opacity-60">PNG, JPG up to 10MB</p>
                </div>
              ) : (
                <div className="relative aspect-square">
                  {referenceImage && (
                    <img 
                      src={referenceImage} 
                      alt="Reference" 
                      className="rounded-lg object-cover w-full h-full"
                    />
                  )}
                  <button 
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    onClick={() => setReferenceImage(undefined)}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <PromptInput
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              showProviders={showProviders}
              onToggleProviders={() => setShowProviders(prev => !prev)}
              mode={mode}
              onModeChange={handleModeChange}
              suggestions={getRandomSuggestions()}
              customStyles={{
                container: {
                  backgroundColor: customStyles?.container?.backgroundColor,
                },
                input: {
                  backgroundColor: customStyles?.container?.backgroundColor,
                  color: customStyles?.title?.color,
                  border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease',
                },
                button: {
                  backgroundColor: customStyles?.container?.backgroundColor,
                  color: customStyles?.title?.color,
                  border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                  transition: 'all 0.2s ease',
                },
                suggestionButton: {
                  backgroundColor: customStyles?.container?.backgroundColor,
                  color: customStyles?.title?.color,
                  border: `1px solid ${customStyles?.border?.color || 'rgba(0, 0, 0, 0.1)'}`,
                  transition: 'all 0.2s ease',
                },
                submitButton: {
                  backgroundColor: customStyles?.brand?.color || customStyles?.title?.color,
                  color: customStyles?.container?.backgroundColor,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                },
              }}
            />
          </div>

          {/* Right Column - Generated Results */}
          <div className="space-y-4 lg:col-span-2">
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image.image} 
                      alt={`Generated ${index + 1}`} 
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pr-2">
                {/* ... existing style suggestions code ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 