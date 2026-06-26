import { AdminModulePage } from '../AdminModulePage';
import { AdminCuentasAhorroView } from '@features/admin';

export function AdminCuentasAhorroPage() {
  return (
    <AdminModulePage
      title="Cuentas de ahorro"
      description="Supervisa y administra las cuentas de ahorro de los socios."
    >
      <AdminCuentasAhorroView />
    </AdminModulePage>
  );
}
