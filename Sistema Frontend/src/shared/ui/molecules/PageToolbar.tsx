// Molécula: cabecera de pantalla con acciones (app-page-toolbar)
import type { ReactNode } from 'react';

export interface PageToolbarProps {
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  variant?: 'content-aligned' | 'toolbar-full-bleed';
}

export function PageToolbar({
  title,
  description,
  primaryAction,
  secondaryActions,
  variant = 'content-aligned',
}: PageToolbarProps) {
  const bleed = variant === 'toolbar-full-bleed';

  return (
    <header
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${
        bleed ? '-mx-4 mb-1 border-b border-slate-200 bg-white px-4 py-4 md:-mx-6 md:px-6' : ''
      }`}
    >
      <div className="min-w-0">
        <h1 className="text-balance text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {(primaryAction || secondaryActions) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {secondaryActions}
          {primaryAction}
        </div>
      )}
    </header>
  );
}
