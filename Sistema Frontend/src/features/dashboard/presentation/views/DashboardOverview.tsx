// Dashboard — resumen general con enlaces a cada sección
import { Link } from 'react-router-dom';
import { StatCard } from '@shared/ui/organisms/StatCard';
import { StatGrid } from '@shared/ui/organisms/StatGrid';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { SectionHeading } from '@shared/ui/molecules/SectionHeading';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { ROUTES } from '@shared/config/routes';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import { buildCalendarioAnualFromPagos } from '@features/ahorro/domain/pago.rules';
import type { PagoAhorro } from '@features/ahorro/domain/pago.entity';
import { AccesosRapidosMenu } from '../components/AccesosRapidosMenu';
import { PublicidadCarrusel } from '../components/PublicidadCarrusel';

const LABEL_ESTADO_PAGO: Record<PagoAhorro['estado'], string> = {
  PENDIENTE_VERIFICACION: 'Pendiente',
  VERIFICADO: 'Verificado',
  RECHAZADO: 'Rechazado',
};

export function DashboardOverview() {
  const { cuentaActiva } = useCuentaActiva();
  const { pagos, resumen, cargando } = usePagosAhorro({ cuentaId: cuentaActiva?.id });

  if (!cuentaActiva) return null;

  const anioActual = new Date().getFullYear();
  const mesesCumplidos = buildCalendarioAnualFromPagos(pagos, anioActual).filter(
    (m) => m.estado === 'completo',
  ).length;

  const actividadReciente = [...pagos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3);

  const pagoColumns: TableColumn<PagoAhorro>[] = [
    { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
    {
      key: 'monto',
      header: 'Monto',
      numeric: true,
      render: (r) => (
        <span className="font-medium tabular-nums">{formatCurrency(r.monto)}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.estado.toLowerCase()} label={LABEL_ESTADO_PAGO[r.estado]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PublicidadCarrusel />
      <AccesosRapidosMenu />

      <StatGrid columns={3}>
        <StatCard
          label="Saldo disponible"
          value={formatCurrency(resumen.saldoDisponible)}
          tone="mint"
          navIcon="savings"
        />
        <StatCard
          label="Progreso del mes"
          value={formatCurrency(resumen.progresoMes)}
          trend={
            resumen.metaCumplida
              ? 'Meta cumplida (verificado)'
              : `Meta: ${formatCurrency(resumen.metaMensual)}`
          }
          trendUp={resumen.metaCumplida}
          tone="indigo"
          navIcon="payments"
        />
        <StatCard
          label="Saldo pendiente"
          value={formatCurrency(resumen.saldoPendiente)}
          trend="Por verificar por contador"
          tone="amber"
          navIcon="zap"
        />
      </StatGrid>

      <section>
        <SectionHeading
          title="Actividad reciente"
          action={
            <Link to={ROUTES.MIS_AHORROS} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Ver todos los pagos
            </Link>
          }
        />
        {cargando ? (
          <p className="py-6 text-center text-sm text-slate-500">Cargando pagos…</p>
        ) : (
          <Table
            columns={pagoColumns}
            data={actividadReciente}
            emptyMessage="Aún no tienes pagos registrados en esta cuenta."
          />
        )}
        {!cargando && mesesCumplidos > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            {mesesCumplidos} mes(es) con meta cumplida en {anioActual} (solo pagos verificados).
          </p>
        )}
      </section>
    </div>
  );
}
