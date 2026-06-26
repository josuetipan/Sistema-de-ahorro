import { CuentaSelectionLayout } from '@shared/ui/templates/CuentaSelectionLayout';
import { ElegirCuentaView } from '@features/cuentas/presentation/views/ElegirCuentaView';

export function ElegirCuentaPage() {
  return (
    <CuentaSelectionLayout>
      <ElegirCuentaView />
    </CuentaSelectionLayout>
  );
}
