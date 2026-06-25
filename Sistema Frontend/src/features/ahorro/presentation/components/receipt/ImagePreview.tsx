interface ImagePreviewProps {
  src: string;
  alt: string;
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <img
        src={src}
        alt={alt}
        className="mx-auto max-h-[60vh] w-full object-contain"
        loading="lazy"
      />
    </div>
  );
}
