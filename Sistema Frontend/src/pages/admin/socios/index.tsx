import { AdminModulePage } from '../AdminModulePage';
import { AdminSociosView } from '@features/admin';

export function AdminSociosPage() {
  return (
    <AdminModulePage
      title="Socios / Clientes"
      description="Consulta, registra y administra los socios y clientes de la cooperativa."
    >
      <AdminSociosView />
    </AdminModulePage>
  );
}
