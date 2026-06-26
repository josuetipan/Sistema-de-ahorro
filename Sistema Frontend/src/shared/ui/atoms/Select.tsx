import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  selectSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<SelectProps['selectSize']>, string> = {
  sm: 'control-height-sm px-3 text-xs',
  md: 'control-height-md px-3 text-sm',
  lg: 'control-height-lg px-3 text-sm',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError = false, selectSize = 'md', className = '', disabled, children, ...props }, ref) => (
    <select
      ref={ref}
      disabled={disabled}
      className={`w-full touch-manipulation rounded-lg border bg-white text-slate-900 motion-safe-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${sizeClasses[selectSize]} ${
        hasError
          ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100'
          : 'border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = 'Select';
