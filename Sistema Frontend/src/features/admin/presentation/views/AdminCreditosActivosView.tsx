import { useState } from 'react';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { Modal } from '@shared/ui/molecules/Modal';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { getAmortizacionCredito, getCreditosActivosAdmin } from '@shared/data/adminMockData';
import { LABEL_ESTADO_CREDITO, type Credito } from '@shared/data/mockData';

export function AdminCreditosActivosView() {
  const creditos = getCreditosActivosAdmin();
  const [detalle, setDetalle] = useState<Credito | null>(null);
  const cuotas = detalle ? getAmortizacionCredito(detalle.id) : [];

  const saldoPendiente = (c: Credito) => c.cuotaMensual * c.cuotasPendientes;

  const columns: TableColumn<Credito>[] = [
    { key: 'id', header: 'ID' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
    { key: 'plazoMeses', header: 'Plazo', render: (r) => `${r.plazoMeses} meses` },
    { key: 'cuotaMensual', header: 'Cuota', numeric: true, render: (r) => formatCurrency(r.cuotaMensual) },
    {
      key: 'saldo',
      header: 'Saldo pendiente',
      numeric: true,
      render: (r) => formatCurrency(saldoPendiente(r)),
    },
    { key: 'estado', header: 'Estado', render: (r) => <StatusBadge status={r.estado} label={LABEL_ESTADO_CREDITO[r.estado]} /> },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <TableActions>
          <TableActionButton type="button" onClick={() => setDetalle(r)}>
            Ver detalle
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Créditos aprobados y activos">
        <Table columns={columns} data={creditos} />
      </SectionCard>

      <Modal isOpen={!!detalle} onClose={() => setDetalle(null)} title={`Detalle del préstamo ${detalle?.id}`}>
        {detalle && (
          <div className="space-y-5">
            <dl className="flex flex-col gap-3 text-sm">
              <div><dt className="text-slate-500">Tipo</dt><dd>{detalle.tipo}</dd></div>
              <div><dt className="text-slate-500">Monto original</dt><dd className="font-medium">{formatCurrency(detalle.monto)}</dd></div>
              <div><dt className="text-slate-500">Tasa anual</dt><dd>{(detalle.tasaAnual * 100).toFixed(1)}%</dd></div>
              <div><dt className="text-slate-500">Cuotas pagadas</dt><dd>{detalle.cuotasPagadas} / {detalle.plazoMeses}</dd></div>
              <div><dt className="text-slate-500">Próximo vencimiento</dt><dd>{formatDate(detalle.proximoVencimiento)}</dd></div>
              <div><dt className="text-slate-500">Saldo pendiente</dt><dd className="font-medium text-blue-600">{formatCurrency(saldoPendiente(detalle))}</dd></div>
            </dl>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Tabla de cuotas</p>
              <Table
                columns={[
                  { key: 'numero', header: 'No.' },
                  { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
                  { key: 'capital', header: 'Capital', numeric: true, render: (r) => formatCurrency(r.capital) },
                  { key: 'interes', header: 'Interés', numeric: true, render: (r) => formatCurrency(r.interes) },
                  { key: 'total', header: 'Total', numeric: true, render: (r) => formatCurrency(r.total) },
                  { key: 'estado', header: 'Estado', render: (r) => <StatusBadge status={r.estado} /> },
                ]}
                data={cuotas}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
