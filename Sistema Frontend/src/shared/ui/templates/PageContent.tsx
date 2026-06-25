import type { HTMLAttributes, ReactNode } from 'react';

export interface PageContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Separación uniforme entre secciones: gap-4 (16px) */
export function PageContent({ children, className = '', ...props }: PageContentProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}
