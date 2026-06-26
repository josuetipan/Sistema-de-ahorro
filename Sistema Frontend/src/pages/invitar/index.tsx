import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { InvitarView } from '@features/invitaciones/presentation/views/InvitarView';

export function InvitarPage() {
  return (
    <AppLayout>
      <ScreenPage
        title="Invitar"
        description="Comparte tu código de invitación con familiares y amigos."
      >
        <InvitarView />
      </ScreenPage>
    </AppLayout>
  );
}
