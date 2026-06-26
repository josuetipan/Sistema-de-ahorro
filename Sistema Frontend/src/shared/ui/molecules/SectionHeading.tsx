import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  title: string;
  action?: ReactNode;
  description?: string;
}

export function SectionHeading({ title, action, description }: SectionHeadingProps) {
  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 className="text-[13px] font-semibold text-slate-700">{title}</h2>
        {description && (
          <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
