import { AdminModulePage } from '../AdminModulePage';
import { AdminCuentasAhorroView } from '@features/admin';

export function AdminCuentasAhorroPage() {
  return (
    <AdminModulePage
      title="Solicitudes"
      description="Consulta solicitudes de retiro y eliminacion de cuentas de ahorro."
    >
      <AdminCuentasAhorroView />
    </AdminModulePage>
  );
}
