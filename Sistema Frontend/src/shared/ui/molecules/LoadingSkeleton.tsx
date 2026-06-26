export interface LoadingSkeletonProps {
  rows?: number;
  /** Variante tabla: incluye header skeleton */
  variant?: 'default' | 'table' | 'card';
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`skeleton-pulse rounded bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function LoadingSkeleton({ rows = 4, variant = 'default' }: LoadingSkeletonProps) {
  if (variant === 'table') {
    return (
      <div
        className="data-table-shell overflow-hidden"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Cargando datos…</span>
        {/* Cabecera */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3">
          <div className="flex gap-6">
            {[60, 40, 50, 35].map((w, i) => (
              <SkeletonLine key={i} className={`h-3 w-${w > 50 ? '[60px]' : w > 40 ? '[50px]' : w > 35 ? '[40px]' : '[35px]'}`} />
            ))}
          </div>
        </div>
        {/* Filas */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-6 border-b border-slate-50 px-4 py-3.5 last:border-0">
            <SkeletonLine className="h-3.5 w-24" />
            <SkeletonLine className="h-3.5 w-32" />
            <SkeletonLine className="h-3.5 w-20" />
            <SkeletonLine className="h-3.5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className="section-card-shell grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Cargando…</span>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-7 w-32" />
            <SkeletonLine className="h-2.5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Cargando contenido…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={`h-3.5 ${i === 0 ? 'w-2/5' : i % 3 === 0 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
