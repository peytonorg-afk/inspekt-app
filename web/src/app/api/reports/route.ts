import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const items = Array.from(db.reports.values()).sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json({ items });
}


