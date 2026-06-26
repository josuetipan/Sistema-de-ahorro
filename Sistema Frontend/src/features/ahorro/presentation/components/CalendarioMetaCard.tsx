import { useMemo, type ReactNode } from 'react';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import {
  buildCalendarioAnualFromPagos,
  estadoMesToBadge,
  LABEL_ESTADO_MES,
  type MesCalendario,
} from '@features/ahorro/domain/pago.rules';
import { META_MENSUAL_OBLIGATORIA } from '@features/ahorro/domain/pago.entity';

interface CalendarioMetaCardProps {
  anio?: number;
  actions?: ReactNode;
}

export function CalendarioMetaCard({
  anio = new Date().getFullYear(),
  actions,
}: CalendarioMetaCardProps) {
  const { cuentaActiva } = useCuentaActiva();
  const { pagos } = usePagosAhorro({ cuentaId: cuentaActiva?.id });

  const meses = useMemo(
    () => (cuentaActiva ? buildCalendarioAnualFromPagos(pagos, anio) : []),
    [cuentaActiva, pagos, anio],
  );

  if (!cuentaActiva) return null;

  const completos = meses.filter((m) => m.estado === 'completo').length;

  return (
    <SectionCard
      title={`Calendario ${anio}`}
      subtitle={`${completos} de 12 meses con pago completo · Meta ${formatCurrency(META_MENSUAL_OBLIGATORIA)}/mes (solo verificados)`}
      actions={actions}
      padding="none"
    >
      <div className="data-table-shell overflow-x-auto clean-scroll">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                Mes
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums">
                Meta
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums">
                Aporte verificado
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {meses.map((mes) => (
              <FilaMes key={mes.mesNumero} mes={mes} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-slate-100 px-4 py-3">
        {(Object.entries(LABEL_ESTADO_MES) as [keyof typeof LABEL_ESTADO_MES, string][]).map(
          ([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <StatusBadge status={estadoMesToBadge(key)} label={label} />
            </div>
          ),
        )}
      </div>
    </SectionCard>
  );
}

function FilaMes({ mes }: { mes: MesCalendario }) {
  const esMesActual =
    mes.anio === new Date().getFullYear() && mes.mesNumero === new Date().getMonth() + 1;

  return (
    <tr
      className={[
        'motion-safe-transition hover:bg-blue-50/30',
        esMesActual ? 'bg-sky-50/40' : '',
      ].join(' ')}
    >
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
        {mes.mes}
        {esMesActual && (
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-sky-600">
            Actual
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-600">
        {formatCurrency(mes.meta)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-600">
        {mes.aportado > 0 ? formatCurrency(mes.aportado) : '—'}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        {mes.esFuturo ? (
          <span className="text-slate-400">—</span>
        ) : (
          <StatusBadge
            status={estadoMesToBadge(mes.estado)}
            label={LABEL_ESTADO_MES[mes.estado]}
          />
        )}
      </td>
    </tr>
  );
}
