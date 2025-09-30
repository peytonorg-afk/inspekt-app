import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const row = db.inspections.get(params.id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const row = db.inspections.get(params.id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const patch = await req.json();
  const updated = { ...row, ...patch, updatedAt: Date.now() };
  db.inspections.set(params.id, updated);
  return NextResponse.json(updated);
}


