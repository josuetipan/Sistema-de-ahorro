import { AdminModulePage } from '../AdminModulePage';
import { AdminSolicitudesCreditoView } from '@features/admin';

export function AdminSolicitudesCreditoPage() {
  return (
    <AdminModulePage
      title="Solicitudes de crédito"
      description="Revisa, aprueba o rechaza las solicitudes de crédito pendientes."
    >
      <AdminSolicitudesCreditoView />
    </AdminModulePage>
  );
}
