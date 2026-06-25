import type { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label className={`block cursor-pointer text-[13px] font-medium leading-snug text-slate-700 ${className}`} {...props}>
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
      {required && <span className="sr-only"> (obligatorio)</span>}
    </label>
  );
}
