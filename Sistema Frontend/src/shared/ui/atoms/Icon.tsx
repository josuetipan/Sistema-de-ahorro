// Átomo: contenedor de iconos SVG con tamaño configurable
import type { SVGAttributes } from 'react';

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  size?: number;
  /** Texto accesible; si se omite, el icono es decorativo */
  label?: string;
}

export function Icon({ size = 20, className = '', label, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...props}
    >
      {children}
    </svg>
  );
}
