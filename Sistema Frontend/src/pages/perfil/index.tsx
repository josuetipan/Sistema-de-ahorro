import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { PerfilView } from '@features/perfil';

export function PerfilPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Perfil"
        description="Consulta y actualiza tus datos personales."
      >
        <PerfilView />
      </ScreenPage>
    </AppLayout>
  );
}
