import { Widget } from "@/components/widget/Widget";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { defaultDesignSettings } from "@/types/design";
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

  return (
    <div className="w-screen h-screen" style={{ margin: 0, padding: 0 }}>
      <Widget 
        instanceId={params.instanceId}
        controlsOnly={false}
        designConfig={designConfig}
        fullPage={true}
        deployment={true}
      />
    </div>
  );
} 