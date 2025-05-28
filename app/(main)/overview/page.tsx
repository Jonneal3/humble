"use client";

import { Plus, Settings, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from "@/lib/hooks";

interface Instance {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  user_id: string;
}

export default function OverviewPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No user found');
          return;
        }

        const { data, error } = await supabase
          .from('instances')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        console.log('Fetched instances:', data);
        setInstances(data || []);
      } catch (error) {
        console.error('Error fetching instances:', error);
        toast({
          title: "Error",
          description: "Failed to load instances. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, [supabase, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Instances</h1>
          <Link href="/instances/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Instance
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Instances</h1>
        <Link href="/instances/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Instance
          </Button>
        </Link>
      </div>

      {instances.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No instances yet</h2>
          <p className="text-gray-600 mb-4">Create your first instance to get started</p>
          <Link href="/instances/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Instance
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-4">Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          <div className="divide-y">
            {instances.map((instance) => (
              <div key={instance.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <h3 className="font-semibold text-gray-900">{instance.name || 'Unnamed Instance'}</h3>
                  </div>
                  <div className="col-span-5">
                    <p className="text-gray-600 text-sm">
                      {instance.description || 'No description'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                      {new Date(instance.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
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