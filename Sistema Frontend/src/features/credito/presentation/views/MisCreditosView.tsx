import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { ButtonGroup } from '@shared/ui/molecules/ButtonGroup';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';
import { SectionHeading } from '@shared/ui/molecules/SectionHeading';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { StatCard } from '@shared/ui/organisms/StatCard';
import { StatGrid } from '@shared/ui/organisms/StatGrid';
import { useToast } from '@shared/hooks/useToast';
import type { Credito } from '../../domain/credito.entity';
import { buildAmortizacion, LABEL_ESTADO_CREDITO } from '../../domain/credito.rules';
import { useConsultarCreditos } from '../hooks/useConsultarCreditos';

const TAB_ITEMS = [
  { id: 'todos',     label: 'Todos' },
  { id: 'activo',    label: 'Activos' },
  { id: 'aprobado',  label: 'Aprobados' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'rechazado', label: 'Rechazados' },
  { id: 'pagado',    label: 'Pagados' },
];

export function MisCreditosView() {
  const toast = useToast();
  const { creditos: todosCreditos, isLoading } = useConsultarCreditos();
  const [tab, setTab] = useState<string>('todos');
  const [creditoSel, setCreditoSel] = useState<Credito | null>(null);

  const creditos =
    tab === 'todos' ? todosCreditos : todosCreditos.filter((c) => c.estado === tab);

  const columns: TableColumn<Credito>[] = [
    { key: 'tipo', header: 'Tipo' },
    { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
    { key: 'plazoMeses', header: 'Plazo', render: (r) => `${r.plazoMeses} m` },
    { key: 'cuotaMensual', header: 'Cuota', numeric: true, render: (r) => formatCurrency(r.cuotaMensual) },
    {
      key: 'cuotasPagadas',
      header: 'Pagadas',
      render: (r) => `${r.cuotasPagadas} / ${r.cuotasPagadas + r.cuotasPendientes}`,
    },
    { key: 'proximoVencimiento', header: 'Vencimiento', render: (r) => formatDate(r.proximoVencimiento) },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => <StatusBadge status={r.estado} label={LABEL_ESTADO_CREDITO[r.estado]} />,
    },
    {
      key: 'id',
      header: '',
      render: (r) => (
        <ActionButton type="button" variant="ghost" size="sm" onClick={() => setCreditoSel(r)}>
          Ver tabla
        </ActionButton>
      ),
    },
  ];

  const amortizacion = creditoSel ? buildAmortizacion(creditoSel) : [];
  const activos = todosCreditos.filter((c) => c.estado === 'activo');
  const saldoPendiente = activos.reduce((acc, c) => acc + c.cuotaMensual * c.cuotasPendientes, 0);
  const cuotasPagadas = activos.reduce((acc, c) => acc + c.cuotasPagadas, 0);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando créditos…</p>;
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── KPIs ── */}
      <StatGrid columns={4}>
        <StatCard label="Créditos activos" value={String(activos.length)} tone="indigo" navIcon="credits" />
        <StatCard label="Saldo pendiente" value={formatCurrency(saldoPendiente)} tone="amber" navIcon="payments" />
        <StatCard label="Cuotas pagadas" value={String(cuotasPagadas)} tone="mint" navIcon="savings" />
        <StatCard
          label="Próxima cuota"
          value={creditoSel ? formatDate(creditoSel.proximoVencimiento) : '—'}
          tone="sky"
          navIcon="history"
        />
      </StatGrid>

      {/* ── Tabla con pestañas ── */}
      <TabbedContentShell tabs={TAB_ITEMS} activeTab={tab} onTabChange={setTab} ariaLabel="Estado del crédito">
        <div className="flex flex-col gap-4">
          <Table columns={columns} data={creditos} emptyMessage="No hay créditos en esta categoría." />

          {creditoSel && (
            <section>
              <SectionHeading
                title={`Amortización — ${creditoSel.tipo} · ${LABEL_ESTADO_CREDITO[creditoSel.estado]} · ${formatCurrency(creditoSel.monto)}`}
              />
              <Table
                columns={[
                  { key: 'numero', header: '#', render: (r) => r.numero },
                  { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
                  { key: 'capital', header: 'Capital', numeric: true, render: (r) => formatCurrency(r.capital) },
                  { key: 'interes', header: 'Interés', numeric: true, render: (r) => formatCurrency(r.interes) },
                  { key: 'total', header: 'Cuota', numeric: true, render: (r) => formatCurrency(r.total) },
                  { key: 'estado', header: 'Estado', render: (r) => <StatusBadge status={r.estado} /> },
                ]}
                data={amortizacion}
              />
              <ButtonGroup className="mt-3">
                <ActionButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.show('Redirigiendo a pagos (demo).', 'info')}
                >
                  Pagar cuota
                </ActionButton>
                <ActionButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.success('Detalle del crédito listo (demo).')}
                >
                  Ver detalle
                </ActionButton>
              </ButtonGroup>
            </section>
          )}
        </div>
      </TabbedContentShell>

    </div>
  );
}
