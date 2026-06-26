import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { SolicitudCreditoForm } from '@features/credito';

export function SolicitudCreditoPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Solicitar Crédito"
        description="Completa tu solicitud y revisa la simulación de cuotas."
      >
        <SolicitudCreditoForm />
      </ScreenPage>
    </AppLayout>
  );
}
