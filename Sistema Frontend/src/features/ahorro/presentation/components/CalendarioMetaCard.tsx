import { type ReactNode } from 'react';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { formatCurrency } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useCalendario } from '@features/cuentas/application/hooks/useCalendario';
import type { MesCalendario } from '@features/cuentas/domain/cuenta.entity';

interface CalendarioMetaCardProps {
  anio?: number;
  actions?: ReactNode;
}

const NOMBRES_MES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const LABEL_ESTADO: Record<string, string> = {
  sin_registro: 'Sin registro',
  pendiente: 'Pendiente',
  verificado: 'Verificado',
  incompleto: 'Incompleto',
  rechazado: 'Rechazado',
  atrasado: 'Atrasado',
};

function labelEstado(estado: string): string {
  return LABEL_ESTADO[estado] ?? estado.replace(/_/g, ' ');
}

export function CalendarioMetaCard({
  anio = new Date().getFullYear(),
  actions,
}: CalendarioMetaCardProps) {
  const { cuentaActiva } = useCuentaActiva();
  const { calendario, cargando, error } = useCalendario({ cuentaId: cuentaActiva?.id, anio });

  if (!cuentaActiva) return null;

  const meses = calendario?.meses ?? [];

  return (
    <SectionCard
      title={`Calendario ${anio}`}
      subtitle={
        calendario
          ? `${calendario.mesesCumplidos} de 12 meses cumplidos · Meta ${formatCurrency(
              calendario.metaMensual,
              'USD',
            )}/mes · Total ahorrado ${formatCurrency(calendario.totalAhorrado, 'USD')}`
          : 'Estado de tu aporte mensual'
      }
      actions={actions}
      padding="none"
    >
      {error ? (
        <div className="px-4 py-8">
          <EmptyState description={error} />
        </div>
      ) : cargando ? (
        <div className="px-4 py-8">
          <EmptyState description="Cargando calendario…" />
        </div>
      ) : (
        <div className="data-table-shell overflow-x-auto clean-scroll">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                  Mes
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums">
                  Meta mensual
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums">
                  Aportado
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                  Comprobante
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold text-slate-500">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {meses.map((mes) => (
                <FilaMes key={mes.mes} mes={mes} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function FilaMes({ mes }: { mes: MesCalendario }) {
  const ahora = new Date();
  const esMesActual = mes.mes === `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;

  return (
    <tr
      className={['motion-safe-transition hover:bg-blue-50/30', esMesActual ? 'bg-sky-50/40' : ''].join(' ')}
    >
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
        {NOMBRES_MES[mes.numeroMes - 1] ?? mes.mes}
        {esMesActual && (
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-sky-600">Actual</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-600">
        {formatCurrency(mes.metaMensual, 'USD')}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-600">
        {mes.montoAportado > 0 ? formatCurrency(mes.montoAportado, 'USD') : '—'}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        {mes.comprobante ? (
          <span className="font-mono text-xs text-slate-600">{mes.comprobante}</span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <StatusBadge status={mes.estado} label={labelEstado(mes.estado)} />
      </td>
    </tr>
  );
}
