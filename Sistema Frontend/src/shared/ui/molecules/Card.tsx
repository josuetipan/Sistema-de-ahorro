import type { HTMLAttributes, ReactNode } from 'react';

/** @deprecated Preferir SectionCard para secciones nuevas. Card se mantiene por compatibilidad. */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
  variant?: 'default' | 'flat' | 'section';
}

const bodyPadding = {
  none: '',
  sm: 'px-4 py-4',
  md: 'px-5 py-5',
  lg: 'px-6 py-6',
};

export function Card({
  title,
  subtitle,
  footer,
  padding = 'lg',
  shadow = true,
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const shell =
    variant === 'flat'
      ? 'min-w-0'
      : variant === 'section'
        ? 'min-w-0 border-b border-gray-200 bg-white'
        : [
            'min-w-0 overflow-hidden rounded-xl border border-gray-200/90 bg-white',
            shadow ? 'shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)]' : '',
          ].join(' ');

  return (
    <div className={`${shell} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-100 ${bodyPadding[padding]} pb-4 pt-6`}>
          {title && <h3 className="text-base font-semibold tracking-tight text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm leading-relaxed text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={`${bodyPadding[padding]} ${title || subtitle ? 'pt-5' : ''}`}>{children}</div>
      {footer && (
        <div className={`border-t border-gray-100 bg-gray-50/80 ${bodyPadding[padding]}`}>{footer}</div>
      )}
    </div>
  );
}
