// Átomo: tipografía con variantes semánticas
import type { HTMLAttributes } from 'react';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4';
  variant?: 'body' | 'caption' | 'title' | 'subtitle';
}

const variants: Record<NonNullable<TextProps['variant']>, string> = {
  body: 'text-base text-slate-700',
  caption: 'text-sm text-slate-500',
  title: 'text-2xl font-bold text-slate-900 text-balance',
  subtitle: 'text-lg font-semibold text-slate-800 text-balance',
};

export function Text({ as: Tag = 'p', variant = 'body', className = '', children, ...props }: TextProps) {
  return (
    <Tag className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
