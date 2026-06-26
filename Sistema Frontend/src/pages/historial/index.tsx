import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { HistorialView } from '@features/historial';

export function HistorialPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Historial"
        description="Movimientos de ahorros, créditos, pagos y solicitudes en un solo lugar."
      >
        <HistorialView />
      </ScreenPage>
    </AppLayout>
  );
}
