import { Card } from '@shared/ui/molecules/Card';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency } from '@shared/lib/formatters';
import type { Credito } from '../model';

export function CreditoCard({ credito }: { credito: Credito }) {
  return (
    <Card title={`Crédito #${credito.id}`}>
      <p className="tabular-nums text-xl font-semibold">{formatCurrency(credito.monto)}</p>
      <EstadoBadge estado={credito.estado} />
    </Card>
  );
}

export function EstadoBadge({ estado }: { estado: Credito['estado'] }) {
  return <StatusBadge status={estado} label={estado} />;
}
