import Link from "next/link";

export default async function InspectionsListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/inspections`, { cache: "no-store" });
  const { items } = await res.json();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inspections</h1>
        <Link className="underline" href="/inspections/new">New Inspection</Link>
      </div>
      {items?.length ? (
        <ul className="text-sm divide-y">
          {items.map((it: any) => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{it.propertyName}</div>
                <div className="text-gray-500">{new Date(it.updatedAt).toLocaleString()}</div>
              </div>
              <Link className="underline" href={`/inspections/${it.id}`}>Open</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No inspections yet.</p>
      )}
    </div>
  );
}



