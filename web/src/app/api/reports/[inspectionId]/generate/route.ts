import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";
import { randomUUID } from "crypto";

export async function POST(_: Request, { params }: { params: { inspectionId: string } }) {
  const ins = db.inspections.get(params.inspectionId);
  if (!ins) return NextResponse.json({ error: "Inspection not found" }, { status: 404 });
  const id = randomUUID();
  const now = Date.now();
  const rpt = {
    id,
    inspectionId: ins.id,
    status: "ready" as const,
    pdfKey: `mock/${id}.pdf`,
    sizeBytes: 123456,
    createdAt: now,
    updatedAt: now,
  };
  db.reports.set(id, rpt);
  return NextResponse.json(rpt, { status: 201 });
}


