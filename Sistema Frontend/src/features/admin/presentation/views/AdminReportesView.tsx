import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { ADMIN_STATS, MOCK_SOCIOS, getCreditosActivosAdmin } from '@shared/data/adminMockData';
import { MOCK_PAGOS } from '@shared/data/mockData';

interface FilaReporte {
  id: string;
  concepto: string;
  valor: string | number;
}

function exportar(toast: ReturnType<typeof useToast>, formato: 'PDF' | 'Excel') {
  toast.success(`Reporte exportado en ${formato} (demo).`);
}

function ReporteTabla({ titulo, filas }: { titulo: string; filas: FilaReporte[] }) {
  const columns: TableColumn<FilaReporte>[] = [
    { key: 'concepto', header: 'Concepto' },
    { key: 'valor', header: 'Valor', numeric: true, render: (r) => (typeof r.valor === 'number' ? formatCurrency(r.valor) : r.valor) },
  ];
  return (
    <SectionCard title={titulo}>
      <Table columns={columns} data={filas} />
    </SectionCard>
  );
}

export function AdminReportesView() {
  const toast = useToast();
  const [tab, setTab] = useState('ahorros');

  const creditos = getCreditosActivosAdmin();
  const morosos = creditos.filter((c) => c.cuotasPendientes > 2);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">Generado el {formatDate(new Date())}</p>
        <div className="flex gap-2">
          <ActionButton type="button" variant="outline" size="sm" onClick={() => exportar(toast, 'PDF')}>
            Exportar PDF
          </ActionButton>
          <ActionButton type="button" variant="outline" size="sm" onClick={() => exportar(toast, 'Excel')}>
            Exportar Excel
          </ActionButton>
        </div>
      </div>

      <TabbedContentShell
        tabs={[
          { id: 'ahorros', label: 'Ahorros' },
          { id: 'creditos', label: 'Créditos' },
          { id: 'pagos', label: 'Pagos' },
          { id: 'morosidad', label: 'Morosidad' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        ariaLabel="Reportes"
      >
        {tab === 'ahorros' && (
          <ReporteTabla
            titulo="Reporte de ahorros"
            filas={[
              { id: '1', concepto: 'Total ahorros del sistema', valor: ADMIN_STATS.totalAhorros },
              { id: '2', concepto: 'Socios con cuenta activa', valor: MOCK_SOCIOS.filter((s) => s.estado === 'activo').length },
              { id: '3', concepto: 'Promedio por socio', valor: Math.round(ADMIN_STATS.totalAhorros / MOCK_SOCIOS.length) },
            ]}
          />
        )}
        {tab === 'creditos' && (
          <ReporteTabla
            titulo="Reporte de créditos"
            filas={[
              { id: '1', concepto: 'Créditos activos', valor: creditos.length },
              { id: '2', concepto: 'Cartera total', valor: ADMIN_STATS.carteraActiva },
              { id: '3', concepto: 'Solicitudes pendientes', valor: ADMIN_STATS.solicitudesPendientes },
            ]}
          />
        )}
        {tab === 'pagos' && (
          <ReporteTabla
            titulo="Reporte de pagos"
            filas={[
              { id: '1', concepto: 'Pagos del mes', valor: ADMIN_STATS.pagosMes },
              { id: '2', concepto: 'Pagos registrados', valor: MOCK_PAGOS.length },
              { id: '3', concepto: 'Pagos pendientes', valor: MOCK_PAGOS.filter((p) => p.estado === 'pendiente').length },
            ]}
          />
        )}
        {tab === 'morosidad' && (
          <ReporteTabla
            titulo="Reporte de morosidad"
            filas={[
              { id: '1', concepto: 'Créditos en mora', valor: morosos.length },
              { id: '2', concepto: 'Cartera vencida estimada', valor: morosos.reduce((s, c) => s + c.cuotaMensual * c.cuotasPendientes, 0) },
              { id: '3', concepto: 'Tasa de morosidad', valor: `${((morosos.length / creditos.length) * 100).toFixed(1)}%` },
            ]}
          />
        )}
      </TabbedContentShell>
    </div>
  );
}
