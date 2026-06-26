import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'muted' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'border border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:border-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 disabled:bg-blue-300 disabled:border-blue-300',
  secondary:
    'border border-slate-700 bg-slate-800 text-white shadow-sm hover:bg-slate-700 active:bg-slate-900 focus-visible:ring-slate-500',
  outline:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-blue-500',
  ghost:
    'border border-transparent bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
  muted:
    'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
  danger:
    'border border-red-600 bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'control-height-sm px-3 text-xs',
  md: 'control-height-md px-3.5 text-sm',
  lg: 'control-height-lg px-4 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={[
        'inline-flex shrink-0 items-center justify-center gap-2',
        'box-border rounded-lg font-medium leading-none tracking-tight',
        'whitespace-nowrap touch-manipulation motion-safe-transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading && (
        <span
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      <span className="inline-flex items-center leading-none">
        {isLoading ? 'Cargando…' : children}
      </span>
    </button>
  ),
);

Button.displayName = 'Button';
