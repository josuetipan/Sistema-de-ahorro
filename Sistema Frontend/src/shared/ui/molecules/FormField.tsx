import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Label } from '../atoms/Label';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  /** En grid: reserva espacio para errores */
  layout?: 'stack' | 'grid';
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  layout = 'stack',
  className = '',
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const inGrid  = layout === 'grid';

  const field = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id:   htmlFor,
        name: (children as ReactElement<{ name?: string }>).props.name ?? htmlFor,
        ...(error && errorId ? { 'aria-describedby': errorId, 'aria-invalid': true } : {}),
      })
    : children;

  return (
    <div className={`flex min-w-0 flex-col ${inGrid ? '' : 'mb-4'} ${className}`}>
      <Label htmlFor={htmlFor} required={required} className="mb-1.5">
        {label}
      </Label>
      {field}
      {/* Reserva de altura para mensaje de error — evita layout shift */}
      <div className={inGrid ? 'mt-1 min-h-[1.1rem]' : error ? 'mt-1' : ''}>
        {error && (
          <p
            id={errorId}
            className="text-[12px] font-medium leading-tight text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
