import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { formatCurrency, formatNumber } from '@shared/lib/formatters';
import { MOCK_APORTES_MENSUALES_ADMIN } from '@shared/data/adminMockData';

const aportes = MOCK_APORTES_MENSUALES_ADMIN;

const totalAportes = aportes.length;
const aportesPendientes = aportes.filter((aporte) => aporte.estado === 'pendiente').length;
const montoRegistrado = aportes.reduce((sum, aporte) => sum + aporte.monto, 0);
const metaAcumulada = aportes.reduce((sum, aporte) => sum + aporte.metaMensual, 0);
const diferenciaMeta = montoRegistrado - metaAcumulada;
const promedioAporte = totalAportes ? montoRegistrado / totalAportes : 0;
const aportesSobreMeta = aportes.filter((aporte) => aporte.monto >= aporte.metaMensual).length;
const cumplimiento = metaAcumulada ? Math.round((montoRegistrado / metaAcumulada) * 100) : 0;
const cuentasUnicas = new Set(aportes.map((aporte) => aporte.cuentaId)).size;
const sociosUnicos = new Set(aportes.map((aporte) => aporte.socioId)).size;
const comprobantes = aportes.filter((aporte) => Boolean(aporte.comprobante)).length;
const archivos = aportes.filter((aporte) => Boolean(aporte.archivoNombre)).length;

const primaryMetrics = [
  { label: 'Aportes registrados', value: formatNumber(totalAportes), tone: 'border-blue-500 bg-blue-50/70' },
  { label: 'Aportes pendientes', value: formatNumber(aportesPendientes), tone: 'border-amber-500 bg-amber-50/70' },
  { label: 'Monto registrado', value: formatCurrency(montoRegistrado), tone: 'border-emerald-500 bg-emerald-50/70' },
  { label: 'Cumplimiento', value: `${formatNumber(cumplimiento)}%`, tone: 'border-indigo-500 bg-indigo-50/70' },
];

const secondaryMetrics = [
  { label: 'Meta acumulada', value: formatCurrency(metaAcumulada) },
  { label: 'Diferencia meta', value: formatCurrency(diferenciaMeta) },
  { label: 'Promedio aporte', value: formatCurrency(promedioAporte) },
  { label: 'Sobre la meta', value: formatNumber(aportesSobreMeta) },
  { label: 'Cuentas', value: formatNumber(cuentasUnicas) },
  { label: 'Socios', value: formatNumber(sociosUnicos) },
  { label: 'Comprobantes', value: formatNumber(comprobantes) },
  { label: 'Archivos', value: formatNumber(archivos) },
];

export function AdminDashboardView() {
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {primaryMetrics.map((metric) => (
          <div
            key={metric.label}
            className={`min-h-[126px] rounded-lg border-l-4 border-y border-r border-slate-200 p-4 shadow-xs ${metric.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-4 break-words text-3xl font-bold leading-none tracking-normal text-slate-950 md:text-4xl">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <SectionCard title="Resumen numerico de aportes" padding="none">
        <div className="grid overflow-hidden rounded-b-lg sm:grid-cols-2 lg:grid-cols-4">
          {secondaryMetrics.map((metric) => (
            <div key={metric.label} className="border-b border-r border-slate-100 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {metric.label}
              </p>
              <p className="mt-2 break-words text-2xl font-semibold tabular-nums tracking-normal text-slate-900">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
