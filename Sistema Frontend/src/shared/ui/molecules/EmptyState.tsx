import { Button } from '../atoms/Button';
import { NavIcon } from '../atoms/NavIcon';

export interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Sin resultados',
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
        <NavIcon name="search" size={18} className="text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button type="button" size="sm" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
