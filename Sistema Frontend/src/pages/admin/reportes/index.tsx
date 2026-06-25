import { AdminModulePage } from '../AdminModulePage';
import { AdminReportesView } from '@features/admin';

export function AdminReportesPage() {
  return (
    <AdminModulePage
      title="Reportes"
      description="Genera reportes financieros y operativos de la cooperativa."
    >
      <AdminReportesView />
    </AdminModulePage>
  );
}
