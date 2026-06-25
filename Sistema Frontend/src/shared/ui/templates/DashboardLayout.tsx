// @deprecated Usar AppLayout. Se mantiene por compatibilidad.
import type { ReactNode } from 'react';
import { AppLayout } from './AppLayout';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
