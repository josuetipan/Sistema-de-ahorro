import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { MiCuentaView } from '@features/cuenta';

export function MiCuentaPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Mi Cuenta"
        description="Total ahorrado, datos de tu cuenta e invitación para nuevos socios."
        fillViewport
      >
        <MiCuentaView />
      </ScreenPage>
    </AppLayout>
  );
}
