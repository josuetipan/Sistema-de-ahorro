import type { ReactNode } from 'react';
import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';

export interface AdminModulePageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AdminModulePage({ title, description, children }: AdminModulePageProps) {
  return (
    <AppLayout>
      <ScreenPage title={title} description={description}>
        {children}
      </ScreenPage>
    </AppLayout>
  );
}
