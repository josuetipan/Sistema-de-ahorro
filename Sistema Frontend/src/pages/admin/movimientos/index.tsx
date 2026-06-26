import { AdminModulePage } from '../AdminModulePage';
import { AdminMovimientosView } from '@features/admin';

export function AdminMovimientosPage() {
  return (
    <AdminModulePage
      title="Movimientos"
      description="Consulta el historial de movimientos de ahorro y crédito del sistema."
    >
      <AdminMovimientosView />
    </AdminModulePage>
  );
}
