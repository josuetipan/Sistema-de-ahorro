import { AdminModulePage } from '../AdminModulePage';
import { AdminCreditosActivosView } from '@features/admin';

export function AdminCreditosActivosPage() {
  return (
    <AdminModulePage
      title="Créditos activos"
      description="Monitorea los créditos vigentes, cuotas y saldos pendientes."
    >
      <AdminCreditosActivosView />
    </AdminModulePage>
  );
}
