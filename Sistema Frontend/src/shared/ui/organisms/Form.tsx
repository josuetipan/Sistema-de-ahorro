// Organismo: formulario genérico con React Hook Form
import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({ form, onSubmit, children, className = '' }: FormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate>
      {children}
    </form>
  );
}
