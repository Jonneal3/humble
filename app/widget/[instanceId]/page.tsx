import { Widget } from "@/components/widget/Widget";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { defaultDesignSettings, getEffectivePadding } from "@/types/design";
import { notFound } from "next/navigation";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function WidgetPage({ params }: { params: { instanceId: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch instance config on server side to prevent layout shift
  let designConfig = defaultDesignSettings;
  let instanceExists = false;
  
  try {
    const { data: instance, error } = await supabase
      .from("instances")
      .select("config")
      .eq("id", params.instanceId)
      .single();

    if (error) {
      // If instance doesn't exist, show 404
      if (error.code === 'PGRST116') {
        notFound();
      }
      console.error("Error loading instance config:", error);
    } else {
      instanceExists = true;
      if (instance?.config) {
        // Merge default settings with instance config
        designConfig = {
          ...defaultDesignSettings,
          ...instance.config,
        };
      }
    }
  } catch (error) {
    console.error("Error loading instance config:", error);
    // Continue with default settings if there's an error
  }

  // If instance doesn't exist, this will be handled by notFound() above
  if (!instanceExists) {
    notFound();
  }

  // Calculate container padding as percentage for the main window using individual padding values
  const effectivePadding = getEffectivePadding(designConfig);
  const paddingStyle = {
    paddingTop: `${Math.max(1, Math.min(8, effectivePadding.top * 0.2))}%`,
    paddingRight: `${Math.max(1, Math.min(8, effectivePadding.right * 0.2))}%`,
    paddingBottom: `${Math.max(1, Math.min(8, effectivePadding.bottom * 0.2))}%`,
    paddingLeft: `${Math.max(1, Math.min(8, effectivePadding.left * 0.2))}%`,
  };

  return (
    <div 
      className="w-screen h-screen flex items-center justify-center" 
      style={{ 
        margin: 0, 
        backgroundColor: designConfig.background_color || '#ffffff',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="relative w-full h-full"
        style={paddingStyle}
      >
        <div className="absolute inset-0">
          <Widget 
            instanceId={params.instanceId}
            controlsOnly={false}
            designConfig={designConfig}
            fullPage={false}
            deployment={true}
          />
        </div>
      </div>
    </div>
  );
} 