import type { ReactNode } from "react";
import Link from "next/link";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]" style={{ backgroundColor: "var(--brand-bg)", color: "white" }}>
      <aside className="p-4 border-r border-white/10">
        <div className="mb-4 font-bold">PropertyFax</div>
        <nav className="grid gap-2 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/inspections" className="hover:underline">Inspections</Link>
          <Link href="/reports" className="hover:underline">Reports</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </nav>
      </aside>
      <div>
        <header className="px-6 py-4 border-b border-white/10">Inspection Capture & Report</header>
        <main className="p-6 bg-white text-black min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}



