interface PDFViewerProps {
  src: string;
  title: string;
}

export function PDFViewer({ src, title }: PDFViewerProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <iframe
        src={src}
        title={title}
        className="h-[60vh] w-full"
      />
    </div>
  );
}
