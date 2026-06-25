import { Card } from '@shared/ui/molecules/Card';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency } from '@shared/lib/formatters';
import type { Cuenta } from '../model';

export function CuentaCard({ cuenta }: { cuenta: Cuenta }) {
  return (
    <Card title={`Cuenta ${cuenta.numero}`} subtitle={cuenta.tipo}>
      <SaldoDisplay saldo={cuenta.saldo} moneda={cuenta.moneda} />
      <StatusBadge status={cuenta.estado} label={cuenta.estado} />
    </Card>
  );
}

export function SaldoDisplay({ saldo, moneda }: { saldo: number; moneda: string }) {
  return <p className="tabular-nums text-2xl font-bold text-gray-900">{formatCurrency(saldo, moneda)}</p>;
}
