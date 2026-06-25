import { AdminModulePage } from './AdminModulePage';
import { AdminDashboardView } from '@features/admin';

export function AdminDashboardPage() {
  return (
    <AdminModulePage
      title="Panel administrador"
      description="Resumen general de la cooperativa: socios, ahorros, créditos y operaciones."
    >
      <AdminDashboardView />
    </AdminModulePage>
  );
}
