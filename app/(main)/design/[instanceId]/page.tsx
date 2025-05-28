import Designer from "@/components/Designer";

export default function DesignPage({ params }: { params: { instanceId: string } }) {
  return <Designer instanceId={params.instanceId} />;
} 