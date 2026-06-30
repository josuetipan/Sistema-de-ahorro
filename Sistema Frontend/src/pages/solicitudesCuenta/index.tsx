import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { SolicitudesCuentaView } from '@features/cuentas/presentation/views/SolicitudesCuentaView';

export function SolicitudesCuentaPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Solicitudes"
        description="Solicita retiros o eliminacion de cuenta y revisa su estado."
        fillViewport
      >
        <SolicitudesCuentaView />
      </ScreenPage>
    </AppLayout>
  );
}
