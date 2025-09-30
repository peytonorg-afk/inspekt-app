import { NextResponse } from "next/server";
import { db, insertInspection } from "@/lib/mockDb";
import { CreateInspection } from "@/lib/schemas";

export async function GET() {
  const rows = Array.from(db.inspections.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateInspection.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = insertInspection(parsed.data);
  return NextResponse.json(row, { status: 201 });
}


