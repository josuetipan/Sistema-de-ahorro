import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { MisCreditosView } from '@features/credito';

export function MisCreditosPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Mis Créditos"
        description="Consulta tus créditos activos, cuotas y tabla de amortización."
      >
        <MisCreditosView />
      </ScreenPage>
    </AppLayout>
  );
}
