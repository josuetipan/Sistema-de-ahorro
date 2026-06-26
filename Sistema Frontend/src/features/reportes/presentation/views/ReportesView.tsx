// Reportes: tabla resumen y exportación
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { MOCK_HISTORIAL } from '@shared/data/mockData';

interface FilaReporte {
  id: string;
  periodo: string;
  ahorros: number;
  creditos: number;
  pagos: number;
}

const DATA: FilaReporte[] = [
  {
    id: 'r1',
    periodo: '2026-05',
    ahorros: MOCK_HISTORIAL.filter((h) => h.categoria === 'ahorro').length,
    creditos: 2,
    pagos: 3,
  },
  {
    id: 'r2',
    periodo: '2026-04',
    ahorros: 4,
    creditos: 1,
    pagos: 2,
  },
];

export function ReportesView() {
  const toast = useToast();

  const columns: TableColumn<FilaReporte>[] = [
    { key: 'periodo', header: 'Periodo', render: (r) => r.periodo },
    { key: 'ahorros', header: 'Mov. ahorro', render: (r) => String(r.ahorros) },
    { key: 'creditos', header: 'Créditos', render: (r) => String(r.creditos) },
    { key: 'pagos', header: 'Pagos', render: (r) => String(r.pagos) },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">Generado el {formatDate(new Date())}</p>
        <ActionButton
          type="button"
          variant="outline"
          size="sm"
          onClick={() => toast.success('Reporte exportado (demo).')}
        >
          Exportar
        </ActionButton>
      </div>
      <SectionCard title="Resumen mensual">
        <Table columns={columns} data={DATA} />
        <p className="mt-4 text-xs text-gray-400">
          Totales referenciales · {formatCurrency(12500)} en ahorro acumulado
        </p>
      </SectionCard>
    </div>
  );
}
