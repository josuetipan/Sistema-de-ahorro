import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { CalendarioAhorroView } from '@features/ahorro/presentation/views/CalendarioAhorroView';

export function CalendarioPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Calendario de ahorro"
        description="Consulta el estado de tu aporte mensual: pago completo, incompleto o atrasado."
      >
        <CalendarioAhorroView />
      </ScreenPage>
    </AppLayout>
  );
}
