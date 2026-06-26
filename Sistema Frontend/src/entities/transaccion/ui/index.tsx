import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import type { Transaccion } from '../model';

export function TransaccionItem({ transaccion }: { transaccion: Transaccion }) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={transaccion.tipo} label={transaccion.tipo} />
          <p className="whitespace-nowrap text-sm text-slate-500">{formatDate(transaccion.fecha)}</p>
        </div>
        {transaccion.descripcion && (
          <p className="mt-1 break-words text-sm text-slate-600">{transaccion.descripcion}</p>
        )}
      </div>
      <MontoDisplay monto={transaccion.monto} moneda={transaccion.moneda} tipo={transaccion.tipo} />
    </div>
  );
}

export function MontoDisplay({
  monto,
  moneda,
  tipo,
}: {
  monto: number;
  moneda: string;
  tipo: Transaccion['tipo'];
}) {
  const isNegative = tipo === 'retiro' || tipo === 'transferencia';
  return (
    <span
      className={`shrink-0 tabular-nums text-base font-semibold ${isNegative ? 'text-slate-600' : 'text-primary-700'}`}
    >
      {isNegative ? '-' : '+'}
      {formatCurrency(monto, moneda)}
    </span>
  );
}
