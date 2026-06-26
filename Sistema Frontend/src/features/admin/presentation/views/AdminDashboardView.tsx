// Admin Dashboard — grid de 2 columnas en desktop para los gráficos
import { StatCard } from '@shared/ui/organisms/StatCard';
import { StatGrid } from '@shared/ui/organisms/StatGrid';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { SectionHeading } from '@shared/ui/molecules/SectionHeading';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import {
  ADMIN_ALERTAS,
  ADMIN_STATS,
  CHART_CARTERA_VENCIDA,
  CHART_INGRESOS,
  CHART_SOLICITUDES,
  LABEL_TIPO_MOV_ADMIN,
  MOCK_MOVIMIENTOS_ADMIN,
  type MovimientoAdmin,
} from '@shared/data/adminMockData';
import { SimpleBarChart } from '../components/SimpleBarChart';

const movimientoColumns: TableColumn<MovimientoAdmin>[] = [
  { key: 'fecha',       header: 'Fecha',       render: (r) => formatDate(r.fecha) },
  { key: 'tipo',        header: 'Tipo',         render: (r) => LABEL_TIPO_MOV_ADMIN[r.tipo] },
  { key: 'socio',       header: 'Socio' },
  { key: 'monto',       header: 'Monto',        numeric: true, render: (r) => formatCurrency(r.monto) },
  { key: 'descripcion', header: 'Descripción' },
];

export function AdminDashboardView() {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Fila 1: KPIs ── */}
      <StatGrid columns={4}>
        <StatCard
          label="Socios activos"
          value={String(ADMIN_STATS.sociosActivos)}
          trend={`${ADMIN_STATS.totalSocios} en total`}
          tone="blue"
          navIcon="users"
        />
        <StatCard
          label="Total ahorros"
          value={formatCurrency(ADMIN_STATS.totalAhorros)}
          tone="mint"
          navIcon="savings"
        />
        <StatCard
          label="Créditos activos"
          value={String(ADMIN_STATS.creditosActivos)}
          trend={`Cartera: ${formatCurrency(ADMIN_STATS.carteraActiva)}`}
          tone="indigo"
          navIcon="credits"
        />
        <StatCard
          label="Pagos del mes"
          value={formatCurrency(ADMIN_STATS.pagosMes)}
          trend={`${ADMIN_STATS.solicitudesPendientes} solicitudes pend.`}
          tone="amber"
          navIcon="payments"
        />
      </StatGrid>

      {/* ── Fila 2: Gráficos en grid 3 columnas ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard title="Ingresos mensuales" padding="md">
          <SimpleBarChart
            data={CHART_INGRESOS}
            valuePrefix="$"
            colorClass="bg-emerald-500"
          />
        </SectionCard>
        <SectionCard title="Cartera vencida" padding="md">
          <SimpleBarChart
            data={CHART_CARTERA_VENCIDA}
            valueSuffix=" créd."
            colorClass="bg-red-400"
          />
        </SectionCard>
        <SectionCard title="Solicitudes recibidas" padding="md">
          <SimpleBarChart
            data={CHART_SOLICITUDES}
            colorClass="bg-indigo-400"
          />
        </SectionCard>
      </div>

      {/* ── Fila 3: Movimientos + Alertas ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionHeading title="Últimos movimientos" />
          <Table columns={movimientoColumns} data={MOCK_MOVIMIENTOS_ADMIN.slice(0, 6)} />
        </section>

        <section>
          <SectionHeading title="Alertas importantes" />
          <div className="surface-list">
            {ADMIN_ALERTAS.map((alerta) => (
              <div
                key={alerta.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <p className="text-sm text-slate-700">{alerta.label}</p>
                <StatusBadge status={alerta.status} />
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
