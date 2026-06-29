import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { formatCurrency } from '@shared/lib/formatters';
import type { CuentaResumen } from '../../domain/cuenta.entity';

interface CuentaResumenCardProps {
  cuenta: CuentaResumen;
  esActiva?: boolean;
  onSelect: () => void;
}

function estadoBadgeClass(estado: string): string {
  return estado.toLowerCase() === 'activa'
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-slate-100 text-slate-500';
}

export function CuentaResumenCard({ cuenta, esActiva, onSelect }: CuentaResumenCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm',
        'motion-safe-transition hover:scale-[1.02] hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
        esActiva ? 'ring-2 ring-emerald-500/30' : '',
      ].join(' ')}
    >
      {esActiva && (
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Actual
        </span>
      )}

      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-slate-100">
          <NavIcon name="savings" size={20} />
        </span>
        <span
          className={[
            'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
            estadoBadgeClass(cuenta.estado),
          ].join(' ')}
        >
          {cuenta.estado}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-slate-900">{cuenta.nombre}</h2>
      <p className="mt-0.5 font-mono text-xs text-slate-500" translate="no">
        {cuenta.numeroCuenta}
      </p>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Meta mensual
          </p>
          <p className="text-lg font-bold tabular-nums text-slate-900">
            {formatCurrency(cuenta.metaMensual, 'USD')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[10px] text-slate-500">Saldo</p>
            <p className="text-sm font-bold tabular-nums text-slate-900">
              {formatCurrency(cuenta.saldo, 'USD')}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[10px] text-slate-500">Disponible</p>
            <p className="text-sm font-bold tabular-nums text-emerald-700">
              {formatCurrency(cuenta.saldoDisponible, 'USD')}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[10px] text-slate-500">Pendiente</p>
            <p className="text-sm font-bold tabular-nums text-amber-700">
              {formatCurrency(cuenta.saldoPendiente, 'USD')}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[10px] text-slate-500">Meta cumplida</p>
            <p className="text-sm font-bold tabular-nums text-slate-900">
              {cuenta.metaCumplida ? 'Sí' : 'No'}
            </p>
          </div>
        </div>
      </div>

      <span className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 opacity-0 motion-safe-transition group-hover:opacity-100">
        {esActiva ? 'Continuar en esta cuenta' : 'Abrir cuenta'}
        <NavIcon name="arrow-right" size={14} />
      </span>
    </button>
  );
}
