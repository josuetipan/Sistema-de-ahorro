import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { formatCurrency } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import { useMetaAhorro } from '@features/ahorro/application/hooks/useMetaAhorro';

export function MetaAhorroIndicador({ variant = 'default' }: { variant?: 'default' | 'toolbar' }) {
  const { cuentaActiva } = useCuentaActiva();
  const { resumen } = usePagosAhorro({ cuentaId: cuentaActiva?.id });
  const { meta: configuracionMeta } = useMetaAhorro();

  if (!cuentaActiva) return null;

  const metaMensual = configuracionMeta?.metaMensual ?? resumen.metaMensual;
  const progresoMes = resumen.progresoMes;
  const progresoPorcentaje = metaMensual > 0
    ? Math.min(Math.round((progresoMes / metaMensual) * 100), 100)
    : 0;
  const metaCumplida = metaMensual > 0 && progresoMes >= metaMensual;
  const enToolbar = variant === 'toolbar';

  return (
    <div
      className="group relative flex items-center"
      title={`Meta: ${formatCurrency(metaMensual)} · Verificado este mes: ${formatCurrency(progresoMes)} (${progresoPorcentaje}%)`}
    >
      <div
        className={[
          'flex items-center gap-2 rounded-md border motion-safe-transition',
          enToolbar ? 'px-2 py-1' : 'rounded-lg px-3 py-2',
          enToolbar
            ? metaCumplida
              ? 'border-emerald-300/40 bg-emerald-500/15 text-white'
              : 'border-white/25 bg-white/10 text-white'
            : metaCumplida
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
              : 'border-amber-200 bg-amber-50 text-amber-800 shadow-sm',
        ].join(' ')}
        role="status"
        aria-label={`Meta de ahorro: ${formatCurrency(progresoMes)} de ${formatCurrency(metaMensual)}, ${progresoPorcentaje}%`}
      >
        <span
          className={[
            'flex items-center justify-center rounded-md',
            enToolbar ? 'h-7 w-7' : 'h-8 w-8 rounded-lg',
            enToolbar
              ? metaCumplida
                ? 'bg-emerald-400/20 text-emerald-200'
                : 'bg-white/10 text-white'
              : metaCumplida
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-600',
          ].join(' ')}
        >
          <NavIcon name="flag" size={enToolbar ? 15 : 18} />
        </span>
        <div className={['text-left', enToolbar ? 'hidden lg:block' : 'hidden sm:block'].join(' ')}>
          <p className={['font-semibold uppercase tracking-wider', enToolbar ? 'text-[9px] text-white/70' : 'text-[10px] opacity-80'].join(' ')}>
            Meta del mes
          </p>
          <p className={['font-bold tabular-nums leading-tight', enToolbar ? 'text-xs' : 'text-sm'].join(' ')}>
            {formatCurrency(metaMensual)}
          </p>
          {!enToolbar && (
            <p className={['text-[11px] tabular-nums', enToolbar ? 'text-white/70' : 'opacity-75'].join(' ')}>
              {metaCumplida ? 'Cumplida' : `${progresoPorcentaje}% · ${formatCurrency(progresoMes)}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
