import { AppLayout } from '@shared/ui/templates/AppLayout';
import { ScreenPage } from '@shared/ui/templates/ScreenPage';
import { MisAhorrosView } from '@features/ahorro';

export function MisAhorrosPage() {
  return (
    <AppLayout>
      <div className="flex min-h-0 flex-1 flex-col">
      <ScreenPage
        title="Movimientos"
        description="Historial de aportes y depósitos de tu cuenta de ahorro."
        fillViewport
      >
        <MisAhorrosView />
      </ScreenPage>
      </div>
    </AppLayout>
  );
}
