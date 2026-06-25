import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { PagosView } from '@features/pagos';

export function PagosPage() {
  return (
    <AppLayout>
      <div className="flex min-h-0 flex-1 flex-col">
        <ScreenPage
          title="Registrar aporte"
          description="Sube tu comprobante y confirma el monto del mes."
          fillViewport
        >
          <PagosView />
        </ScreenPage>
      </div>
    </AppLayout>
  );
}
