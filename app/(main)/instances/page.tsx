"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useInstances } from "@/contexts/InstancesContext";

export default function InstancesPage() {
  const { instances, loading } = useInstances();
  const router = useRouter();

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Instances</h1>
        <Button onClick={() => router.push('/instances/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Instance
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading instances...</div>
      ) : instances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground mb-4">You haven't created any instances yet.</p>
          <Button onClick={() => router.push('/instances/new')}>
            Create Your First Instance
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((instance) => (
            <div
              key={instance.id}
              className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card"
            >
              <h2 className="text-xl font-semibold mb-2 text-foreground">{instance.name}</h2>
              {instance.description && (
                <p className="text-muted-foreground mb-4">{instance.description}</p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/design/${instance.id}`)}
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 