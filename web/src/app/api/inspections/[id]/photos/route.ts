import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";
import { randomUUID } from "crypto";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { key, fileName, bytes } = await req.json();
  const ins = db.inspections.get(params.id);
  if (!ins) return NextResponse.json({ error: "Not found" }, { status: 404 });
  ins.photos.push({ id: randomUUID(), key, fileName, bytes });
  ins.updatedAt = Date.now();
  db.inspections.set(params.id, ins);
  return NextResponse.json({ ok: true });
}


