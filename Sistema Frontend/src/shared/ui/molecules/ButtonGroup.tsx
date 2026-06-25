import type { ReactNode } from 'react';

export interface ButtonGroupProps {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
  ariaLabel?: string;
}

export function ButtonGroup({
  children,
  align = 'start',
  className = '',
  ariaLabel,
}: ButtonGroupProps) {
  const alignClass =
    align === 'end' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${alignClass} ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

/**
 * Columna de botón alineada con FormField layout="grid".
 * Misma estructura: label + control + reserva de error.
 */
export function FormActions({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <span className="mb-1.5 block min-h-[1.25rem] text-sm font-medium text-transparent select-none" aria-hidden="true">
        &#8203;
      </span>
      <div className="flex w-full items-center">{children}</div>
      <div className="mt-1 min-h-[1.125rem]" aria-hidden="true" />
    </div>
  );
}
