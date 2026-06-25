import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Button } from '@shared/ui/atoms/Button';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { FilterChipGroup } from '@shared/ui/molecules/FilterChipGroup';
import { Modal } from '@shared/ui/molecules/Modal';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { MOCK_SOLICITUDES_ADMIN, type SolicitudCreditoAdmin } from '@shared/data/adminMockData';
import { NavIcon } from '@shared/ui/atoms/NavIcon';

export function AdminSolicitudesCreditoView() {
  const toast = useToast();
  const [solicitudes, setSolicitudes] = useState(MOCK_SOLICITUDES_ADMIN);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
  const [detalle, setDetalle] = useState<SolicitudCreditoAdmin | null>(null);

  const filtradas = filtro === 'todas' ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  const resolver = (id: string, estado: 'aprobado' | 'rechazado') => {
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s)));
    setDetalle(null);
    toast.success(`Solicitud ${estado === 'aprobado' ? 'aprobada' : 'rechazada'}.`);
  };

  const columns: TableColumn<SolicitudCreditoAdmin>[] = [
    { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
    { key: 'solicitante', header: 'Solicitante' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
    { key: 'plazoMeses', header: 'Plazo', render: (r) => `${r.plazoMeses} meses` },
    { key: 'estado', header: 'Estado', render: (r) => <StatusBadge status={r.estado} /> },
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
      <div className="flex flex-col gap-4">
      <FilterChipGroup
        value={filtro}
        onChange={setFiltro}
        ariaLabel="Estado de solicitud"
        options={[
          { value: 'todas', label: 'Todas', count: solicitudes.length },
          { value: 'pendiente', label: 'Pendientes', count: solicitudes.filter((s) => s.estado === 'pendiente').length },
          { value: 'aprobado', label: 'Aprobadas', count: solicitudes.filter((s) => s.estado === 'aprobado').length },
          { value: 'rechazado', label: 'Rechazadas', count: solicitudes.filter((s) => s.estado === 'rechazado').length },
        ]}
      />

      <SectionCard title="Solicitudes de crédito">
        <Table columns={columns} data={filtradas} />
      </SectionCard>
      </div>

      <Modal isOpen={!!detalle} onClose={() => setDetalle(null)} title="Detalle de solicitud">
        {detalle && (
          <div className="space-y-5">
            <dl className="flex flex-col gap-3 text-sm">
              <div><dt className="text-slate-500">Solicitante</dt><dd className="font-medium">{detalle.solicitante}</dd></div>
              <div><dt className="text-slate-500">Correo</dt><dd>{detalle.email}</dd></div>
              <div><dt className="text-slate-500">Monto</dt><dd className="font-medium text-blue-600">{formatCurrency(detalle.monto)}</dd></div>
              <div><dt className="text-slate-500">Plazo</dt><dd>{detalle.plazoMeses} meses</dd></div>
              <div><dt className="text-slate-500">Tipo</dt><dd>{detalle.tipo}</dd></div>
              <div><dt className="text-slate-500">Ingresos mensuales</dt><dd>{formatCurrency(detalle.ingresosMensuales)}</dd></div>
              <div><dt className="text-slate-500">Motivo</dt><dd>{detalle.motivo}</dd></div>
            </dl>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Documentos adjuntos</p>
              <ul className="space-y-2">
                {detalle.documentos.map((doc) => (
                  <li key={doc.nombre} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                    <NavIcon name="file" size={16} className="text-blue-500" />
                    <span>{doc.nombre}</span>
                    <span className="text-gray-400">({doc.tipo})</span>
                  </li>
                ))}
              </ul>
            </div>

            {detalle.estado === 'pendiente' && (
              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <Button type="button" variant="outline" onClick={() => resolver(detalle.id, 'rechazado')}>
                  Rechazar
                </Button>
                <ActionButton type="button" onClick={() => resolver(detalle.id, 'aprobado')}>
                  Aprobar
                </ActionButton>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
