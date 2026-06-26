// Plantilla: pantalla estándar SaaS
import type { ReactNode } from 'react';
import { PageContainer } from './PageContainer';
import { PageHeader } from './PageHeader';
import { PageContent } from './PageContent';
import type { PageHeaderProps } from './PageHeader';

export interface ScreenPageProps extends PageHeaderProps {
  children: ReactNode;
  fillViewport?: boolean;
}

export function ScreenPage({
  children,
  title,
  description,
  primaryAction,
  secondaryActions,
  meta,
  visuallyHidden,
  fillViewport = false,
}: ScreenPageProps) {
  return (
    <div className={fillViewport ? 'flex min-h-full flex-1 flex-col' : 'flex flex-col'}>
      <PageHeader
        title={title}
        description={description}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        meta={meta}
        visuallyHidden={visuallyHidden}
      />
      <PageContainer
        className={fillViewport ? 'flex min-h-0 flex-1 flex-col pb-0 pt-4' : 'pt-4'}
      >
        <PageContent className={fillViewport ? 'flex min-h-0 flex-1 flex-col' : undefined}>
          {children}
        </PageContent>
      </PageContainer>
    </div>
  );
}
