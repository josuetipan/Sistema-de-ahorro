import type { ReactNode } from 'react';
import { SIDEBAR_HEADER_HEIGHT_CLASS } from '@shared/ui/organisms/Sidebar';

export interface PageHeaderProps {
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  meta?: ReactNode;
  visuallyHidden?: boolean;
}

/**
 * Toolbar superior — misma altura que la cabecera del sidebar (h-14).
 */
export function PageHeader({
  title,
  description,
  primaryAction,
  secondaryActions,
  meta,
  visuallyHidden = false,
}: PageHeaderProps) {
  if (visuallyHidden) {
    return (
      <header className="sr-only">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>
    );
  }

  const hasActions = primaryAction || secondaryActions;

  return (
    <header className={`w-full shrink-0 border-b border-white/8 bg-[#000B26] ${SIDEBAR_HEADER_HEIGHT_CLASS}`}>
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3 text-left">
          <h1 className="shrink-0 text-base font-semibold tracking-tight text-white sm:text-[17px]">
            {title}
          </h1>
          {description && (
            <p className="hidden min-w-0 truncate text-sm text-white/70 md:block">{description}</p>
          )}
        </div>
        {hasActions && (
          <div className="flex shrink-0 items-center gap-2">
            {secondaryActions}
            {primaryAction}
          </div>
        )}
      </div>
      {meta && (
        <div className="border-t border-white/10 px-4 py-2 text-[11px] text-white/70 sm:px-5 lg:px-6">
          {meta}
        </div>
      )}
    </header>
  );
}
