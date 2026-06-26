import type { HTMLAttributes, ReactNode } from 'react';

const bodyPadding = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
} as const;

export interface SectionCardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  padding?: keyof typeof bodyPadding;
  variant?: 'default' | 'plain';
}

export function SectionCard({
  title,
  subtitle,
  actions,
  padding = 'md',
  variant = 'default',
  className = '',
  children,
  ...props
}: SectionCardProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  if (variant === 'plain') {
    return (
      <section className={`min-w-0 ${className}`} {...props}>
        {children}
      </section>
    );
  }

  return (
    <section className={`section-card-shell ${className}`} {...props}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[13px] font-semibold text-slate-800">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className={hasHeader ? `${bodyPadding[padding]} pt-3` : bodyPadding[padding]}>
        {children}
      </div>
    </section>
  );
}
