import { AdminModulePage } from '../AdminModulePage';
import { AdminConfiguracionView } from '@features/admin';

export function AdminConfiguracionPage() {
  return (
    <AdminModulePage
      title="Configuracion de meta"
      description="Actualiza la meta mensual, minima y maxima de ahorro."
    >
      <AdminConfiguracionView />
    </AdminModulePage>
  );
}
