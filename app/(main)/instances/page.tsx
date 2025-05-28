"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";

interface Instance {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function InstancesPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadInstances = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading instances:', error);
        return;
      }

      setInstances(data || []);
      setLoading(false);
    };

    loadInstances();
  }, [supabase, router]);

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Instances</h1>
        <Button onClick={() => router.push('/instances/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Instance
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading instances...</div>
      ) : instances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500 mb-4">You haven't created any instances yet.</p>
          <Button onClick={() => router.push('/instances/new')}>
            Create Your First Instance
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((instance) => (
            <div
              key={instance.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{instance.name}</h2>
              {instance.description && (
                <p className="text-gray-500 mb-4">{instance.description}</p>
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