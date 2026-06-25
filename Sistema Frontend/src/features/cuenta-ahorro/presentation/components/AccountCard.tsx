import { formatCurrency } from '@shared/lib/formatters';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import type { CuentaAhorroPublica } from '../../domain/cuenta-ahorro.entity';

interface AccountCardProps {
  cuenta: CuentaAhorroPublica;
}

export function AccountCard({ cuenta }: AccountCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-semibold text-blue-700">{cuenta.numeroCuenta}</p>
          <p className="mt-1 text-xs text-slate-500">{cuenta.correo}</p>
        </div>
        <StatusBadge status={cuenta.estado.toLowerCase()} label={cuenta.estado} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-slate-400">Saldo</dt>
          <dd className="font-semibold tabular-nums text-emerald-700">
            {formatCurrency(cuenta.saldo)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Código ref.</dt>
          <dd className="font-mono">{cuenta.codigoReferencia ?? '—'}</dd>
        </div>
      </dl>
    </article>
  );
}
