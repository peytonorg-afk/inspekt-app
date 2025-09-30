"use client";

import { useForm } from "react-hook-form";

type FormValues = {
  propertyName: string;
  notes: string;
  photos: FileList;
};

export default function CapturePage() {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    alert("Form submitted! Check the console.");
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inspection Capture</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Property Name */}
        <div>
          <label className="block font-medium mb-1">Property Name</label>
          <input
            {...register("propertyName")}
            className="w-full border rounded p-2"
            placeholder="Enter property name"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full border rounded p-2"
            placeholder="Any notes from the inspection"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("photos")}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
