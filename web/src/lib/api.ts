import { z } from "zod";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const Report = z.object({
  id: z.string(),
  inspectionId: z.string(),
  status: z.enum(["queued", "ready", "failed"]),
  pdfKey: z.string().optional(),
  sizeBytes: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type Report = z.infer<typeof Report>;


