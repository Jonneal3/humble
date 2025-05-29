"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks";
import { useInstances } from "@/contexts/InstancesContext";

export default function DesignerInstancesPage() {
  const { instances, loading, error } = useInstances();
  const router = useRouter();
  const { toast } = useToast();

  // Show error toast if there's an error
  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Your Instances</h1>
          <Link href="/instances/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Instance
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-lg p-6 animate-pulse bg-card">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Your Instances</h1>
        <Link href="/instances/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Instance
          </Button>
        </Link>
      </div>

      {instances.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 text-foreground">No instances yet</h2>
          <p className="text-muted-foreground mb-4">Create your first instance to get started</p>
          <Link href="/instances/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Instance
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-4">Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {instances.map((instance) => (
              <div key={instance.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <h3 className="font-semibold text-foreground">{instance.name || 'Unnamed Instance'}</h3>
                  </div>
                  <div className="col-span-5">
                    <p className="text-muted-foreground text-sm">
                      {instance.description || 'No description'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(instance.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs text-foreground hover:text-primary"
                      title="Open Designer"
                      onClick={() => {
                        console.log('Navigating to:', `/design/${instance.id}`);
                        router.push(`/design/${instance.id}`);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 