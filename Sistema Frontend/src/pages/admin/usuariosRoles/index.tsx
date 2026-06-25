import { AdminModulePage } from '../AdminModulePage';
import { AdminUsuariosRolesView } from '@features/admin';

export function AdminUsuariosRolesPage() {
  return (
    <AdminModulePage
      title="Usuarios y roles"
      description="Administra cuentas de acceso, permisos y roles del sistema."
    >
      <AdminUsuariosRolesView />
    </AdminModulePage>
  );
}
