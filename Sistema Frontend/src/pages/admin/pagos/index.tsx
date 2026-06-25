import { AdminModulePage } from '../AdminModulePage';
import { AdminPagosView } from '@features/admin';

export function AdminPagosPage() {
  return (
    <AdminModulePage
      title="Pagos"
      description="Registra y valida los pagos de cuotas y abonos de crédito."
    >
      <AdminPagosView />
    </AdminModulePage>
  );
}
