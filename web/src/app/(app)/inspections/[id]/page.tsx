import Link from "next/link";
import { api, Report } from "@/lib/api";

export default async function InspectionDetailPage({ params }: { params: { id: string } }) {
  const ins = await (await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/inspections/${params.id}`, { cache: "no-store" })).json();
  async function GenerateButton() {
    async function action() {
      "use server";
      const rpt = await api<Report>(`/api/reports/${params.id}/generate`, { method: "POST" });
      // no-op on server; client will fetch download
      return rpt.id;
    }
    return (
      <form action={action} className="mt-4">
        <button className="underline" type="submit">Generate PDF</button>
      </form>
    );
  }

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
      {/* Simple generate hook-up; downloading is done via reports page */}
      {/* @ts-expect-error Server Action component */}
      <GenerateButton />
    </div>
  );
}



