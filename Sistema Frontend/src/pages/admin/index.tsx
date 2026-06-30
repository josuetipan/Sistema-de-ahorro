import { AdminModulePage } from './AdminModulePage';
import { AdminDashboardView } from '@features/admin';

export function AdminDashboardPage() {
  return (
    <AdminModulePage
      title="Aportes de ahorro"
      description="Consulta los aportes mensuales registrados por estado y mes."
    >
      <AdminDashboardView />
    </AdminModulePage>
  );
}
