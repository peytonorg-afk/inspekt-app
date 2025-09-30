import Link from "next/link";
import { api } from "@/lib/api";
import { GeneratePdfButton } from "@/components/GeneratePdfButton";

export default async function InspectionDetailPage({ params }: { params: { id: string } }) {
  const ins = await (await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/inspections/${params.id}`, { cache: "no-store" })).json();
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Inspection #{params.id}</div>
        <Link className="underline" href="/reports">Reports</Link>
      </div>
      <div>
        <div className="font-medium">{ins.propertyName}</div>
        <div className="text-gray-500">{ins.address}</div>
      </div>
      <div className="pt-2">
        <GeneratePdfButton inspectionId={params.id} />
      </div>
    </div>
  );
}



