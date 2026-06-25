import { AdminModulePage } from '../AdminModulePage';
import { AdminConfiguracionView } from '@features/admin';

export function AdminConfiguracionPage() {
  return (
    <AdminModulePage
      title="Configuración"
      description="Parámetros generales del sistema de ahorro y crédito."
    >
      <AdminConfiguracionView />
    </AdminModulePage>
  );
}
