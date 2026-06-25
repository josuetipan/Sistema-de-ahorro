import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { formatCurrency } from '@shared/lib/formatters';
import type { CuentaUsuario } from '@shared/data/ahorroMockData';
import type { ResumenAhorro } from '../../domain/pago.entity';
import type { NavIconName } from '@shared/ui/atoms/NavIcon';

const COLOR_MAP: Record<string, string> = {
  emerald: 'from-emerald-50 to-white border-emerald-200 hover:border-emerald-400',
  sky: 'from-sky-50 to-white border-sky-200 hover:border-sky-400',
  amber: 'from-amber-50 to-white border-amber-200 hover:border-amber-400',
};

const ICON_MAP: Record<string, NavIconName> = {
  savings: 'savings',
  shield: 'shield',
  zap: 'zap',
};

interface SocioCardProps {
  cuenta: CuentaUsuario;
  resumen: ResumenAhorro;
  esActiva?: boolean;
  onSelect: () => void;
}

export function SocioCard({ cuenta, resumen, esActiva, onSelect }: SocioCardProps) {
  const {
    metaMensual,
    progresoMes,
    progresoPorcentaje,
    metaCumplida,
    excedenteMes,
    saldoDisponible,
    saldoPendiente,
  } = resumen;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group relative flex flex-col rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm',
        'motion-safe-transition hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-100/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
        COLOR_MAP[cuenta.color] ?? COLOR_MAP.emerald,
        esActiva ? 'ring-2 ring-emerald-500/30' : '',
      ].join(' ')}
    >
      {esActiva && (
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Actual
        </span>
      )}

      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-100">
          <NavIcon name={ICON_MAP[cuenta.icono] ?? 'savings'} size={20} />
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
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
            Meta mensual obligatoria
          </p>
          <p className="text-lg font-bold tabular-nums text-slate-900">
            {formatCurrency(metaMensual)}
          </p>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-slate-500">Progreso del mes (verificado)</span>
            <span className="font-semibold tabular-nums text-emerald-700">
              {formatCurrency(progresoMes)} / {formatCurrency(metaMensual)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={['h-2 rounded-full motion-safe-transition', metaCumplida ? 'bg-emerald-500' : 'bg-amber-400'].join(' ')}
              style={{ width: `${progresoPorcentaje}%` }}
              role="progressbar"
              aria-valuenow={progresoPorcentaje}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          {excedenteMes > 0 && (
            <p className="mt-1 text-[10px] text-sky-700">
              +{formatCurrency(excedenteMes)} extra este mes (no adelanta meses futuros)
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[10px] text-slate-500">Saldo disponible</p>
            <p className="text-sm font-bold tabular-nums text-emerald-700">
              {formatCurrency(saldoDisponible)}
            </p>
          </div>
          <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-slate-100">
            <p className="text-[10px] text-slate-500">Saldo pendiente</p>
            <p className="text-sm font-bold tabular-nums text-amber-700">
              {formatCurrency(saldoPendiente)}
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
