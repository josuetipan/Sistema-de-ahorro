import type { HTMLAttributes, ReactNode } from 'react';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Contenedor principal de página.
 * px: 20px mobile → 24px sm → 32px lg
 * py: 20px top — compacto para no dejar espacio vacío arriba
 */
export function PageContainer({ children, className = '', ...props }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1400px] px-4 pb-4 sm:px-5 lg:px-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
