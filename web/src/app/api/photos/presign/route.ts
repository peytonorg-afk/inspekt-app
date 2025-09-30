import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST() {
  const key = `mock/${randomUUID()}.jpg`;
  return NextResponse.json({
    key,
    url: "https://example-upload-url.invalid",
    fields: {},
  });
}


