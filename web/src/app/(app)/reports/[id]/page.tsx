export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="font-semibold">Report #{params.id}</div>
      <a
        className="underline"
        href={`/api/reports/${params.id}/download`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download PDF
      </a>
    </div>
  );
}



