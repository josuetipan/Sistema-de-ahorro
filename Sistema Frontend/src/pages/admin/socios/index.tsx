import { AdminModulePage } from '../AdminModulePage';
import { AdminSociosView } from '@features/admin';

export function AdminSociosPage() {
  return (
    <AdminModulePage
      title="Socios de ahorro"
      description="Consulta socios, filtros administrativos y cuentas asociadas."
    >
      <AdminSociosView />
    </AdminModulePage>
  );
}
