import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { DashboardOverview } from '@features/dashboard';
import { MetaAhorroIndicador } from '@features/ahorro/presentation/components/MetaAhorroIndicador';

export function DashboardPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Inicio"
        description="Resumen general y acceso rápido a cada sección."
        secondaryActions={<MetaAhorroIndicador variant="toolbar" />}
      >
        <DashboardOverview />
      </ScreenPage>
    </AppLayout>
  );
}
