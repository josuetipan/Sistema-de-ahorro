import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { FormField } from '@shared/ui/molecules/FormField';
import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { getCreditosActivosAdmin, getPagosAtrasados, getProximosVencimientos } from '@shared/data/adminMockData';
import { MOCK_PAGOS, type Pago } from '@shared/data/mockData';

export function AdminPagosView() {
  const toast = useToast();
  const [tab, setTab] = useState('registrar');
  const [pagos, setPagos] = useState(MOCK_PAGOS);
  const [form, setForm] = useState({ creditoId: '', monto: '', cuota: '' });

  const creditos = getCreditosActivosAdmin();
  const atrasados = getPagosAtrasados();
  const proximos = getProximosVencimientos();

  const registrarPago = () => {
    if (!form.creditoId || !form.monto) {
      toast.error('Completa crédito y monto.');
      return;
    }
    const nuevo: Pago = {
      id: `p-${Date.now()}`,
      creditoId: form.creditoId,
      fecha: new Date().toISOString(),
      monto: Number(form.monto),
      cuotaNumero: Number(form.cuota) || 1,
      estado: 'aprobado',
      comprobante: `PAG-2026-${String(pagos.length + 1).padStart(5, '0')}`,
    };
    setPagos((prev) => [nuevo, ...prev]);
    setForm({ creditoId: '', monto: '', cuota: '' });
    toast.success('Pago registrado correctamente.');
  };

  const verComprobante = (comprobante: string) => {
    toast.show(`Comprobante ${comprobante} (demo).`, 'info');
  };

  const pagoColumns: TableColumn<Pago>[] = [
    { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
    { key: 'creditoId', header: 'Crédito' },
    { key: 'cuotaNumero', header: 'Cuota' },
    { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
    { key: 'estado', header: 'Estado', render: (r) => <StatusBadge status={r.estado} /> },
    { key: 'comprobante', header: 'Comprobante' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <TableActions>
          <TableActionButton type="button" onClick={() => verComprobante(r.comprobante)}>
            Ver comprobante
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  return (
    <TabbedContentShell
      tabs={[
        { id: 'registrar', label: 'Registrar pago' },
        { id: 'historial', label: 'Historial' },
        { id: 'atrasados', label: 'Pagos atrasados' },
        { id: 'vencimientos', label: 'Próximos vencimientos' },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      ariaLabel="Pagos"
    >
      {tab === 'registrar' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-slate-700">Datos del pago</p>
          <FormField label="Crédito" htmlFor="pago-credito" required>
            <Select
              id="pago-credito"
              value={form.creditoId}
              onChange={(e) => setForm({ ...form, creditoId: e.target.value })}
            >
              <option value="">Seleccionar crédito</option>
              {creditos.map((c) => (
                <option key={c.id} value={c.id}>{c.id} — {c.tipo} ({formatCurrency(c.cuotaMensual)}/mes)</option>
              ))}
            </Select>
          </FormField>
          <FormField label="No. cuota" htmlFor="pago-cuota">
            <Input id="pago-cuota" type="number" min={1} value={form.cuota} onChange={(e) => setForm({ ...form, cuota: e.target.value })} />
          </FormField>
          <FormField label="Monto" htmlFor="pago-monto" required>
            <Input id="pago-monto" type="number" min={0} step="0.01" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} />
          </FormField>
          <div className="mt-2">
            <ActionButton type="button" onClick={registrarPago}>Registrar pago</ActionButton>
          </div>
        </div>
      )}

      {tab === 'historial' && (
        <Table columns={pagoColumns} data={pagos} />
      )}

      {tab === 'atrasados' && (
        <Table columns={pagoColumns} data={atrasados} emptyMessage="No hay pagos atrasados." />
      )}

      {tab === 'vencimientos' && (
        <Table
          columns={[
            { key: 'creditoId', header: 'Crédito' },
            { key: 'socio', header: 'Socio' },
            { key: 'tipo', header: 'Tipo' },
            { key: 'fecha', header: 'Vencimiento', render: (r) => formatDate(r.fecha) },
            { key: 'monto', header: 'Cuota', numeric: true, render: (r) => formatCurrency(r.monto) },
          ]}
          data={proximos}
        />
      )}
    </TabbedContentShell>
  );
}
