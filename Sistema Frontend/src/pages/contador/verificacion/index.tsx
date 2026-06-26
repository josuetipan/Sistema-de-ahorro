import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { AdminVerificationPanel } from '@features/ahorro/presentation/components/AdminVerificationPanel';

export function ContadorVerificacionView() {
  return (
    <div className="flex flex-col gap-5">
      <AdminVerificationPanel />
    </div>
  );
}

export function ContadorVerificacionPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Verificación de pagos"
        description="Aprueba o rechaza los pagos de ahorro. Solo los verificados suman al saldo disponible del socio."
      >
        <ContadorVerificacionView />
      </ScreenPage>
    </AppLayout>
  );
}
