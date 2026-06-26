import type { ReactNode } from 'react';

export interface FormGridProps {
  children: ReactNode;
  /** Columnas en lg (desktop). Default 3 */
  columns?: 2 | 3 | 4;
  className?: string;
}

const lgCols: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

/** Grid responsive para formularios: 1 col mobile → 2 sm → N lg, gap uniforme */
export function FormGrid({ children, columns = 3, className = '' }: FormGridProps) {
  return (
    <div
      className={`grid grid-cols-1 items-end gap-x-4 gap-y-4 sm:grid-cols-2 ${lgCols[columns]} ${className}`}
    >
      {children}
    </div>
  );
}

/** Fila de acciones debajo del grid o submit alineado con campos */
export function FormFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-end ${className}`}>
      {children}
    </div>
  );
}
