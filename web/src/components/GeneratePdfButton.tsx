"use client";

import { useState } from "react";
import { api, type Report } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function GeneratePdfButton({ inspectionId }: { inspectionId: string }) {
  const [busy, setBusy] = useState(false);
  async function onClick() {
    try {
      setBusy(true);
      const rpt = await api<Report>(`/api/reports/${inspectionId}/generate`, { method: "POST" });
      window.open(`/api/reports/${rpt.id}/download`, "_blank");
    } catch (e) {
      // fallback UX without toast
      alert("Failed to generate PDF");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Button type="button" onClick={onClick} disabled={busy} className="bg-[var(--brand-accent)] hover:opacity-90">
      {busy ? "Generating..." : "Generate PDF"}
    </Button>
  );
}


