// @deprecated Usar PageContainer + PageHeader + PageContent. Se mantiene por compatibilidad.
import type { ReactNode } from 'react';
import { PageContent } from './PageContent';

export interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className = '' }: PageSectionProps) {
  return <PageContent className={className}>{children}</PageContent>;
}
