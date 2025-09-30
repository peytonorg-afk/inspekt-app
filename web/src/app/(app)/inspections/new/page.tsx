"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { api } from "@/lib/api";
import { draft } from "@/lib/draft";
import { enqueue } from "@/lib/uploadQueue";

type FormValues = {
  propertyName: string;
  address: string;
  notes: string;
  photos: FileList;
  checklist: {
    exteriorOk: boolean;
    interiorOk: boolean;
    hvacOk: boolean;
  };
};

export default function CapturePage() {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      checklist: { exteriorOk: false, interiorOk: false, hvacOk: false },
    },
  });

  const [photoNames, setPhotoNames] = useState<string[]>([]);
  // autosave/restore draft minimal
  React.useEffect(() => {
    (async () => {
      const d = await draft.load();
      if (d?.v) {
        // @ts-expect-error partial
        setValue("propertyName", d.v.propertyName ?? "");
        // restore other fields if present
      }
    })();
  }, [setValue]);
  React.useEffect(() => {
    const sub = watch((v) => draft.save(v));
    return () => sub.unsubscribe();
  }, [watch]);

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotoNames(Array.from(files).map((f) => f.name));
    setValue("photos", files);
  };

  const onSubmit = (data: FormValues) => {
    (async () => {
      try {
        const inspection = await api<{ id: string }>("/api/inspections", {
          method: "POST",
          body: JSON.stringify({
            propertyName: data.propertyName,
            address: data.address,
            notes: data.notes,
            checklist: [],
            flags: [],
          }),
        });

        const files = Array.from(data.photos ?? []);
        for (const file of files) {
          try {
            await api(`/api/inspections/${inspection.id}/photos`, {
              method: "POST",
              body: JSON.stringify({ key: "mock/local-file.jpg", fileName: file.name, bytes: file.size }),
            });
          } catch {
            enqueue({ inspectionId: inspection.id, file });
          }
        }

        alert("Saved draft to mock API.");
      } catch (e) {
        console.error(e);
        alert("Failed to save draft.");
      }
    })();
  };

  const checklist = watch("checklist");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bg)" }}>
      {/* Header */}
      <header style={{ backgroundColor: "var(--brand-bg)", color: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md grid place-items-center font-bold" style={{ backgroundColor: "color-mix(in oklab, var(--brand-accent) 20%, transparent)" }}>
              P
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-wide">PropertyFax</h1>
              <p className="text-xs/5 opacity-70">Inspection Capture & Report</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="text-white" style={{ backgroundColor: "var(--brand-badge)" }}>Draft</Badge>
            <Badge variant="outline" className="border-white/20 text-white">v0.1</Badge>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-6 py-6">
        {/* Summary strip */}
        <Card className="rounded-[var(--radius-xl2)] shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="text-white px-6 py-4 flex items-center justify-between" style={{ backgroundColor: "var(--brand-panel)" }}>
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider opacity-70">Active Inspection</span>
              <span className="text-lg font-semibold">Create New Report</span>
            </div>
            <div className="flex gap-2">
              <Badge className="text-white" style={{ backgroundColor: "var(--brand-badge)" }}>No Critical Issues</Badge>
              <Badge variant="secondary" className="text-[color:var(--brand-ink)]">0 Photos</Badge>
            </div>
          </div>

          <CardContent className="bg-white">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
              {/* Left column */}
              <div className="space-y-5">
                <div>
                  <Label className="text-sm">Property Name</Label>
                  <Input placeholder="Ex: Maple Ridge Apts — Unit 204" {...register("propertyName")} />
                </div>

                <div>
                  <Label className="text-sm">Address</Label>
                  <Input placeholder="123 Main St, Salt Lake City, UT" {...register("address")} />
                </div>

                <div>
                  <Label className="text-sm">Notes</Label>
                  <Textarea rows={6} placeholder="High-level notes (access, tenant present, weather, etc.)" {...register("notes")} />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm">Checklist</Label>
                  <div className="rounded-lg border p-4 grid grid-cols-1 gap-3">
                    <label className="flex items-center gap-3">
                      <Checkbox
                        checked={!!checklist?.exteriorOk}
                        onCheckedChange={(v) => setValue("checklist.exteriorOk", Boolean(v))}
                      />
                      <span>Exterior free of visible damage</span>
                    </label>
                    <Separator />
                    <label className="flex items-center gap-3">
                      <Checkbox
                        checked={!!checklist?.interiorOk}
                        onCheckedChange={(v) => setValue("checklist.interiorOk", Boolean(v))}
                      />
                      <span>Interior: walls, floors, fixtures OK</span>
                    </label>
                    <Separator />
                    <label className="flex items-center gap-3">
                      <Checkbox
                        checked={!!checklist?.hvacOk}
                        onCheckedChange={(v) => setValue("checklist.hvacOk", Boolean(v))}
                      />
                      <span>HVAC running and filter acceptable</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <div>
                  <Label className="text-sm">Upload Photos</Label>
                  <div className="mt-2 rounded-lg border border-dashed p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onPhotos(e.target.files)}
                      className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-white hover:file:opacity-90"
                      style={{ ["--tw-file-bg" as any]: "var(--brand-accent)" }}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag & drop or click to select. JPG/PNG recommended.
                    </p>
                    {photoNames.length > 0 && (
                      <div className="mt-3 text-left text-sm">
                        <Separator className="my-2" />
                        <p className="font-medium mb-2">Queued Photos</p>
                        <ul className="max-h-28 overflow-auto space-y-1">
                          {photoNames.map((n) => (
                            <li key={n} className="truncate">• {n}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-gray-50">
                  <p className="text-sm text-gray-700 mb-2 font-medium">Report Health</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Required fields complete: <span className="font-semibold">{watch("propertyName") ? "Yes" : "No"}</span></li>
                    <li>• Checklist items checked: <span className="font-semibold">
                      {(Number(!!checklist?.exteriorOk) + Number(!!checklist?.interiorOk) + Number(!!checklist?.hvacOk)).toString()}
                    </span>/3</li>
                    <li>• Photos selected: <span className="font-semibold">{photoNames.length}</span></li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="hover:opacity-90" style={{ backgroundColor: "var(--brand-accent)" }}>
                    Save Draft
                  </Button>
                  <Button variant="outline">
                    Generate PDF
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Timeline / status (Carfax feel) */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-5">
              <p className="text-sm font-semibold mb-3">Inspection Timeline</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: "var(--brand-accent)" }} />
                  <div>
                    <p className="text-sm font-medium">Capture Started</p>
                    <p className="text-xs text-gray-500">Created new inspection draft</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Photos Uploaded</p>
                    <p className="text-xs text-gray-500">Awaiting upload</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Report Generated (PDF)</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-5">
              <p className="text-sm font-semibold mb-3">Flags & Notices</p>
              <div className="rounded-md border bg-white p-4 text-sm">
                <p className="text-gray-700">
                  No critical issues flagged yet. Mark items during review to surface them here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}



