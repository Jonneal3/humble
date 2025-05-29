import Designer from "@/components/designer/Designer";

export default function DesignPage({ params }: { params: { instanceId: string } }) {
  return <Designer instanceId={params.instanceId} />;
} 