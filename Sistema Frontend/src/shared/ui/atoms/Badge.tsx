// Badge — pills compactas con variantes semánticas claras
import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'muted' | 'outline' | 'success' | 'warning' | 'danger';
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:  'bg-slate-100  text-slate-600  ring-1 ring-slate-200/80',
  primary:  'bg-blue-50    text-blue-700   ring-1 ring-blue-100',
  success:  'bg-green-50   text-green-700  ring-1 ring-green-100',
  warning:  'bg-amber-50   text-amber-700  ring-1 ring-amber-100',
  danger:   'bg-red-50     text-red-700    ring-1 ring-red-100',
  muted:    'bg-slate-50   text-slate-500  ring-1 ring-slate-100',
  outline:  'border border-slate-200 bg-white text-slate-600',
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
