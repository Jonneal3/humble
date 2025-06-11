import { Metadata } from "next";
import Designer from "@/components/designer/Designer";

interface Props {
  params: {
    instanceId: string;
  };
}

export default function DesignPage({ params }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Designer instanceId={params.instanceId} />
    </div>
  );
} 