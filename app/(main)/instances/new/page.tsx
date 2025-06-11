"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/lib/hooks";
import { useInstances } from "@/contexts/InstancesContext";

export default function NewInstancePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addInstance } = useInstances();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Instance name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      console.log("Creating instance for user:", user.id);
      console.log("User email:", user.email);

      // Generate a slug from the name
      const slug = name.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50); // Limit length

      console.log("Generated slug:", slug);

      const { data, error } = await supabase
        .from("instances")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          user_id: user.id,
          slug: slug,
          template_id: null,
          is_public: false,
          submission_limit_enabled: false,
          max_submissions_per_session: 5,
          config: {
            brand_name: name.trim(),
            brand_color: "#000000",
            brand_font: "Inter",
            widget_width: 100,
            widget_height: 600,
            widget_style: "modern",
            show_header: true,
            border_radius: 8,
            border_width: 1,
            border_color: "#ffffff",
            background_color: "#ffffff",
            text_color: "#000000",
            input_background: "#f8fafc",
            input_text: "#1e293b",
            input_border: "#e2e8f0",
            button_background: "#3b82f6",
            button_text: "#ffffff",
            button_border: "#3b82f6",
            prompt_border: "#e2e8f0",
            upload_background: "#f1f5f9",
            upload_text: "#475569",
            upload_border: "#cbd5e1",
            sidebar_text: "#64748b",
            sidebar_border: "#e2e8f0",
            shadow: "medium",
            padding: 16,
          }
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Instance created successfully:", data);

      // Add to global state
      addInstance(data);

      toast({
        title: "Success",
        description: "Instance created successfully!",
      });

      // Navigate to the design page for the new instance
      router.push(`/design/${data.id}`);
    } catch (error) {
      console.error("Error creating instance:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Unknown error occurred";
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = error.message as string;
        } else if ('error' in error) {
          errorMessage = (error as any).error;
        } else if ('details' in error) {
          errorMessage = (error as any).details;
        }
      }
      
      console.error("Formatted error message:", errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to create instance: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Create New Instance</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new widget instance for your application
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Instance Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter instance name (e.g., 'Company Headshots', 'Profile Pictures')"
              className="transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used as the default brand name in your widget
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this instance (optional)"
              className="min-h-[100px] transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Help identify this instance in your dashboard
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="min-w-[120px]"
              >
                {loading ? "Creating..." : "Create Instance"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 