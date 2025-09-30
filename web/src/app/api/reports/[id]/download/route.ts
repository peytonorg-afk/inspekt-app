import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { db } from "@/lib/mockDb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const rpt = db.reports.get(params.id);
  if (!rpt) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  const ins = db.inspections.get(rpt.inspectionId);
  if (!ins) return NextResponse.json({ error: "Inspection not found" }, { status: 404 });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const title = "PropertyFax — Inspection Report";
  const gray = rgb(0.15, 0.18, 0.22);

  page.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: gray });
  page.drawText(title, { x: 24, y: 760, size: 14, font, color: rgb(1, 1, 1) });

  let y = 710;
  function line(label: string, value?: string) {
    page.drawText(`${label}:`, { x: 24, y, size: 12, font, color: gray });
    page.drawText(value || "-", { x: 150, y, size: 12, font, color: rgb(0, 0, 0) });
    y -= 20;
  }
  line("Property", ins.propertyName);
  line("Address", ins.address || "");
  line("Unit", ins.unit || "");
  line("Status", ins.status);
  y -= 10;
  page.drawText("Notes:", { x: 24, y, size: 12, font, color: gray });
  y -= 18;
  page.drawText((ins.notes || "").slice(0, 800), {
    x: 24,
    y,
    size: 11,
    font,
    color: rgb(0, 0, 0),
    maxWidth: 560,
    lineHeight: 14,
  });

  const bytes = await pdf.save();
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="report-${rpt.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}


