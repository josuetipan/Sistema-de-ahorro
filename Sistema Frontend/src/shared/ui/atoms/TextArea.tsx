import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ hasError = false, className = '', disabled, ...props }, ref) => (
    <textarea
      ref={ref}
      disabled={disabled}
      className={`min-h-24 w-full touch-manipulation rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 motion-safe-transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${hasError
          ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100'
          : 'border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100'
        } ${className}`}
      {...props}
    />
  ),
);

TextArea.displayName = 'TextArea';
