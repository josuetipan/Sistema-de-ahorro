// Widget: panel principal del dashboard con resumen financiero
import { StatCard } from '@shared/ui/organisms/StatCard';
import { StatGrid } from '@shared/ui/organisms/StatGrid';
import { Chart } from '@shared/ui/organisms/Chart';
import { formatCurrency } from '@shared/lib/formatters';

export function DashboardPanel() {
  return (
    <section className="space-y-6" aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="text-balance text-2xl font-bold text-gray-900">
        Resumen Financiero
      </h1>
      <StatGrid columns={4}>
        <StatCard label="Ahorro total" value={formatCurrency(12500)} trend="+5.2%" trendUp />
        <StatCard label="Créditos activos" value="2" />
        <StatCard label="Saldo disponible" value={formatCurrency(8300)} />
        <StatCard label="Próximo pago" value={formatCurrency(450)} />
      </StatGrid>
      <Chart title="Movimientos del mes" />
    </section>
  );
}
