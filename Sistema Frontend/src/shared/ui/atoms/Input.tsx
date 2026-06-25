import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<InputProps['inputSize']>, string> = {
  sm: 'control-height-sm px-3 text-xs',
  md: 'control-height-md px-3 text-sm',
  lg: 'control-height-lg px-3.5 text-sm',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, inputSize = 'md', className = '', disabled, ...props }, ref) => (
    <input
      ref={ref}
      disabled={disabled}
      className={[
        'w-full touch-manipulation rounded-lg border bg-white text-slate-900',
        'placeholder:text-slate-400 motion-safe-transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
        sizeClasses[inputSize],
        hasError
          ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100'
          : 'border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
