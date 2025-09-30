export default async function ReportsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/reports`, { cache: "no-store" });
  const { items } = await res.json();
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Reports</h1>
      {items?.length ? (
        <ul className="text-sm divide-y">
          {items.map((r: any) => (
            <li key={r.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">Report {r.id.slice(0, 8)}...</div>
                <div className="text-gray-500">{new Date(r.updatedAt).toLocaleString()} • {r.status}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No reports yet.</p>
      )}
    </div>
  );
}



