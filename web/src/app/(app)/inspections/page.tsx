import Link from "next/link";

export default function InspectionsListPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inspections</h1>
        <Link className="underline" href="/inspections/new">New Inspection</Link>
      </div>
      <p className="text-sm text-gray-600">No inspections yet.</p>
    </div>
  );
}



