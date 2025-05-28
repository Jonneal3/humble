"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Widget } from "@/components/widget/Widget";
import { DesignSettings, defaultDesignSettings, stylePresets, WidgetStyle } from "@/types/design";

interface Image {
  id: string;
  url: string;
  created_at: string;
}

export default function WidgetPage({ params }: { params: { instanceId: string } }) {
  const [config, setConfig] = useState<DesignSettings | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadInstanceData = async () => {
      try {
        console.log('Starting to load instance data...');
        const { data: instance, error: instanceError } = await supabase
          .from("instances")
          .select("*")
          .eq("id", params.instanceId)
          .single();

        if (instanceError) {
          console.error('Error loading instance:', instanceError);
          throw instanceError;
        }

        console.log('Instance loaded:', instance);

        if (instance?.config) {
          // Get the style preset based on the widget style
          const widgetStyle = (instance.config.widget_style || "modern") as WidgetStyle;
          const stylePreset = stylePresets[widgetStyle];
          
          // Merge configurations in order: default -> style preset -> instance config
          const mergedConfig = {
            ...defaultDesignSettings,
            ...stylePreset,
            ...instance.config,
            // Ensure these values are always set
            show_header: instance.config.show_header ?? true,
            brand_name: instance.config.brand_name || "",
            brand_color: instance.config.brand_color || "#000000",
            brand_font: instance.config.brand_font || "Inter",
            logo_url: instance.config.logo_url || "",
            widget_style: widgetStyle,
          };
          
          console.log('Merged config:', mergedConfig);
          setConfig(mergedConfig as DesignSettings);
        }

        // Load images for this instance
        console.log('Loading images for instance:', params.instanceId);
        const { data: imagesData, error: imagesError } = await supabase
          .from("images")
          .select("*")
          .eq("instance_id", params.instanceId)
          .order("created_at", { ascending: false });

        if (imagesError) {
          console.error('Error loading images:', imagesError);
          throw imagesError;
        }

        if (imagesData) {
          console.log('Images loaded successfully:', imagesData);
          setImages(imagesData);
        } else {
          console.log('No images found for instance');
        }
      } catch (err) {
        console.error("Error in loadInstanceData:", err);
        setError("Failed to load widget configuration");
      }
    };

    loadInstanceData();
  }, [params.instanceId, supabase]);

  if (!config) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div 
      className="w-full min-h-screen h-screen overflow-y-auto"
      style={{
        backgroundColor: config.background_color,
      }}
    >
      <div className="max-w-7xl mx-auto h-full">
        {config.show_header && (
          <header 
            className="sticky top-0 z-10"
            style={{
              backgroundColor: config.background_color,
            }}
          >
            <div className="px-8 py-6 flex items-center">
              <div className="flex items-center gap-4">
                {config.logo_url && (
                  <img 
                    src={config.logo_url} 
                    alt={config.brand_name || "Logo"} 
                    className="h-8 w-auto object-contain"
                  />
                )}
                {config.brand_name && (
                  <div 
                    style={{ 
                      color: config.brand_color,
                      fontFamily: `var(--font-${config.brand_font?.toLowerCase() || 'inter'})`,
                      fontSize: '1.25rem',
                      fontWeight: 600
                    }}
                  >
                    {config.brand_name}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        <main 
          className="px-8 h-[calc(100vh-88px)]"
          style={{
            backgroundColor: config.background_color,
            padding: `${config.padding}px`,
            height: `calc(100vh - ${config.show_header ? '88px' : '0px'})`,
            overflow: 'hidden'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Left Column - Fixed */}
            <div className="lg:col-span-1 h-full">
              <Widget
                instanceId={params.instanceId}
                customStyles={{
                  // Layout styles
                  background: config.background_color,
                  text: config.sidebar_text,
                  border: config.sidebar_border,
                  // Content styles
                  container: {
                    color: config.sidebar_text,
                    borderColor: config.sidebar_border,
                    borderWidth: `${config.border_width}px`,
                    height: '100%',
                    overflow: 'hidden',
                    padding: `${config.padding}px`,
                    backgroundColor: config.background_color,
                    borderRadius: `${config.border_radius}px`,
                    fontFamily: config.brand_font,
                  },
                  input: {
                    backgroundColor: config.input_background,
                    color: config.input_text,
                    borderColor: config.prompt_border,
                    borderRadius: `${config.border_radius}px`,
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem',
                    borderWidth: `${config.border_width}px`,
                    borderStyle: 'solid',
                    fontFamily: config.brand_font,
                    outline: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    WebkitBorderRadius: `${config.border_radius}px`,
                    MozBorderRadius: `${config.border_radius}px`,
                    borderTopLeftRadius: `${config.border_radius}px`,
                    borderTopRightRadius: `${config.border_radius}px`,
                    borderBottomLeftRadius: `${config.border_radius}px`,
                    borderBottomRightRadius: `${config.border_radius}px`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                  },
                  button: {
                    backgroundColor: config.button_background,
                    color: config.button_text,
                    borderColor: config.button_border,
                    borderRadius: `${config.border_radius}px`,
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    borderWidth: `${config.border_width}px`,
                    borderStyle: 'solid',
                    fontFamily: config.brand_font,
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    WebkitBorderRadius: `${config.border_radius}px`,
                    MozBorderRadius: `${config.border_radius}px`,
                    borderTopLeftRadius: `${config.border_radius}px`,
                    borderTopRightRadius: `${config.border_radius}px`,
                    borderBottomLeftRadius: `${config.border_radius}px`,
                    borderBottomRightRadius: `${config.border_radius}px`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  },
                  upload: {
                    backgroundColor: config.upload_background,
                    color: config.upload_text,
                    borderColor: config.upload_border,
                    borderRadius: `${config.border_radius}px`,
                    padding: '2rem',
                    borderWidth: '2px',
                    borderStyle: 'dashed',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: config.brand_font || 'Inter',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                  },
                }}
                onImagesChange={(newImages) => {
                  // Convert the new images to match our Image type
                  const convertedImages = newImages.map(img => ({
                    id: crypto.randomUUID(),
                    url: img.image || '',
                    created_at: new Date().toISOString()
                  }));
                  setImages(convertedImages);
                }}
              />
            </div>
            {/* Right Column - Scrollable */}
            <div className="lg:col-span-2 h-full overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square"
                    style={{
                      backgroundColor: config.background_color,
                      borderRadius: `${config.border_radius}px`,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={image.url}
                      alt="Generated image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 