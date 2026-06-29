// Dashboard — resumen de la cuenta seleccionada + actividad reciente
import { Link } from 'react-router-dom';
import { StatCard } from '@shared/ui/organisms/StatCard';
import { StatGrid } from '@shared/ui/organisms/StatGrid';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { SectionHeading } from '@shared/ui/molecules/SectionHeading';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { ROUTES } from '@shared/config/routes';
import { useResumenAhorro } from '@features/cuentas/application/hooks/useResumenAhorro';
import { useAportes } from '@features/cuentas/application/hooks/useAportes';
import type { Aporte } from '@features/cuentas/domain/cuenta.entity';
import { AccesosRapidosMenu } from '../components/AccesosRapidosMenu';

export function DashboardOverview() {
  const { cuentaActiva } = useCuentaActiva();
  const { cuentas, cargando: cargandoResumen } = useResumenAhorro();
  const { aportes, cargando: cargandoAportes } = useAportes({ cuentaId: cuentaActiva?.id, limit: 10 });

  if (!cuentaActiva) return null;

  const cuenta = cuentas.find((c) => c.cuentaId === cuentaActiva.id);

  const aporteColumns: TableColumn<Aporte>[] = [
    { key: 'fechaRegistro', header: 'Fecha', render: (r) => formatDate(r.fechaRegistro) },
    {
      key: 'monto',
      header: 'Monto',
      numeric: true,
      render: (r) => (
        <span className="font-medium tabular-nums">{formatCurrency(r.monto, 'USD')}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.estado} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AccesosRapidosMenu />

      <StatGrid columns={3}>
        <StatCard
          label="Saldo disponible"
          value={formatCurrency(cuenta?.saldoDisponible ?? 0, 'USD')}
          tone="mint"
          navIcon="savings"
        />
        <StatCard
          label="Progreso del mes"
          value={`${cuenta?.metaCumplida ? 100 : cuenta?.progresoMes ?? 0}%`}
          trend={
            cuenta?.metaCumplida
              ? 'Meta cumplida'
              : `Meta: ${formatCurrency(cuenta?.metaMensual ?? 0, 'USD')}`
          }
          trendUp={cuenta?.metaCumplida}
          tone="indigo"
          navIcon="payments"
        />
        <StatCard
          label="Saldo pendiente"
          value={formatCurrency(cuenta?.saldoPendiente ?? 0, 'USD')}
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
        {cargandoAportes || cargandoResumen ? (
          <p className="py-6 text-center text-sm text-slate-500">Cargando actividad…</p>
        ) : (
          <Table
            columns={aporteColumns}
            data={aportes}
            emptyMessage="Aún no tienes aportes registrados en esta cuenta."
          />
        )}
      </section>
    </div>
  );
}
