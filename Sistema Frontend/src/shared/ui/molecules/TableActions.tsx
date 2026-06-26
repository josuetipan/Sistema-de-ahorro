import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../atoms/Button';

/** Contenedor horizontal para botones de acción en tablas (sin apilar en vertical). */
export function TableActions({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex max-w-none flex-nowrap items-center gap-1.5" role="group">
      {children}
    </div>
  );
}

/** Botón compacto oscuro para filas de tabla. */
export function TableActionButton({ className = '', ...props }: ButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={`shrink-0 px-2.5 text-xs ${className}`}
      {...props}
    />
  );
}
