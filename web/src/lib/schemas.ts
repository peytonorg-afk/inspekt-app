import { z } from "zod";

export const ChecklistItem = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(["OK", "ISSUE", "NA"]),
  note: z.string().optional(),
});

export const CreateInspection = z.object({
  propertyName: z.string().min(2),
  address: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  checklist: z.array(ChecklistItem).default([]),
  flags: z
    .array(
      z.object({
        label: z.string(),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        note: z.string().optional(),
      })
    )
    .default([]),
});

export type CreateInspectionInput = z.infer<typeof CreateInspection>;


