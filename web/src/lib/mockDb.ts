import { randomUUID } from "crypto";

type Inspection = {
  id: string;
  propertyName: string;
  address?: string;
  unit?: string;
  notes?: string;
  status: "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "SUBMITTED" | "ARCHIVED";
  photos: { id: string; key: string; fileName: string; bytes?: number }[];
  checklist: any[];
  flags: any[];
  createdAt: number;
  updatedAt: number;
};

type Report = {
  id: string;
  inspectionId: string;
  status: "queued" | "ready" | "failed";
  pdfKey?: string;
  sizeBytes?: number;
  createdAt: number;
  updatedAt: number;
};

export const db = {
  inspections: new Map<string, Inspection>(),
  reports: new Map<string, Report>(),
};

export function insertInspection(p: Partial<Inspection> & { propertyName: string }) {
  const id = randomUUID();
  const now = Date.now();
  const row: Inspection = {
    id,
    status: "DRAFT",
    photos: [],
    checklist: [],
    flags: [],
    createdAt: now,
    updatedAt: now,
    propertyName: p.propertyName,
    address: p.address,
    unit: p.unit,
    notes: p.notes,
  };
  db.inspections.set(id, row);
  return row;
}


