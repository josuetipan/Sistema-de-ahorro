import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import type { PagoAhorro } from '../../domain/pago.entity';

const LABEL_ESTADO: Record<PagoAhorro['estado'], string> = {
  PENDIENTE_VERIFICACION: 'Pendiente verificación',
  VERIFICADO: 'Verificado',
  RECHAZADO: 'Rechazado',
};

const BADGE_ESTADO: Record<PagoAhorro['estado'], string> = {
  PENDIENTE_VERIFICACION: 'pendiente',
  VERIFICADO: 'aprobado',
  RECHAZADO: 'rechazado',
};

interface PaymentListProps {
  pagos: PagoAhorro[];
  emptyMessage?: string;
  showCuenta?: boolean;
}

export function PaymentList({
  pagos,
  emptyMessage = 'No hay pagos registrados.',
  showCuenta = false,
}: PaymentListProps) {
  const columns: TableColumn<PagoAhorro>[] = [
    { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
    ...(showCuenta
      ? [{ key: 'numeroCuenta', header: 'Cuenta' } as TableColumn<PagoAhorro>]
      : []),
    {
      key: 'monto',
      header: 'Monto',
      numeric: true,
      render: (r) => <span className="font-medium tabular-nums">{formatCurrency(r.monto)}</span>,
    },
    { key: 'comprobante', header: 'Comprobante', render: (r) => <span className="font-mono text-xs">{r.comprobante}</span> },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => (
        <StatusBadge status={BADGE_ESTADO[r.estado]} label={LABEL_ESTADO[r.estado]} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={[...pagos].sort((a, b) => b.fecha.localeCompare(a.fecha))}
      emptyMessage={emptyMessage}
    />
  );
}
