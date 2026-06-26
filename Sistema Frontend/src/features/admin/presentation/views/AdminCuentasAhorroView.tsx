import { useMemo, useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { FilterChipGroup } from '@shared/ui/molecules/FilterChipGroup';
import { Modal } from '@shared/ui/molecules/Modal';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { MOCK_MOVIMIENTOS_ADMIN } from '@shared/data/adminMockData';
import {
  useCuentasAhorroAdmin,
  AdminCrearCuentaPanel,
  type CuentaAhorroPublica,
} from '@features/cuenta-ahorro';

type FiltroEstado = 'todas' | 'ACTIVA' | 'INACTIVA';

export function AdminCuentasAhorroView() {
  const toast = useToast();
  const { cuentas, cargando, recargar } = useCuentasAhorroAdmin();
  const [filtro, setFiltro] = useState<FiltroEstado>('todas');
  const [tab, setTab] = useState('lista');
  const [detalle, setDetalle] = useState<CuentaAhorroPublica | null>(null);

  const filtradas = useMemo(
    () => (filtro === 'todas' ? cuentas : cuentas.filter((c) => c.estado === filtro)),
    [cuentas, filtro],
  );

  const toggleEstado = (cuenta: CuentaAhorroPublica) => {
    toast.show('Cambio de estado disponible al integrar backend.');
    void cuenta;
    void recargar;
  };

  const columns: TableColumn<CuentaAhorroPublica>[] = [
    { key: 'numeroCuenta', header: 'No. cuenta' },
    { key: 'socioNombre', header: 'Socio' },
    { key: 'correo', header: 'Correo cuenta' },
    {
      key: 'codigoReferencia',
      header: 'Cód. referencia',
      render: (r) => r.codigoReferencia ?? '—',
    },
    { key: 'saldo', header: 'Saldo', numeric: true, render: (r) => formatCurrency(r.saldo) },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.estado.toLowerCase()} label={r.estado} />,
    },
    { key: 'fechaApertura', header: 'Apertura', render: (r) => formatDate(r.fechaApertura) },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <TableActions>
          <TableActionButton type="button" onClick={() => setDetalle(r)}>
            Historial
          </TableActionButton>
          <TableActionButton type="button" onClick={() => toggleEstado(r)}>
            {r.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  const movimientosCuenta = detalle
    ? MOCK_MOVIMIENTOS_ADMIN.filter((m) => m.socio === detalle.socioNombre)
    : [];

  return (
    <div className="flex flex-col gap-5">
      <TabbedContentShell
        tabs={[
          { id: 'lista', label: 'Lista de cuentas' },
          { id: 'crear', label: 'Crear cuenta' },
          { id: 'movimientos', label: 'Depósitos y retiros' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
        ariaLabel="Cuentas de ahorro"
      >
        {tab === 'lista' && (
          <>
            <FilterChipGroup
              value={filtro}
              onChange={setFiltro}
              ariaLabel="Estado de cuenta"
              options={[
                { value: 'todas', label: 'Todas', count: cuentas.length },
                { value: 'ACTIVA', label: 'Activas', count: cuentas.filter((c) => c.estado === 'ACTIVA').length },
                { value: 'INACTIVA', label: 'Inactivas', count: cuentas.filter((c) => c.estado === 'INACTIVA').length },
              ]}
            />
            <SectionCard title="Cuentas registradas" className="mt-4">
              {cargando ? (
                <p className="py-8 text-center text-sm text-slate-500">Cargando cuentas…</p>
              ) : (
                <Table columns={columns} data={filtradas} />
              )}
            </SectionCard>
          </>
        )}

        {tab === 'crear' && <AdminCrearCuentaPanel />}

        {tab === 'movimientos' && (
          <SectionCard title="Depósitos y retiros recientes">
            <Table
              columns={[
                { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
                { key: 'socio', header: 'Socio' },
                { key: 'tipo', header: 'Tipo', render: (r) => <StatusBadge status={r.tipo} label={r.tipo} /> },
                { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
                { key: 'descripcion', header: 'Descripción' },
              ]}
              data={MOCK_MOVIMIENTOS_ADMIN.filter((m) => m.tipo === 'deposito' || m.tipo === 'retiro')}
            />
          </SectionCard>
        )}
      </TabbedContentShell>

      <Modal isOpen={!!detalle} onClose={() => setDetalle(null)} title={`Historial — ${detalle?.numeroCuenta}`}>
        {detalle && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Socio: <strong>{detalle.socioNombre}</strong> · Saldo: {formatCurrency(detalle.saldo)}
            </p>
            <Table
              columns={[
                { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
                { key: 'tipo', header: 'Tipo' },
                { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
                { key: 'descripcion', header: 'Descripción' },
              ]}
              data={movimientosCuenta}
              emptyMessage="Sin movimientos para esta cuenta."
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
